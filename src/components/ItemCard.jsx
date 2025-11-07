import React, { useState } from "react";
import ChatButton from "./ChatButton";

const ItemCard = ({ item, owner, onBorrow }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="item-card">
      <div className="item-header">
        <span className="item-icon">{item.image}</span>
        <div className="item-info">
          <h3>{item.name}</h3>
          <p className="owner">
            By {owner.name} • {owner.apartment}
          </p>
          <p className="rating">⭐ {owner.rating}</p>
        </div>
      </div>

      <div className="item-actions">
        <button
          className="btn-secondary"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Less" : "More"} Details
        </button>
        <ChatButton
          ownerId={item.ownerId}
          ownerName={owner.name}
          itemId={item.id}
          itemName={item.name}
        />
        <button className="btn-primary" onClick={() => onBorrow(item)}>
          Borrow
        </button>
      </div>

      {showDetails && (
        <div className="item-details">
          <p>{item.description}</p>
          {item.deposit > 0 && (
            <p className="deposit">Security Deposit: KES {item.deposit}</p>
          )}
          {item.dailyRate > 0 && (
            <p className="rate">Daily Rate: KES {item.dailyRate}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemCard;
