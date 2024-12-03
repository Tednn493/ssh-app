import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getBasketItems, addItem, deleteItem } from '../api';
import ProductSearch from './ProductSearch';
import ItemList from './ItemList';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function BasketScreen({ basketCode, userName, navigateToHome }) {
  const [items, setItems] = useState([]);
  const [totalCost, setTotalCost] = useState(0);
  const [individualCost, setIndividualCost] = useState(0);

  // Fetch items from the server
  const fetchItems = async () => {
    const result = await getBasketItems(basketCode);
    if (!result.error) {
      setItems(result.items || []);
      calculateCosts(result.items || []); 
    } else {
      console.error(result.error);
    }
  };

  useEffect(() => {
    fetchItems();
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

  return (
    <View style={styles.container}>
  <Text style={styles.title}>Basket Details</Text>
  <Text style={styles.label}>Basket Code: {basketCode}</Text>
  <Text style={styles.label}>Total Cost of Basket: {totalCost.toFixed(2)}</Text>
  <Text style={styles.label}>Total Cost for Individual: {individualCost.toFixed(2)}</Text>
  
  <ProductSearch onAddItem={handleAddItem} />
  <ItemList items={items} onDeleteItem={handleDeleteItem} />
  
  <Button
    title="Go Back to Home (log out of basket)"
    onPress={navigateToHome}
  />

  <View>
    <FlatList
      data={previewItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.previewItemCard}>
          <Text style={styles.previewItemName}>{item.name}</Text>
          <Text style={styles.previewAddedBy}>Added by: {item.addedBy}</Text>
          <Text style={styles.previewPrice}>£{item.price.toFixed(2)}</Text>
        </View>
      )}
    />
    <Text style={styles.viewMore} onPress={() => navigation.navigate('OrderSummary')}>
      View Full Order
    </Text>
  </View>
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
  previewItemCard: {
    backgroundColor: '#fff',
    padding: 8,
    marginVertical: 4,
    borderRadius: 8,
  },
  previewItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewAddedBy: {
    fontSize: 12,
    color: '#666',
  },
  previewPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
  viewMore: {
    fontSize: 16,
    color: '#007bff',
    marginTop: 8,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  
});
