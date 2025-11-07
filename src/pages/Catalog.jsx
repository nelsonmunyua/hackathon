
import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";
import ItemCard from "../components/ItemCard";
import SearchBar from "../components/SearchBar";
import BorrowRequestModal from "../components/BorrowRequestModal";
import mockData from "../data/mockData.json";

const Catalog = () => {
  const { userId, isLoaded } = useAuth();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    // Simulate loading data
    setItems(mockData.items);
    setFilteredItems(mockData.items);
  }, []);

  useEffect(() => {
    let filtered = items.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, selectedCategory, items]);

  const handleBorrowClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleBorrowSubmit = (requestData) => {
    // In a real app, this would send to backend with userId
    const requestWithUser = {
      ...requestData,
      borrowerId: userId, // Assign the Clerk user ID
      borrowerName: requestData.borrowerName,
      timestamp: new Date().toISOString(),
    };
    console.log("Borrow request submitted:", requestWithUser);
    toast.success(
      "Borrow request sent successfully! The owner will respond soon."
    );
    setShowModal(false);
  };

  const getOwner = (ownerId) => {
    return mockData.users.find((user) => user.id === ownerId);
  };

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="catalog-page page-content">
      <div className="page-header">
        <h1>Community Items</h1>
        <p>Borrow what you need from your trusted neighbors</p>
      </div>

      <SearchBar
        onSearch={setSearchTerm}
        onCategoryChange={setSelectedCategory}
      />

      <div className="items-grid">
        {currentItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            owner={getOwner(item.ownerId)}
            onBorrow={handleBorrowClick}
          />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="empty-state">
          <p>No items found matching your search.</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-secondary"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn-secondary"
          >
            Next
          </button>
        </div>
      )}

      {showModal && selectedItem && (
        <BorrowRequestModal
          item={selectedItem}
          owner={getOwner(selectedItem.ownerId)}
          onClose={() => setShowModal(false)}
          onSubmit={handleBorrowSubmit}
        />
      )}
    </div>
  );
};

export default Catalog;
