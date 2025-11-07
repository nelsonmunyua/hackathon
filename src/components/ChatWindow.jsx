import React, { useState, useEffect, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  createOrGetChatRoom,
  sendMessage,
  subscribeToMessages,
  markMessagesAsRead,
} from "../services/chatService";

const ChatWindow = () => {
  const { otherUserId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userName, isSignedIn, isLoaded } = useAuth();

  const [chatRoomId, setChatRoomId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const otherUserName = location.state?.ownerName || "User";
  const itemId = location.state?.itemId;
  const itemName = location.state?.itemName;

  // Scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize chat room
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const initChat = async () => {
      try {
        const roomId = await createOrGetChatRoom(
          userId,
          otherUserId,
          otherUserName,
          itemId,
          itemName
        );
        setChatRoomId(roomId);
        setLoading(false);
      } catch (error) {
        console.error("Error initializing chat:", error);
        setLoading(false);
      }
    };

    initChat();
  }, [
    userId,
    otherUserId,
    otherUserName,
    itemId,
    itemName,
    isLoaded,
    isSignedIn,
  ]);

  // Subscribe to messages
  useEffect(() => {
    if (!chatRoomId) return;

    const unsubscribe = subscribeToMessages(chatRoomId, (newMessages) => {
      setMessages(newMessages);
      // Mark messages as read
      markMessagesAsRead(chatRoomId, userId);
    });

    return () => unsubscribe();
  }, [chatRoomId, userId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(
        chatRoomId,
        userId,
        userName || "You",
        newMessage.trim()
      );
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    }
  };

  if (!isLoaded) {
    return <div className="chat-window loading">Loading...</div>;
  }

  if (!isSignedIn) {
    return (
      <div className="chat-window">
        <div className="chat-error">
          <p>Please sign in to access messages</p>
          <button className="btn-primary" onClick={() => navigate("/sign-in")}>
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="chat-window loading">Loading chat...</div>;
  }

  return (
    <div className="chat-window">
      <div className="chat-header">
        <button className="back-button" onClick={() => navigate("/messages")}>
          ← Back
        </button>
        <div className="chat-header-info">
          <h2>{otherUserName}</h2>
          {itemName && <p className="chat-item-name">About: {itemName}</p>}
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="empty-chat">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`message ${
                message.senderId === userId ? "sent" : "received"
              }`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="chat-input"
          disabled={sending}
        />
        <button
          type="submit"
          className="btn-send"
          disabled={!newMessage.trim() || sending}
        >
          {sending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
