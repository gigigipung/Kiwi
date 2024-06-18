import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChatList = ({ selectedTeam }) => {
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedTeam) {
            axios.get(`http://localhost:8080/api/chat?team=${selectedTeam}`)
                .then(response => {
                    setChats(response.data);
                })
                .catch(error => {
                    console.error('There was an error fetching the chat rooms!', error);
                });
        }
    }, [selectedTeam]);

    const handleChatClick = (chatNum) => {
        navigate(`/chat/${chatNum}`);
    };

    return (
        <div>
            <h2>Chat Rooms</h2>
            <ul>
                {chats.map(chat => (
                    <li key={chat.chatNum} onClick={() => handleChatClick(chat.chatNum)}>
                        {chat.chatName}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatList;