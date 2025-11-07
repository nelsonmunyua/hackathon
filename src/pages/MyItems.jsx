import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import mockData from "../data/mockData.json";

const MyItems = () => {
  const { userId, isLoaded } = useAuth();
  const [myItems, setMyItems] = useState([]);
  const [borrowRequests, setBorrowRequests] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Get user's items - filter by Clerk userId
    const userItems = mockData.items.filter((item) => item.ownerId === userId);
    setMyItems(userItems);

    // Get borrow requests for user's items
    const userBorrowRequests = mockData.borrowRequests.filter((request) =>
      userItems.some((item) => item.id === request.itemId)
    );
    setBorrowRequests(userBorrowRequests);
  }, [userId]);

  const handleRequestAction = (requestId, action) => {
    // In a real app, this would update the backend with userId
    console.log(`User ${userId}: Request ${requestId} ${action}`);
    alert(`Request ${action} successfully!`);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="my-items-page">
      <div className="page-header">
        <h1>My Items</h1>
        <p>Manage your shared items and borrow requests</p>
      </div>

      <div className="items-section">
        <h2>Your Shared Items</h2>
        <div className="items-grid">
          {myItems.map((item) => (
            <div key={item.id} className="item-card">
              <div className="item-header">
                <span className="item-icon">{item.image}</span>
                <div className="item-info">
                  <h3>{item.name}</h3>
                  <p className="category">{item.category}</p>
                  <p className="availability">
                    {item.availability ? "Available" : "Unavailable"}
                  </p>
                </div>
              </div>
              <div className="item-details">
                <p>{item.description}</p>
                {item.deposit > 0 && (
                  <p className="deposit">
                    Security Deposit: KES {item.deposit}
                  </p>
                )}
                {item.dailyRate > 0 && (
                  <p className="rate">Daily Rate: KES {item.dailyRate}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="requests-section">
        <h2>Borrow Requests</h2>
        {borrowRequests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <div className="requests-list">
            {borrowRequests.map((request) => {
              const item = mockData.items.find((i) => i.id === request.itemId);
              const borrower = mockData.users.find(
                (u) => u.id === request.borrowerId
              );
              return (
                <div key={request.id} className="request-card">
                  <div className="request-info">
                    <h4>{item.name}</h4>
                    <p>
                      Requested by: {borrower.name} ({borrower.apartment})
                    </p>
                    <p>
                      Dates: {request.startDate} to {request.endDate}
                    </p>
                    <p>Status: {request.status}</p>
                  </div>
                  {request.status === "pending" && (
                    <div className="request-actions">
                      <button
                        className="btn-primary"
                        onClick={() =>
                          handleRequestAction(request.id, "accepted")
                        }
                      >
                        Accept
                      </button>
                      <button
                        className="btn-secondary"
                        onClick={() =>
                          handleRequestAction(request.id, "declined")
                        }
                      >
                        Decline
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyItems;
