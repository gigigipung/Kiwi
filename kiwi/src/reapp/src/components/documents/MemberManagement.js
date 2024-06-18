import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MemberForm from './MemberForm';
import '../../styles/components/documents/MemberManagement.css';

const MemberManagement = () => {
    const [members, setMembers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        try {
            const response = await axios.get('/api/members/details');
            setMembers(response.data);
        } catch (error) {
            console.error("회원 정보를 불러오는데 실패하였습니다.", error);
        }
    };

    const handleSave = async (member) => {
        try {
            if (selectedMember) {
                await axios.put(`/api/members/details/${member.employeeNo}`, member);
            } else {
                await axios.post('/api/members/details', member);
            }
            fetchMembers();
            setSelectedMember(null);
        } catch (error) {
            console.error("회원 정보를 저장하는데 실패하였습니다.", error);
        }
    };

    const handleDelete = async (employeeNo) => {
        try {
            await axios.delete(`/api/members/details/${employeeNo}`);
            fetchMembers();
            setSelectedMember(null);
        } catch (error) {
            console.error("회원 정보를 삭제하는데 실패하였습니다.", error);
        }
    };

    const handleEdit = (member) => {
        setSelectedMember(member);
    };

    const filteredMembers = members.filter((member) =>
        member.name.includes(searchTerm) || member.deptName.includes(searchTerm)
    );

    return (
        <div className="member-management">
            <div className="member-list">
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="검색 (이름/부서)"
                    className="search-bar"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
                {filteredMembers.map((member) => (
                    <div key={member.employeeNo} className="member-item">
                        <span>{member.name} {member.title} <small className="dept-name">({member.deptName})</small></span>
                        <button className="document-button" onClick={() => handleEdit(member)}>수정</button>
                    </div>
                ))}
            </div>
            <MemberForm
                selectedMember={selectedMember}
                onSave={handleSave}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default MemberManagement;