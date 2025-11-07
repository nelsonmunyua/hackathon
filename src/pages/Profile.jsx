import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import mockData from "../data/mockData.json";

const Profile = () => {
  const { userId, userName, userEmail, userAvatar, isLoaded } = useAuth();
  const [userItems, setUserItems] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Get user's items - filter by Clerk userId
    const items = mockData.items.filter((item) => item.ownerId === userId);
    setUserItems(items);

    // Get borrow history - filter by Clerk userId
    const history = mockData.borrowRequests.filter(
      (request) => request.borrowerId === userId
    );
    setBorrowHistory(history);
  }, [userId]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account and view your activity</p>
      </div>

      <div className="profile-info">
        <div className="user-card">
          <div className="user-avatar">
            {userAvatar ? (
              <img src={userAvatar} alt={userName} />
            ) : (
              <div className="avatar-placeholder">
                {userName?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="user-details">
            <h2>{userName}</h2>
            <p>{userEmail}</p>
            <p className="user-id">User ID: {userId}</p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="stat">
          <h3>{userItems.length}</h3>
          <p>Items Shared</p>
        </div>
        <div className="stat">
          <h3>{borrowHistory.length}</h3>
          <p>Items Borrowed</p>
        </div>
        <div className="stat">
          <h3>5.0</h3>
          <p>Average Rating</p>
        </div>
      </div>

      <div className="activity-section">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          {borrowHistory.map((request) => {
            const item = mockData.items.find((i) => i.id === request.itemId);
            return (
              <div key={request.id} className="activity-item">
                <p>
                  You borrowed <strong>{item.name}</strong> from{" "}
                  {request.startDate} to {request.endDate}
                </p>
                <p className="status">Status: {request.status}</p>
              </div>
            );
          })}
          {borrowHistory.length === 0 && <p>No recent activity.</p>}
        </div>
      </div>
    </div>
  );
};

export default Profile;
