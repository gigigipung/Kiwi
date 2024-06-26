import React, { useState, useRef, useEffect } from 'react';
import '../../styles/components/common/SchedulePopup.css';

const SchedulePopup = ({ onClose, addEvent }) => {
  const [isOpen, setIsOpen] = useState(false);

  const presetColors = [
    '#FF6F61', 
    '#FFB347', 
    '#FFF176', 
    '#81C784', 
    '#64B5F6', 
    '#9575CD', 
    '#BA68C8',
    '#FF8A65', 
    '#FFD54F', 
    '#AED581', 
    '#4FC3F7', 
    '#7986CB', 
    '#E1BEE7', 
    '#FF7043', 
    '#DCE775'  
  ];
  const [customColor, setCustomColor] = useState('#000000');
  const [selectedColor, setSelectedColor] = useState(presetColors[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    startDate: getCurrentDate(),
    startTime: getCurrentTime(),
    endDate: getCurrentDate(),
    endTime: getCurrentTime(),
    color: '#f0ad4e'
  });

  const popupRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target) && 
          dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closePopup();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleColorChange = (color) => {
    setSelectedColor(color);
    setNewEvent({ ...newEvent, color });
    setDropdownOpen(false);
  };

  const handleAddEvent = () => {
    const startDateTime = new Date(`${newEvent.startDate}T${newEvent.startTime}`);
    const endDateTime = new Date(`${newEvent.endDate}T${newEvent.endTime}`);
    addEvent({
      title: newEvent.title,
      description: newEvent.description,
      startDate: startDateTime,
      endDate: endDateTime,
      color: newEvent.color
    });
    setNewEvent({ 
      title: '', 
      description: '', 
      startDate: getCurrentDate(), 
      startTime: getCurrentTime(), 
      endDate: getCurrentDate(), 
      endTime: getCurrentTime(), 
      color: '#f0ad4e' 
    });
    closePopup();
  };

  return (
    <>
      <button className="schedule-button" onClick={openPopup}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_53_357)">
      <path d="M10 8.75C10.1658 8.75 10.3247 8.81585 10.4419 8.93306C10.5592 9.05027 10.625 9.20924 10.625 9.375V11.25H12.5C12.6658 11.25 12.8247 11.3158 12.9419 11.4331C13.0592 11.5503 13.125 11.7092 13.125 11.875C13.125 12.0408 13.0592 12.1997 12.9419 12.3169C12.8247 12.4342 12.6658 12.5 12.5 12.5H10.625V14.375C10.625 14.5408 10.5592 14.6997 10.4419 14.8169C10.3247 14.9342 10.1658 15 10 15C9.83424 15 9.67527 14.9342 9.55806 14.8169C9.44085 14.6997 9.375 14.5408 9.375 14.375V12.5H7.5C7.33424 12.5 7.17527 12.4342 7.05806 12.3169C6.94085 12.1997 6.875 12.0408 6.875 11.875C6.875 11.7092 6.94085 11.5503 7.05806 11.4331C7.17527 11.3158 7.33424 11.25 7.5 11.25H9.375V9.375C9.375 9.20924 9.44085 9.05027 9.55806 8.93306C9.67527 8.81585 9.83424 8.75 10 8.75Z" fill="#3D3D3D"/>
      <path d="M4.375 0C4.54076 0 4.69973 0.065848 4.81694 0.183058C4.93415 0.300269 5 0.45924 5 0.625V1.25H15V0.625C15 0.45924 15.0658 0.300269 15.1831 0.183058C15.3003 0.065848 15.4592 0 15.625 0C15.7908 0 15.9497 0.065848 16.0669 0.183058C16.1842 0.300269 16.25 0.45924 16.25 0.625V1.25H17.5C18.163 1.25 18.7989 1.51339 19.2678 1.98223C19.7366 2.45107 20 3.08696 20 3.75V17.5C20 18.163 19.7366 18.7989 19.2678 19.2678C18.7989 19.7366 18.163 20 17.5 20H2.5C1.83696 20 1.20107 19.7366 0.732233 19.2678C0.263392 18.7989 0 18.163 0 17.5V3.75C0 3.08696 0.263392 2.45107 0.732233 1.98223C1.20107 1.51339 1.83696 1.25 2.5 1.25H3.75V0.625C3.75 0.45924 3.81585 0.300269 3.93306 0.183058C4.05027 0.065848 4.20924 0 4.375 0ZM1.25 5V17.5C1.25 17.8315 1.3817 18.1495 1.61612 18.3839C1.85054 18.6183 2.16848 18.75 2.5 18.75H17.5C17.8315 18.75 18.1495 18.6183 18.3839 18.3839C18.6183 18.1495 18.75 17.8315 18.75 17.5V5H1.25Z" fill="#3D3D3D"/>
      </g>
      <defs>
      <clipPath id="clip0_53_357">
      <rect width="20" height="20" fill="white"/>
      </clipPath>
      </defs>
      </svg>

      &nbsp;
        Create
        
        </button>
      {isOpen && (
        <div className="popup-container">
          <div className="popup-content" ref={popupRef}>
            <div className="close-button" onClick={closePopup}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M18.71 5.29a1 1 0 0 0-1.42 0L12 10.59 7.71 6.29a1 1 0 0 0-1.42 1.42L10.59 12 6.29 16.29a1 1 0 0 0 1.42 1.42L12 13.41l4.29 4.3a1 1 0 0 0 1.42-1.42L13.41 12l4.3-4.29a1 1 0 0 0 0-1.42z"/>
              </svg>
            </div>
            <div className='popup-title'>Create Event</div>
            <form className="event-form">
              <input
                  type="text"
                  name="title"
                  placeholder="Title"
                  value={newEvent.title}
                  onChange={handleInputChange}
              />
              <textarea
                  name="description"
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={handleInputChange}
              />
              <div className="schedule-date-container">
                <div className="schedule-date-top">
                  <input
                      type="date"
                      name="startDate"
                      value={newEvent.startDate}
                      onChange={handleInputChange}
                  />
                  <input
                      type="time"
                      name="startTime"
                      value={newEvent.startTime}
                      onChange={handleInputChange}
                  />

                </div>

                <div className="schedule-date-bottom">
                  <input
                      type="date"
                      name="endDate"
                      value={newEvent.endDate}
                      onChange={handleInputChange}
                  />
                  <input
                      type="time"
                      name="endTime"
                      value={newEvent.endTime}
                      onChange={handleInputChange}
                  />

                </div>


              </div>


              <div className="color-picker" ref={dropdownRef}>
                <div className="color-dropdown-container">
                  <button
                      type="button"
                      className="color-dropdown-button"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div
                        className="color-circle"
                        style={{backgroundColor: selectedColor, width: '20px', height: '20px'}}
                    ></div>
                    <span className="dropdown-arrow">&#x25BC;</span>
                  </button>
                  {dropdownOpen && (
                      <ul className="color-dropdown-list">
                        {presetColors.map((color, index) => (
                            <li
                                key={index}
                                className="color-list-item"
                                onClick={() => handleColorChange(color)}
                            >
                              <div
                                  className="color-circle"
                                  style={{backgroundColor: color, width: '20px', height: '20px'}}
                              ></div>
                              {color}
                            </li>
                        ))}
                        <li className="color-list-item">
                          <div
                              className="color-circle"
                              style={{backgroundColor: customColor, width: '20px', height: '20px'}}
                          ></div>
                          Custom
                          {selectedColor === customColor && (
                              <input
                                  type="color"
                                  className="custom-color-input"
                                  value={customColor}
                                  onChange={(e) => {
                                    setCustomColor(e.target.value);
                                    handleColorChange(e.target.value);
                                  }}
                              />
                          )}
                        </li>
                      </ul>
                  )}
                </div>
              </div>

              <button type="button" className="create-button" onClick={handleAddEvent}>Create</button>
              <button type="button" className="cancel-button" onClick={closePopup}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default SchedulePopup;
