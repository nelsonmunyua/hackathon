import { useState, useEffect, useMemo } from "react";
import mockData from "../data/mockData.json";

const useItems = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem("items");
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      setItems(mockData.items || []);
    }
  }, []);

  const updateItemAvailability = (itemId, available) => {
    const updated = items.map((item) =>
      item.id === itemId ? { ...item, availability: available } : item
    );
    setItems(updated);
    localStorage.setItem("items", JSON.stringify(updated));
  };

  const availableItems = useMemo(() => {
    return items.filter((item) => item.availability);
  }, [items]);

  return {
    items,
    updateItemAvailability,
    availableItems,
  };
};

export default useItems;
