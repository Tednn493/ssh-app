import React from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';

export default function ItemList({ items, onDeleteItem }) {
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View>
        <Text>{item.product} - ${item.price} x {item.quantity}</Text>
        <Text style={styles.added_by}>Added by: {item.added_by || 'Unknown'}</Text>
      </View>
      <Button
        title="Remove"
        onPress={() => {
          console.log("Item passed to delete:", item);
          onDeleteItem(item.id);
        }}
      />
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  addedBy: {
    fontSize: 12,
    color: '#888',
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

