import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import useItems from "../hooks/useItems";
import useBorrowRequests from "../hooks/useBorrowRequests";
import mockData from "../data/mockData.json";

const MyItems = () => {
  const { userId, isLoaded } = useAuth();
  const { items, updateItemAvailability } = useItems();
  const { borrowRequests, updateRequestStatus } = useBorrowRequests();
  const [myItems, setMyItems] = useState([]);

  useEffect(() => {
    if (!userId) return;

    // Get user's items - filter by Clerk userId
    const userItems = items.filter((item) => item.ownerId === userId);
    setMyItems(userItems);
  }, [userId, items]);

  const handleRequestAction = (requestId, action) => {
    updateRequestStatus(requestId, action);
    if (action === "accepted") {
      const request = borrowRequests.find((req) => req.id === requestId);
      if (request) {
        updateItemAvailability(request.itemId, false);
      }
    }
    toast.success(`Request ${action} successfully!`);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="my-items-page page-content">
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
              const item = items.find((i) => i.id === request.itemId);
              const storedUsers = localStorage.getItem("users");
              const users = storedUsers
                ? JSON.parse(storedUsers)
                : mockData.users;
              const borrower = users.find((u) => u.id === request.borrowerId);
              return (
                <div key={request.id} className="request-card">
                  <div className="request-info">
                    <h4>{item?.name || "Unknown Item"}</h4>
                    <p>
                      Requested by: {borrower?.name || "Unknown"} (
                      {borrower?.apartment || ""})
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
