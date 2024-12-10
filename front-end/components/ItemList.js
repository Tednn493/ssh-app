import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

export default function ItemList({ items, onDeleteItem, name }) {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text style={styles.itemText}>
          {item.product} - ${item.price} x {item.quantity}
        </Text>
        <Text style={styles.addedBy}>
          Added by: {item.added_by || 'Unknown'}
        </Text>
      </View>
      {item.added_by === name && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => {
            console.log('Item passed to delete:', item);
            onDeleteItem(item.id);
          }}
        >
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <FlatList
      data={items}
      keyExtractor={(item, index) => (item.id ? item.id.toString() : index.toString())}
      renderItem={renderItem}
      ListEmptyComponent={<Text style={styles.empty}>No items in the basket</Text>}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  addedBy: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  removeButton: {
    backgroundColor: '#FF6F61',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
    fontSize: 16,
  },
});
