import { useState, useEffect } from "react";
import { useAuth } from "./useAuth";
import mockData from "../data/mockData.json";

const useBorrowRequests = () => {
  const { userId } = useAuth();
  const [borrowRequests, setBorrowRequests] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("borrowRequests");
    if (stored) {
      setBorrowRequests(JSON.parse(stored));
    } else {
      setBorrowRequests(mockData.borrowRequests || []);
    }
  }, []);

  const addBorrowRequest = (request) => {
    const newRequest = {
      id: Date.now(),
      ...request,
      borrowerId: userId,
      status: "pending",
      timestamp: new Date().toISOString(),
    };
    const updated = [...borrowRequests, newRequest];
    setBorrowRequests(updated);
    localStorage.setItem("borrowRequests", JSON.stringify(updated));
  };

  const updateRequestStatus = (requestId, status) => {
    const updated = borrowRequests.map((req) =>
      req.id === requestId ? { ...req, status } : req
    );
    setBorrowRequests(updated);
    localStorage.setItem("borrowRequests", JSON.stringify(updated));
  };

  const getRequestsForUser = () => {
    return borrowRequests.filter((req) => req.borrowerId === userId);
  };

  const getRequestsForOwner = () => {
    const userItems = JSON.parse(localStorage.getItem("items") || "[]").filter(
      (item) => item.ownerId === userId
    );
    return borrowRequests.filter((req) =>
      userItems.some((item) => item.id === req.itemId)
    );
  };

  return {
    borrowRequests,
    addBorrowRequest,
    updateRequestStatus,
    getRequestsForUser,
    getRequestsForOwner,
  };
};

export default useBorrowRequests;
