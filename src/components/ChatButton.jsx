import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ChatButton = ({ ownerId, ownerName, itemId, itemName }) => {
  const navigate = useNavigate();
  const { userId, isSignedIn } = useAuth();

  const handleChatClick = () => {
    if (!isSignedIn) {
      alert("Please sign in to message the owner");
      navigate("/sign-in");
      return;
    }

    if (userId === ownerId) {
      alert("This is your own item");
      return;
    }

    // Navigate to chat with the owner
    navigate(`/messages/${ownerId}`, {
      state: { ownerName, itemId, itemName },
    });
  };

  // Don't show button if viewing own item
  if (userId === ownerId) {
    return null;
  }

  return (
    <button className="btn-chat" onClick={handleChatClick}>
      💬 Message Owner
    </button>
  );
};

export default ChatButton;
