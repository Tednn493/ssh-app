const API_URL = 'http://192.168.1.114:8080/api';


// Create a new basket
export const createBasket = async () => {
  try {
    const response = await fetch(`${API_URL}/baskets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create basket");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating basket:", error);
    return { error: error.message };
  }
};

// Join an existing basket
export const joinBasket = async (basketCode, name) => {
  try {
    const response = await fetch(`${API_URL}/baskets/${basketCode}/participants`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (!response.ok) {
      throw new Error("Failed to join basket");
    }

    return await response.json();
  } catch (error) {
    console.error("Error joining basket:", error);
    return { error: error.message };
  }
};

// Add an item to a basket
export const addItem = async (basketCode, item) => {
  try {
    const response = await fetch(`${API_URL}/baskets/${basketCode}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Failed to add item");
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding item:", error);
    return { error: error.message };
  }
};


// Delete an item from a basket
export const deleteItem = async (basketCode, itemId) => {
  try {
    const response = await fetch(`${API_URL}/baskets/${basketCode}/items/${itemId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete item");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting item:", error);
    return { error: error.message };
  }
};

// Get all items in a basket
export const getBasketItems = async (basketCode) => {
  try {
    const response = await fetch(`${API_URL}/baskets/${basketCode}/items`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch basket items");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching basket items:", error);
    return { error: error.message };
  }
};
