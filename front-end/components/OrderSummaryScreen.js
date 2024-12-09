import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
const OrderSummaryScreen = ({ route }) => {
  const { basketCode } = route.params || {}; 
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrderSummary = async () => {
    try {
      console.log('Fetching order summary for basket:', basketCode);
      const result = await getBasketItems(basketCode); 
      if (result.error) {
        console.error('Error fetching order summary:', result.error);
        Alert.alert('Error', 'Failed to fetch order summary. Please try again later.');
        return;
      }
      setOrderItems(result.items || []);
    } catch (error) {
      console.error('Network error while fetching order summary:', error);
      Alert.alert('Network Error', 'Unable to load order summary. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (basketCode) {
      fetchOrderSummary();
    } else {
      Alert.alert('Error', 'No basket code provided.');
      setLoading(false);
    }
  }, [basketCode]);

  const calculateTotal = () =>
    orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

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
        ListEmptyComponent={
          <Text style={styles.emptyText}>No items in this basket yet.</Text>
        }
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
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OrderSummaryScreen;
