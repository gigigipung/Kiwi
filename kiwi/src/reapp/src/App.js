import './styles/App.css';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import FileManagement from "./components/drive/FileManagement";
import Main from './pages/Main';
import Documents from "./pages/Documents";
import Chat from './pages/Chat';

import Calendar from './pages/Calendar';
import Drive from './pages/Drive';
import Home from './pages/Home';
import Header from './components/common/Header';
import OAuth2RedirectHandler from './jwt/OAuth2RedirectHandler';
import ChatTest from "./components/chat/ChatTest";

function App() {
    const [isLogin, setIsLogin] = useState({ result:false});

    const location = useLocation();
    const hideHeaderPaths = ['/chat', '/calendar', '/drive', '/documents'];
    const shouldHideHeader = hideHeaderPaths.includes(location.pathname);

    useEffect(() => {
        const authToken = sessionStorage.getItem('authToken');
        setIsLogin(authToken !== null);
    }, []);

  return (
      <>
          {shouldHideHeader && <Header />}
          <Routes>
              {/*element={<Navigate to="/Home" replace />}*/}
              <Route path="/" element={<Temphome />} />
              <Route path="/register" element={<Register/>}></Route>
              <Route path="/login" element={<Login setIsLogin={setIsLogin} />}></Route>
              <Route path="/FileManagement" element={<FileManagement/>}></Route>
              <Route path="/main" element={<Main/>}></Route>
              <Route path='/chat' element={<Chat />} />
              <Route path='/calendar' element={<Calendar />} />
              <Route path='/drive' element={<Drive />} />
              <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
              <Route path="/documents" element={<Documents/>}></Route>
              <Route path="/home" element={<Home/>}></Route>
          </Routes>
      </>
  );
}

const Temphome = () => {
    const token = sessionStorage.getItem('accessToken');
    const expiry = sessionStorage.getItem('refreshToken');
    const user = JSON.parse(sessionStorage.getItem('userInfo'));


    console.log(token);
    console.log(expiry);
    console.log(user);
    return <h1>홈 페이지입니다.</h1>;
}

export default App;
