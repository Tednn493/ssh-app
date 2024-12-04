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
      const result = await getBasketItems(basketCode);
      if (result.error || !result.items) {
        console.error(result.error || 'Unexpected response structure');
        return;
      }
      setItems(result.items);
      calculateCosts(result.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const calculateCosts = (items = []) => {
    if (!Array.isArray(items)) return;
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalCost(total);

    const individual = items
      .filter((item) => item.added_by === userName)
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
    setIndividualCost(individual);
  };

  const handleAddItem = async (product, price, quantity) => {
    const result = await addItem(basketCode, { product, price, quantity, added_by: userName });
    if (!result.error) {
      fetchItems();
    } else {
      alert(result.error);
    }
  };

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
      <Button title="Go Back to Home (log out of basket)" onPress={navigateToHome} />
      {items.length > 0 && (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.previewItemCard}>
              <Text style={styles.previewItemName}>{item.product}</Text>
              <Text style={styles.previewAddedBy}>Added by: {item.added_by || 'Unknown'}</Text>
              <Text style={styles.previewPrice}>£{item.price.toFixed(2)}</Text>
            </View>
          )}
        />
      )}
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
  previewItemCard: { backgroundColor: '#fff', padding: 8, marginVertical: 4, borderRadius: 8 },
  previewItemName: { fontSize: 16, fontWeight: 'bold' },
  previewAddedBy: { fontSize: 12, color: '#666' },
  previewPrice: { fontSize: 14, fontWeight: 'bold', color: '#28a745' },
  viewMore: { fontSize: 16, color: '#007bff', marginTop: 8, textAlign: 'center', textDecorationLine: 'underline' },
});
