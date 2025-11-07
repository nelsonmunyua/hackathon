import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { subscribeToUserChatRooms } from "../services/chatService";

const Messages = () => {
  const navigate = useNavigate();
  const { userId, isSignedIn, isLoaded } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const unsubscribe = subscribeToUserChatRooms(userId, (rooms) => {
      setChatRooms(rooms);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, isLoaded, isSignedIn]);

  const handleChatClick = (chatRoom) => {
    // Get the other user's ID
    const otherUserId = chatRoom.participants.find((id) => id !== userId);
    const otherUserName = chatRoom.participantNames[otherUserId];

    navigate(`/messages/${otherUserId}`, {
      state: {
        ownerName: otherUserName,
        itemId: chatRoom.itemId,
        itemName: chatRoom.itemName,
      },
    });
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  if (!isLoaded) {
    return <div className="messages-page loading">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="messages-page">
        <div className="page-header">
          <h1>Messages</h1>
        </div>
        <div className="empty-state">
          <p>Please sign in to view your messages</p>
          <button className="btn-primary" onClick={() => navigate("/sign-in")}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="messages-page">
        <div className="page-header">
          <h1>Messages</h1>
        </div>
        <div className="loading">Loading your conversations...</div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="page-header">
        <h1>Messages</h1>
        <p>Your private conversations</p>
      </div>

      {chatRooms.length === 0 ? (
        <div className="empty-state">
          <p>No messages yet</p>
          <p className="empty-subtitle">
            Start a conversation by messaging an item owner from the catalog
          </p>
          <button className="btn-primary" onClick={() => navigate("/catalog")}>
            Browse Catalog
          </button>
        </div>
      ) : (
        <div className="chat-list">
          {chatRooms.map((chatRoom) => {
            const otherUserId = chatRoom.participants.find(
              (id) => id !== userId
            );
            const otherUserName = chatRoom.participantNames[otherUserId];

            return (
              <div
                key={chatRoom.id}
                className="chat-list-item"
                onClick={() => handleChatClick(chatRoom)}
              >
                <div className="chat-avatar">
                  {otherUserName.charAt(0).toUpperCase()}
                </div>
                <div className="chat-info">
                  <div className="chat-header-row">
                    <h3>{otherUserName}</h3>
                    <span className="chat-time">
                      {formatTimestamp(chatRoom.lastMessageTime)}
                    </span>
                  </div>
                  {chatRoom.itemName && (
                    <p className="chat-item">About: {chatRoom.itemName}</p>
                  )}
                  <p className="chat-preview">
                    {chatRoom.lastMessage || "No messages yet"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Messages;
