import React, { useEffect, useContext, useState } from 'react';
import '../../styles/components/teamsettings/TeamsettingsUser.css';
import ErrorImageHandler from "../common/ErrorImageHandler";
import axiosHandler from "../../jwt/axiosHandler";
import { useParams } from "react-router-dom";
import InviteMember from "./InviteMember";
import ManageMember from "./ManageMember";
import {TeamContext} from "../../context/TeamContext";

import SearchIcon from '../../images/svg/buttons/SearchIcon';
import ExitIcon from '../../images/svg/buttons/ExitIcon';

import PlusIcon from '../../images/svg/shapes/PlusIcon';

import { toast } from 'react-toastify';


const Member = () => {
    const { teamno } = useParams();
    const { role } = useContext(TeamContext);

    const [members, setMembers] = useState([]);
    const [joinedMembers, setJoinedMembers] = useState([]);
    const [invitedMembers, setInvitedMembers] = useState([]);
    const [exiledMembers, setExiledMembers] = useState([]);
    const [displayMembers, setDisplayMembers] = useState([]);

    const [displayMemberStatus, setDisplayMemberStatus] = useState('joined'); // joined,invited,exiled
    const [displaySearchType, setDisplaySearchType] = useState('name'); // name,email
    const [isSearchInput, setIsSearchInput] = useState('');
    const [displayCount, setDisplayCount] = useState(20); // 10,20,50

    const [checkedMembers, setCheckedMembers] = useState([]);
    const [displaySort, setDisplaySort] = useState(true); // true : asc / false : desc
    const [displayRole, setDisplayRole] = useState(['OWNER','ADMIN','MEMBER']);

    const [currentPage, setCurrentPage] = useState(1);
    const [endPage, setEndPage] = useState();
    const [page, setPage] = useState([]);
    const [displayPage, setDisplayPage] = useState([1,2,3,4,5]);

    const [filteredItemCount, setFilteredItemCount] = useState(0);
    const [sortConfig, setSortConfig] = useState({ key: 'memberNickname', direction: 'ascending' });

    const [isRolePopupOpen, setIsRolePopupOpen] = useState(false);


    useEffect(() => {
        fetchTeamData();
    }, []);

    const fetchTeamData = async () => {
        try {
            const response = await axiosHandler.post("/api/team/"+teamno+"/members");
            if(response.data.result){
                const members = response.data.data;
                members.sort((a,b)=>{
                    return a.memberNickname.localeCompare(b.memberNickname);
                })
                setMembers(members);
            } else {
                alert(response.data.message);
            }
        } catch (e) {
            console.error(e);
            alert("서버와 통신에서 오류가 발생했습니다.")
        }
    }

    useEffect(() => {
        if (members) {
            const joined = members.filter(member => member.status === 'JOINED');
            const invited = members.filter(member => member.status === 'INVITED');
            const exiled = members.filter(member => member.status === 'EXILED');

            setJoinedMembers(joined);
            setInvitedMembers(invited);
            setExiledMembers(exiled);

            setDisplayMembers(memberCountFilter(joined));

            setEndPage(Math.ceil(joined.length / displayCount));
            updateDisplayPage(currentPage, Math.ceil(joined.length / displayCount));
        }
    }, [members]);

    useEffect(() => {
        let totalCount;
        if (displayMemberStatus === 'joined') {
            totalCount = joinedMembers.length;
        } else if (displayMemberStatus === 'invited') {
            totalCount = invitedMembers.length;
        } else {
            totalCount = exiledMembers.length;
        }
        if(totalCount<1) totalCount++;
        setEndPage(Math.ceil(totalCount / displayCount));
        updateDisplayPage(currentPage, Math.ceil(totalCount / displayCount));
    }, [displayMemberStatus, displayCount, isSearchInput]);

    useEffect(() => {
        const filteredItems = filterMembers();
        setFilteredItemCount(filteredItems.length);
        setDisplayMembers(memberCountFilter(filteredItems));
    }, [currentPage, displayMemberStatus, displayCount, displaySort, displayRole, isSearchInput, sortConfig]);

    const filterMembers = () => {
        let membersToDisplay = displayMemberStatus === 'joined' ? joinedMembers : exiledMembers;

        // Apply role filter
        const roleFilteredMembers = membersToDisplay.filter(member => displayRole.includes(member.role));

        // Apply search filter
        const searchFilteredMembers = roleFilteredMembers.filter(member => {
            if (displaySearchType === 'name') {
                return member.memberNickname.toLowerCase().includes(isSearchInput.toLowerCase());
            } else if (displaySearchType === 'email') {
                return member.memberId.toLowerCase().includes(isSearchInput.toLowerCase());
            }
            return true;
        });

        return searchFilteredMembers;
    };

    const memberCountFilter = (members) => {
        const sortedMembers = [...members].sort((a, b) => {
            let comparison = 0;
            if (sortConfig.key === 'memberNickname') {
                comparison = a.memberNickname.localeCompare(b.memberNickname);
            }
            return sortConfig.direction === 'ascending' ? comparison : -comparison;
        });

        return sortedMembers.slice((currentPage - 1) * displayCount, currentPage * displayCount);
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            direction = 'ascending';
        }
        setSortConfig({ key, direction });
    };

    const updateDisplayPage = (currentPage, totalPages) => {
        let pages = [];
        let startPage = Math.max(currentPage - 2, 1);
        let endPage = Math.min(startPage + 4, totalPages);

        if (endPage - startPage < 4) {
            startPage = Math.max(endPage - 4, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        setDisplayPage(pages);
    };

    const highlightText = (text, query) => {
        if (!query) return text;
        const parts = text.split(new RegExp(`(${query})`, 'gi'));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? <span key={index} className='highlight'>{part}</span> : part
        );
    };

    const selectStatusHandle = (e) => {
        setDisplayMemberStatus(e.target.value);
        setCurrentPage(1);
    }

    const selectSearchHandle = (e) => {
        setDisplaySearchType(e.target.value);
    }

    const selectCountHandle = (e) => {
        setDisplayCount(e.target.value);
        setCurrentPage(1);
    }

    const pagingHandler = (event, pageType) => {
        event.preventDefault();
        let newPage = currentPage;

        if (pageType === 'prev' && currentPage > 1) {
            newPage = currentPage - 1;
        } else if (pageType === 'next' && currentPage < endPage) {
            newPage = currentPage + 1;
        }
        setCurrentPage(newPage);
        updateDisplayPage(newPage, endPage);
    }

    const pageClickHandler = (pageNumber) => {
        if(pageNumber === currentPage) return;
        setCurrentPage(pageNumber);
        updateDisplayPage(pageNumber, endPage);
    };

    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
    const openInviteModal = () => {
        setIsInviteModalOpen(true);
    };

    const [isManageModalOpen, setIsManageModalOpen] = useState(false);
    const openManageModal = () => {
        setIsManageModalOpen(true);
    };

    const allCheckHandler = (e) => {
        const checkboxes = document.querySelectorAll('.teamsettings-team-checkbox');
        checkboxes.forEach(item => {
            item.checked = e.target.checked;
        });
        if (e.target.checked) {
            setCheckedMembers(displayMembers);
        } else {
            setCheckedMembers([]);
        }
    }

    const checkHandle = (e, member) => {
        if (e.target.checked) {
            setCheckedMembers(prevState => {
                const newCheckedMembers = [...prevState, member];
                if (newCheckedMembers.length === displayMembers.length) {
                    document.getElementById("allCheckBox").checked = true;
                }
                return newCheckedMembers;
            });
        } else {
            setCheckedMembers(prevState => {
                const newCheckedMembers = prevState.filter(item => item.memberId !== member.memberId);
                document.getElementById("allCheckBox").checked = false;
                return newCheckedMembers;
            });
        }
    }

    const [memberCheck, setMemberCheck] = useState(true);
    const [adminCheck, setAdminCheck] = useState(true);
    const [ownerCheck, setOwnerCheck] = useState(true);

    const displayRoleHandle = (e) => {
        roleCheckBoxFilter(e);
        if(e.target.checked){
            setDisplayRole(prevState => [...prevState, e.target.name]);
        }else {
            setDisplayRole(prevState => prevState.filter(role => role !== e.target.name));
        }
    }

    const roleCheckBoxFilter = (e) => {
        if(e.target.name === 'MEMBER'){
            setMemberCheck(!memberCheck);
        } else if(e.target.name === 'ADMIN') {
            setAdminCheck(!adminCheck);
        } else {
            setOwnerCheck(!ownerCheck);
        }
    }

    const searchInputHandler = (e) => {
        setIsSearchInput(e.target.value);
    }

    const clearSearch = () => {
        setIsSearchInput('');
    };

    const promoteToAdmin = async (member) => {
        try {
            const updatedMember = { ...member, role: 'ADMIN' };
            const res = await axiosHandler.post(`/api/team/update/role/${teamno}`, [updatedMember]);
            if (res.data.result) {
                fetchTeamData(); // Refresh the data after updating the role
            } else {
                alert("Failed to promote to admin.");
            }
        } catch (error) {
            console.error("Error promoting to admin:", error);
            alert("An error occurred while promoting to admin.");
        }
    };
    
    const changeToMember = async (member) => {
        try {
            const updatedMember = { ...member, role: 'MEMBER' };
            const res = await axiosHandler.post(`/api/team/update/role/${teamno}`, [updatedMember]);
            if (res.data.result) {
                fetchTeamData(); // Refresh the data after updating the role
            } else {
                alert("Failed to change to member.");
            }
        } catch (error) {
            console.error("Error changing to member:", error);
            alert("An error occurred while changing to member.");
        }
    };
    
    const exileMember = async (member) => {
        const dto = {
            memberId: member.memberId,
            team: teamno
        };
    
        try {
            const res = await axiosHandler.post("/api/team/leaveTeam", dto);
            if (res.data.result) {
                toast.success(res.data.message);
                fetchTeamData(); 
            } else {
                toast.error(res.data.message);
            }
        } catch (e) {
            console.error("Failed to exile member: ", e);
            toast.error('Failed to exile member.');
        }
    };
    
    const unblockMember = async (member) => {
        try {
            const updatedMember = { ...member, status: 'JOINED' };
            const res = await axiosHandler.post(`/api/team/update/status/${teamno}`, [updatedMember]);
            if (res.data.result) {
                fetchTeamData(); // Refresh the data after updating the status
            } else {
                alert("Failed to unblock member.");
            }
        } catch (error) {
            console.error("Error unblocking member:", error);
            alert("An error occurred while unblocking the member.");
        }
    };
    
    const handleRoleChange = async (member, newRole) => {
        try {
            const updatedMember = { ...member, role: newRole };
            const res = await axiosHandler.post(`/api/team/update/role/${teamno}`, [updatedMember]);
            if (res.data.result) {
                fetchTeamData(); // Refresh the data after updating the role
                toast.success('Role was successfully changed.');
            } else {
                alert(`Failed to change role to ${newRole}.`);
            }
        } catch (error) {
            console.error(`Error changing role to ${newRole}:`, error);
            alert(`An error occurred while changing role to ${newRole}.`);
        }
    };

    return (
        <div className='teamsettings-user-container'>
            <div className='teamsettings-user-table-header'>
                <div className='teamsettings-user-table-header-top'>
                    <div className='teamsettings-user-header-left'>
                        <div className='teamsettings-user-invite-button' onClick={openInviteModal}> <PlusIcon className='teamsettings-user-plus-icon' /> Invite </div>

                        <div className='teamsettings-user-title'>
                            {displayMemberStatus === 'joined' ? 'Joined Users' : 'Blocked Users'}
                            &nbsp;
                            - 
                            &nbsp;
                            {displayMemberStatus === 'joined' ? joinedMembers.length : exiledMembers.length}
                        </div>
                            {checkedMembers.length > 0 && (
                                <div className='teamsettings-user-selected-container'>
                                    <div>{checkedMembers.length} users selected</div>

                                    <div className='teamsettings-user-manage-button' type='button' onClick={openManageModal}>Manage</div>
                                </div>
                            )}

                    </div>

                    <div className='teamsettings-user-header-right'>
                    <span className='teamsettings-user-role-hover-popup-wrapper' onClick={() => setIsRolePopupOpen(!isRolePopupOpen)}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='teamsettings-user-table-filter-icon'>
                            <path
                                d="M0 416c0 17.7 14.3 32 32 32l54.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-246.7 0c-12.3-28.3-40.5-48-73.3-48s-61 19.7-73.3 48L32 384c-17.7 0-32 14.3-32 32zm128 0a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zM320 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm32-80c-32.8 0-61 19.7-73.3 48L32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l246.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48l54.7 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-54.7 0c-12.3-28.3-40.5-48-73.3-48zM192 128a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm73.3-64C253 35.7 224.8 16 192 16s-61 19.7-73.3 48L32 64C14.3 64 0 78.3 0 96s14.3 32 32 32l86.7 0c12.3 28.3 40.5 48 73.3 48s61-19.7 73.3-48L480 128c17.7 0 32-14.3 32-32s-14.3-32-32-32L265.3 64z"/>
                        </svg>
                        <span className='teamsettings-user-role-hover-popup-title'>Filter Roles</span>

                        {isRolePopupOpen && (
                            <ul className='teamsettings-user-role-hover-popup'>
                                <li className='teamsettings-user-role-hover-popup-item'>
                                    <span>Member</span>
                                    <input checked={memberCheck} type='checkbox' name='MEMBER' onChange={displayRoleHandle}/>
                                </li>
                                <li className='teamsettings-user-role-hover-popup-item'>
                                    <span>Admin</span>
                                    <input checked={adminCheck} type='checkbox' name='ADMIN' onChange={displayRoleHandle}/>
                                </li>
                                <li className='teamsettings-user-role-hover-popup-item'>
                                    <span>Owner</span>
                                    <input checked={ownerCheck} type='checkbox' name='OWNER' onChange={displayRoleHandle}/>
                                </li>
                            </ul>
                        )}
                    </span>

                        <div className='teamsettings-user-blocked-toggle' 
                            onClick={() => setDisplayMemberStatus(displayMemberStatus === 'joined' ? 'exiled' : 'joined')}
                        >
                            {displayMemberStatus === 'joined' ? 'Blocked Users' : 'Joined Users'}
                        </div>
                        {isSearchInput && (
                            <span className='search-results-count'>{filteredItemCount} results</span>
                        )}
                        <div>
                            <div className='teamsettings-user-search-wrapper'>
                            <SearchIcon className="teamsettings-user-search-icon" />
                            <input value={isSearchInput} className="teamsettings-user-search-input"  type='text' placeholder='Search Users' onChange={searchInputHandler}/>

                            {isSearchInput && <button onClick={clearSearch} className='teamsettings-user-clear-search-button'> <ExitIcon /> </button>}
                            </div>
                        </div>

                    </div>

                </div>
            </div>
            <div className='teamsettings-user-table-wrapper'>
                <div className='teamsettings-user-table-column-names'>
                    <input id='allCheckBox' onChange={allCheckHandler} type='checkbox'/>
                    <span className='teamsettings-user-username-column'  onClick={() => handleSort('memberNickname')} style={{cursor: 'pointer'}}>
                        Username {(sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </span>

                </div>
                <div className='teamsettings-user-list'>
                    <div className='teamsettings-user-list-body'>
                        {
                            displayMembers.map((member, idx) => (
                                <div className={`teamsettings-user-list-item ${idx % 2 === 0 ? 'odd-column' : ''}`} key={idx}>
                                    <div className='teamsettings-user-header-left'>
                                        
                                    <div className='teamsettings-user-list-item-checkbox'>
                                            {role === 'OWNER' || (role === 'ADMIN' && member.role === 'MEMBER') ? (
                                                <input className='teamsettings-team-checkbox' type='checkbox' onClick={(e) => checkHandle(e, member)}/>
                                            ) : <div  style={{ width: '20px' }}/>}
                                        </div>
                                        <div className='teamsettings-user-list-item-photo'>
                                            <img className='teamsettings-team-member-profile' src={member.memberFilepath} alt='' onError={ErrorImageHandler}></img>
                                        </div>
                                        <div className='teamsettings-user-list-item-username'>
                                            <div className='teamsettings-user-username-text'>
                                                {highlightText(member.memberNickname, isSearchInput)}
                                                <div className={`role-tag ${member.role.toLowerCase()}`}>{member.role.toLowerCase()}</div>

                                            </div>
                                            <div className='teamsettings-user-email-text'>
                                                {highlightText(member.memberId, isSearchInput)}
                                            </div>
                                        </div>
                                    </div>
                                    {displayMemberStatus === 'joined' && (
                                    <div className='teamsettings-user-header-right'>
                                        <div className='teamsettings-user-list-item-role'>
                                            {member.role === 'OWNER' ? (
                                                <span></span>
                                            ) : (
                                                role === 'OWNER' && (
                                                    <select className='teamsettings-user-role-dropdown'
                                                        value={member.role}
                                                        onChange={(e) => handleRoleChange(member, e.target.value)}
                                                    >
                                                        <option value='MEMBER'>MEMBER</option>
                                                        <option value='ADMIN'>ADMIN</option>
                                                    </select>
                                                )
                                            )}
                                        </div>
                                        <div className='teamsettings-user-list-item-options'>
                                            {role === 'OWNER' ? (
                                                !(member.role === 'OWNER') && (<div className='teamsettings-user-kick-button' onClick={() => exileMember(member)}>Kick</div>)
                                            ) : (
                                                role === 'ADMIN' && member.role === 'MEMBER' && (<div className='teamsettings-user-kick-button' onClick={() => exileMember(member)}>Kick</div>)
                                            )}
                                        </div>

                                    </div>)}
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
            <div className='teamsettings-user-footer'>
                <button className={`team-paging-prev ${currentPage === 1 ? '' : 'active'}`}
                        onClick={(event) => pagingHandler(event, 'prev')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path fill="#979797"
                              d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/>
                    </svg>
                </button>
                {
                    displayPage.map((page, idx) => (
                        <span className={`team-paging-num ${displayPage.length === 1 ? '' : 'active'} ${currentPage === page ? 'current' : ''}`} key={idx} onClick={() => pageClickHandler(page)}>{page}</span>
                    ))
                }
                <button className={`team-paging-next ${displayPage.length === 1 || currentPage === endPage ? '' : 'active'}`}
                        onClick={(event) => pagingHandler(event, 'next')}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path fill="#979797"
                              d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s-32.8-12.5-45.3 0l160 160z"/>
                    </svg>
                </button>
            </div>
            <InviteMember setIsModalOpen={setIsInviteModalOpen} isModalOpen={isInviteModalOpen} joinedMembers={joinedMembers} />

            <ManageMember setIsModalOpen={setIsManageModalOpen} isModalOpen={isManageModalOpen} checkedMembers={checkedMembers} />
        </div>
    );
};

export default Member;