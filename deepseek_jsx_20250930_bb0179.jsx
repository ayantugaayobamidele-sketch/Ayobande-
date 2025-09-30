import React, { useState, useEffect } from 'react';

const StudentDashboard = () => {
    const [studentData, setStudentData] = useState(null);
    const [accessCode, setAccessCode] = useState('');
    const [availableButtons, setAvailableButtons] = useState([]);

    useEffect(() => {
        fetchStudentData();
    }, []);

    const fetchStudentData = async () => {
        const response = await fetch('/api/student/dashboard');
        const data = await response.json();
        setStudentData(data);
    };

    const handleAccessCodeSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch('/api/student/access-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessCode })
        });
        
        if (response.ok) {
            const buttons = await response.json();
            setAvailableButtons(buttons);
            setAccessCode('');
        }
    };

    return (
        <div className="dashboard">
            <div className="welcome-section">
                <h1>Welcome, {studentData?.username}</h1>
                <div className="stats">
                    <div className="stat">Badges: {studentData?.badges?.length}</div>
                    <div className="stat">Quizzes Taken: {studentData?.quizCount}</div>
                </div>
            </div>
            
            <form onSubmit={handleAccessCodeSubmit} className="access-code-form">
                <input
                    type="text"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter access code"
                    required
                />
                <button type="submit">Submit</button>
            </form>
            
            <div className="button-grid">
                {availableButtons.map(button => (
                    <div key={button.id} className="button-card">
                        <h3>{button.title}</h3>
                        <p>{button.description}</p>
                        <a href={button.link_url} target="_blank" rel="noopener noreferrer">
                            Access Content
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StudentDashboard;