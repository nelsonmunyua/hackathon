import React, { useState } from "react";

const BorrowRequestModal = ({ item, owner, onClose, onSubmit }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      itemId: item.id,
      startDate,
      endDate,
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>Borrow {item.name}</h2>
          <button onClick={onClose} className="close-btn">
            ×
          </button>
        </div>

        <div className="item-preview">
          <span className="item-icon">{item.image}</span>
          <div>
            <p>
              <strong>Owner:</strong> {owner.name}
            </p>
            <p>
              <strong>Location:</strong> {owner.apartment}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="borrow-form">
          <div className="form-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
          </div>

          {item.deposit > 0 && (
            <div className="deposit-notice">
              <p>
                📝 <strong>Note:</strong> This item requires a security deposit
                of KES {item.deposit}
              </p>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Send Borrow Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BorrowRequestModal;
