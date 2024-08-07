import axios from 'axios';
import {removeLocalItem, removeSessionItem, setLocalItem} from "./storage";


// Axios 인스턴스 생성
const axiosHandler= axios.create({
    withCredentials: true
});

// 요청 인터셉터 추가
axiosHandler.interceptors.request.use(
    config => {
        let accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            accessToken = accessToken.replace(/"/g, '');
        }
        const jwt = `Bearer ${accessToken}`;
        if (jwt) {
            // 요청을 보내기 전에 Authorization 헤더에 토큰 추가
            config.headers.Authorization = jwt;
        }
        console.log("interceptors - requestURL : ",config.url)
        console.log("interceptors : add access token");
        return config;
    },
    error => {
        // 요청 오류가 있는 경우
        return Promise.reject(error);
    }
);

// 응답 인터셉터 추가
axiosHandler.interceptors.response.use(
    (response) => {
        // 응답 데이터 가공 등 작업
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            console.log('Token expired and Token rerotate');
            originalRequest._retry = true;
            try {
                const response = await axios.post('/api/auth/reissue', { withCredentials: true });
                const accessToken = response.headers['access'];

                if (accessToken) {
                    setLocalItem('accessToken', accessToken);
                    // 새로운 액세스 토큰을 얻은 후 원래 요청을 재시도
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return axiosHandler(originalRequest);
                } else {
                    console.error('Token rerotate failed. Access Token not found in response headers');
                    alert('서버와 통신에서 에러가 발생했습니다. 다시 로그인해 주세요.');
                    removeLocalItem('accessToken');
                    removeSessionItem('profile');
                    window.location.replace('/');
                    return Promise.reject(new Error('Token rerotate failed. Access Token not found'));
                }
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.error('Token rerotate failed. Refresh Token is invalid');
                    alert('토큰이 만료 되었습니다. 다시 로그인해 주세요.');
                    removeLocalItem('accessToken');
                    removeSessionItem('profile');
                    window.location.replace('/');
                    return Promise.reject(new Error('Refresh Token is invalid'));
                }
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosHandler;
