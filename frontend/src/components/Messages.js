// Dillon Koekemoer u23537052
import React from 'react';

const Messages = ({ projectId }) => {
    // Dummy messages data with blacksmith theme
    const dummyMessages = [
        {
            id: 1,
            user: "MasterSmith_John",
            action: "checked-in",
            message: "Forged initial blueprint with authentication hammering",
            timestamp: "2025-09-01 14:30",
            version: "v1.0.0"
        },
        {
            id: 2,
            user: "ApprenticeSmith_Sarah",
            action: "checked-out",
            message: "Taking project to anvil for UI tempering",
            timestamp: "2025-09-02 09:15",
            version: "v1.0.0"
        },
        {
            id: 3,
            user: "ApprenticeSmith_Sarah",
            action: "checked-in",
            message: "Completed UI tempering - added responsive steel framework",
            timestamp: "2025-09-02 16:45",
            version: "v1.1.0"
        },
        {
            id: 4,
            user: "JourneymanSmith_Mike",
            action: "checked-out",
            message: "Sharpening the database connections",
            timestamp: "2025-09-03 11:20",
            version: "v1.1.0"
        },
        {
            id: 5,
            user: "JourneymanSmith_Mike",
            action: "checked-in",
            message: "Database connections forged and tested - ready for production fire",
            timestamp: "2025-09-03 17:30",
            version: "v1.2.0"
        }
    ];

    const getActionIcon = (action) => {
        return action === 'checked-in' ? '🔨' : '⚒️';
    };

    const getActionClass = (action) => {
        return action === 'checked-in' ? 'checkin' : 'checkout';
    };

    return (
        <div className="card">
            <h3>Forge History</h3>
            <div className="messages-container">
                {dummyMessages.length > 0 ? (
                    dummyMessages.map(message => (
                        <div key={message.id} className={`message-item ${getActionClass(message.action)}`}>
                            <div className="message-header">
                                <div className="message-user">
                                    <span className="action-icon">{getActionIcon(message.action)}</span>
                                    <strong>{message.user}</strong>
                                    <span className="action-text">{message.action}</span>
                                    <span className="version-tag">{message.version}</span>
                                </div>
                                <div className="message-timestamp">
                                    {message.timestamp}
                                </div>
                            </div>
                            <div className="message-content">
                                <p>"{message.message}"</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-messages">
                        <p>No forge activity yet. The anvil awaits the first strike!</p>
                    </div>
                )}
            </div>
            
            <div className="message-stats">
                <div className="stat-item">
                    <span className="stat-label">Total Forgings:</span>
                    <span className="stat-value">{dummyMessages.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Current Version:</span>
                    <span className="stat-value">
                        {dummyMessages.length > 0 ? dummyMessages[dummyMessages.length - 1].version : 'v1.0.0'}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Messages;