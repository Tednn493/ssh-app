import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getBasketItems, addItem, deleteItem } from '../api';
import ProductSearch from './ProductSearch';
import ItemList from './ItemList';

export default function BasketScreen({ basketCode, userName, navigateToHome }) {
  const [items, setItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [individualCost, setIndividualCost] = useState(0);
  const [lastUpdatedTimestamp, setLastUpdatedTimestamp] = useState(0);

  // Fetch items from the server
  const fetchItems = async () => {
    const result = await getBasketItems(basketCode);
    if (!result.error) {
      setItems(result.items || []);
      calculateCosts(result.items || []);
      setLastUpdatedTimestamp(Date.now());
    } else {
      console.error(result.error);
    }
  };

  // Call fetchItems every 10 seconds (10000 ms)
  useEffect(() => {
    const interval = setInterval(fetchItems, 10000);
    return () => clearInterval(interval);
  }, []);

  // Calculate total cost and individual cost
  const calculateCosts = (items) => {
    // Calculate the total cost of the basket
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalCost(total);

    // Calculate the individual cost for the user
    const individual = items
      .filter((item) => item.added_by === userName)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    setIndividualCost(individual);
  };

  // Handle adding an item
  const handleAddItem = async (product, price, quantity) => {
    const result = await addItem(basketCode, { product, price, quantity, added_by: userName });
    if (!result.error) {
      fetchItems();
    } else {
      alert(result.error);
    }
  };

  // Handle deleting an item
  const handleDeleteItem = async (itemId) => {
    const result = await deleteItem(basketCode, itemId);
    if (!result.error) {
      fetchItems();
    } else {
      alert(result.error);
    }
  };

  // Fetch items when the component mounts
  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}> </Text>
      <Text style={styles.title}>Basket Code: {basketCode}</Text>
      <Text style={styles.label}>Total Cost of Basket: ${totalCost.toFixed(2)}</Text>
      <Text style={styles.label}>Total Cost for You: ${individualCost.toFixed(2)}</Text>
      <Text style={styles.label}>Last Updated: {new Date(lastUpdatedTimestamp).toLocaleString()}</Text>
      <ProductSearch onAddItem={handleAddItem} />
      <ItemList items={items} onDeleteItem={handleDeleteItem} name={userName} />
      <TouchableOpacity style={styles.button} onPress={navigateToHome}>
        <Text style={styles.buttonText}>Go Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  label: {
    fontSize: 18,
    color: '#555',
    marginVertical: 10,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
