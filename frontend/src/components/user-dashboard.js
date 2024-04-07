import React from 'react';

function UserDashboard() {
    return (
        <div>
            <h1>User Dashboard</h1>
            <p>Welcome to your Dashboard. Here you can view your courses, progress, and updates.</p>
            <div>
                <button onClick={() => {/* Navigate to enrolled courses */}}>My Courses</button>
                <button onClick={() => {/* Navigate to progress tracking */}}>Track Progress</button>
                <button onClick={() => {/* Navigate to updates or notifications */}}>Updates</button>
            </div>
        </div>
    );
}

export default UserDashboard;
