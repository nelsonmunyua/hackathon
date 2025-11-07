import React, { useState, useEffect } from "react";
import mockData from "../data/mockData.json";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [borrowHistory, setBorrowHistory] = useState([]);

  useEffect(() => {
    // Simulate loading user profile (assuming user id 1 for demo)
    const userId = 1;
    const currentUser = mockData.users.find((u) => u.id === userId);
    setUser(currentUser);

    // Get user's items
    const items = mockData.items.filter((item) => item.ownerId === userId);
    setUserItems(items);

    // Get borrow history (assuming user has borrowed items)
    const history = mockData.borrowRequests.filter(
      (request) => request.borrowerId === userId
    );
    setBorrowHistory(history);
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>My Profile</h1>
        <p>Manage your account and view your activity</p>
      </div>

      <div className="profile-info">
        <div className="user-card">
          <div className="user-avatar">{user.avatar}</div>
          <div className="user-details">
            <h2>{user.name}</h2>
            <p>{user.apartment}</p>
            <p className="rating">⭐ {user.rating} rating</p>
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
          <h3>{user.rating}</h3>
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
