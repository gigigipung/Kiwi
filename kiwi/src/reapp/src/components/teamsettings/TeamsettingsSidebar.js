import React, { useContext, useState, useEffect } from 'react';
import '../../styles/components/teamsettings/TeamsettingsSidebar.css';
import { useNavigate, useParams, useLocation } from "react-router-dom";
import SettingsIcon from '../../images/svg/buttons/SettingsIcon';
import { TeamContext } from "../../context/TeamContext";
import axiosHandler from "../../jwt/axiosHandler";
import { getSessionItem } from "../../jwt/storage";
import { toast } from 'react-toastify';
import TeamSettingsIcon from '../../images/svg/buttons/TeamSettingsIcon';
import ManageRolesIcon from '../../images/svg/buttons/ManageRolesIcon';
import { useTranslation } from 'react-i18next';

const SideMenuBar = ({ key }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { teamno } = useParams();
    const { role } = useContext(TeamContext);
    const [selectedItem, setSelectedItem] = useState('user');

    useEffect(() => {
        if (location.pathname.includes('settings/user')) {
            setSelectedItem('user');
        } else if (location.pathname.includes('settings/team')) {
            setSelectedItem('team');
        }
    }, [location.pathname]);

    useEffect(() => {
        if (location.pathname === `/team/${teamno}/settings`) {
            navigate(`/team/${teamno}/settings/user`);
        }
    }, [teamno, location.pathname, navigate]);

    const handleOnClick = (item) => {
        if (item === 'team' && role === 'ADMIN') {
            toast.error(t('only-owners-error'));
            return;
        }
        setSelectedItem(item);
        navigate(`/team/${teamno}/settings/${item}`);
    }

    const handleLeaveTeam = async () => {
        if(role==="OWNER") {
            toast.error(t('owner-cannot-leave'));
            return;
        }
        const memberId = getSessionItem("profile").username;

        try {
            const res = await axiosHandler.delete(`/api/team/${teamno}/member/${memberId}`);
            if (res.data.result) {
                toast.success(res.data.message);
                navigate('/home', { replace: true });
            } else {
                toast.error(res.data.message);
            }
        } catch (e) {
            console.error("handleLeaveTeam failed: ", e);
            toast.error(t('leave-team-failed'));
        }
    }

    return (
        <div className='teamsettings-sidebar' key={key}>
            <div className='teamsettings-sidebar-header'>
                <SettingsIcon className='teamsettings-sidebar-settings-icon' />
                <div className='teamsettings-sidebar-title'>{t('general-settings')}</div>
            </div>
            <div className={`teamsettings-sidebar-item ${selectedItem === 'user' ? 'selected' : 'unselected'}`} onClick={() => handleOnClick('user')}>
                <ManageRolesIcon className='teamsettings-sidebar-roles-icon'/>
                <div>{t('user-settings')}</div>
            </div>
            <div className={`teamsettings-sidebar-item ${selectedItem === 'team' ? 'selected' : 'unselected'}`} onClick={() => handleOnClick('team')}>
                <TeamSettingsIcon className='teamsettings-sidebar-icon' />
                <div>{t('team-settings')}</div>
            </div>
            <div className='teamsettings-sidebar-bottom'>
                <div className='teamsettings-sidebar-leave-team-button' onClick={handleLeaveTeam}>{t('leave-team')}</div>
            </div>
        </div>
    );
};

export default SideMenuBar;
