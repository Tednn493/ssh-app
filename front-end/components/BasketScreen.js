import { API_URL } from '../api_url';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
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
      <Text style={styles.title}>  </Text>
      <Text style={styles.title}>Basket Code: {basketCode}</Text>
      <Text style={styles.label}>Total Cost of Basket: ${totalCost.toFixed(2)}</Text>
      <Text style={styles.label}>Total cost for individual: ${individualCost.toFixed(2)}</Text>
      <Text style={styles.label}>Last updated: {new Date(lastUpdatedTimestamp).toLocaleString()}</Text>
      <ProductSearch onAddItem={handleAddItem} />
      <ItemList items={items} onDeleteItem={handleDeleteItem} name={userName} />
      <Button title="Go Back to Home (log out of basket)" onPress={navigateToHome} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});
