import React, { useState } from 'react';
import '../../styles/components/home/CreateTeam.css';

const CreateTeam = ({ onCreateTeam, toggleTeamView }) => {
  const [formData, setFormData] = useState({
    teamName: '',
    invitedMembers: [],
  });

  const members = [
    {
        email: 'test1@gmail.com',
        name: 'name1',
        image: ''
    },
    {
      email: 'test2@gmail.com',
      name: 'name2',
      image: ''
    }
    ,
    {
      email: 'test3@gmail.com',
      name: 'name3',
      image: ''
    }
];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'invitedMembers') {
      const membersList = value.split(',').map(member => member.trim());
      setFormData({
        ...formData,
        [name]: membersList,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateTeam(formData); 
    setFormData({ teamName: '', invitedMembers: [] }); 
  };

  const handleCancel = () => {
    setFormData({ teamName: '', invitedMembers: [] });
    toggleTeamView();
  };

  return (
    <>
    <div className='create-team-title-container'>
      <div className='create-team-title'>
        Create a New Team
      </div> 
    </div>
        
    <div className='create-team-container' >  
      <form onSubmit={handleSubmit}>
        <div className='create-team-top'>
          <div>
            <div className='create-team-name-title'>
              Team Name
            </div>
            <div className='create-team-name-container' >
              <input
                className="create-team-name-input"
                name="teamName"
                value={formData.teamName}
                placeholder="Choose your team's name"

                onChange={handleChange}
              />
            </div>

          </div>

          <div>
            <div className='create-team-invite-members-title'>
                Invite Members
            </div>
            <div className='create-team-invite-members-wrapper'>
              <div className='create-team-invite-members-container' >
                <input
                  className="create-team-invite-members-input"
                  name="invitedMembers"
                  placeholder='Search members by email'
                  onChange={handleChange}
                />
              </div>

              <button className='create-team-invite-button'>
                Invite
              </button>

            </div>
          </div>


            <div className='create-team-member-list-container'> 
                <ul>
                {members.map(member => (
                        <li key={member.email} className="create-team-member">
                            <img className='create-team-member-image' src={member.image} />

                            <div className='create-team-member-info'>
                              <div className='create-team-member-name-wrapper' >
                                <div className='create-team-member-name'>{member.name}</div>
                                <div className='create-team-invite-pending' > Invite Pending</div>
                              </div>


                              <div className='create-team-member-email'>{member.email}</div>
                            </div>
                            <div className='create-team-member-cancel'> 
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                            </svg>

                            </div>
                        </li>
                    ))}

                </ul>

            </div>

        </div>

        <div className='create-team-bottom'>
          <button
            type="button"
            className='create-team-cancel-button'
            onClick={handleCancel}
          >
            Cancel
          </button>

          <button type="submit" className='create-team-create-button'>
            Create Team
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default CreateTeam;
