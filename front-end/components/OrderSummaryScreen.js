import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const sampleOrder = [
  { id: '1', name: 'Apples', price: 2.5, addedBy: 'John', category: 'Fruits' },
  { id: '2', name: 'Milk', price: 1.2, addedBy: 'Jane', category: 'Dairy' },
  { id: '3', name: 'Bread', price: 1.8, addedBy: 'Alice', category: 'Bakery' },
];

const OrderSummaryScreen = () => {
  const [orderItems, setOrderItems] = useState(sampleOrder);

  const calculateTotal = () =>
    orderItems.reduce((total, item) => total + item.price, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shared Order Summary</Text>
      <FlatList
        data={orderItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.addedBy}>Added by: {item.addedBy}</Text>
            <Text style={styles.price}>£{item.price.toFixed(2)}</Text>
          </View>
        )}
      />
      <View style={styles.summary}>
        <Text style={styles.totalText}>Total Cost: £{calculateTotal().toFixed(2)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addedBy: {
    fontSize: 14,
    color: '#666',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#28a745',
  },
  summary: {
    padding: 16,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

});

export default OrderSummaryScreen;
