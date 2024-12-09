import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import { getBasketItems, addItem, deleteItem } from '../api';
import ProductSearch from './ProductSearch';
import ItemList from './ItemList';
import { useNavigation } from '@react-navigation/native';

export default function BasketScreen({ basketCode, userName, navigateToHome }) {
  const [items, setItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [individualCost, setIndividualCost] = useState(0);
  const navigation = useNavigation();

  const fetchItems = async () => {
    try {
      console.log('Fetching items for basket:', basketCode);
      const result = await getBasketItems(basketCode);
      console.log('API Response:', result);
      if (result.error || !result.items) {
        console.error('Error fetching items:', result.error || 'No items found');
        return;
      }
      setItems(result.items);
      calculateCosts(result.items);
    } catch (error) {
      console.error('Network error:', error);
    }
  };
  

  useEffect(() => {
    fetchItems();
  }, []);

  const calculateCosts = (items = []) => {
    if (!Array.isArray(items)) return;
    console.log('Calculating costs for items:', items);
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalCost(total);

    const individual = items
      .filter((item) => item.added_by === userName)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    setIndividualCost(individual);
  };

  const handleAddItem = async (product, price, quantity) => {
    try {
      console.log('Adding item:', { product, price, quantity });
      const result = await addItem(basketCode, { product, price, quantity, added_by: userName });
      if (!result.error) {
        fetchItems();
      } else {
        console.error('Error adding item:', result.error);
      }
    } catch (error) {
      console.error('Error in handleAddItem:', error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      console.log('Deleting item with ID:', itemId);
      const result = await deleteItem(basketCode, itemId);
      if (!result.error) {
        fetchItems();
      } else {
        console.error('Error deleting item:', result.error);
      }
    } catch (error) {
      console.error('Error in handleDeleteItem:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Basket Details</Text>
      <Text style={styles.label}>Basket Code: {basketCode}</Text>
      <Text style={styles.label}>Total Cost of Basket: {totalCost.toFixed(2)}</Text>
      <Text style={styles.label}>Total Cost for Individual: {individualCost.toFixed(2)}</Text>
      <ProductSearch onAddItem={handleAddItem} />
      <ItemList items={items} onDeleteItem={handleDeleteItem} />
      <Button title="Go Back to Home (log out of basket)" onPress={navigateToHome} />
      <Text style={styles.viewMore} onPress={() => navigation.navigate('OrderSummary')}>
        View Full Order
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 18, marginBottom: 10 },
  label: { fontSize: 16, fontWeight: 'bold', marginVertical: 5 },
  viewMore: { fontSize: 16, color: '#007bff', marginTop: 8, textAlign: 'center', textDecorationLine: 'underline' },
});
