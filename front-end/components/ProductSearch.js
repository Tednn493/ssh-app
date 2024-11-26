import React, { useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';

const products = [
  { product: 'Apple', price: 0.5 },
  { product: 'Bread', price: 1.0 },
  { product: 'Milk', price: 1.5 },
];

export default function ProductSearch({ onAddItem }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const handleAdd = () => {
    if (quantity > 0) {
      onAddItem(selectedProduct.product, selectedProduct.price, parseInt(quantity));
    } else {
      alert('Quantity must be greater than 0');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Products</Text>
      {products.map((product, index) => (
        <Button
          key={index}
          title={`${product.product} - $${product.price}`}
          onPress={() => setSelectedProduct(product)}
        />
      ))}
      <TextInput
        style={styles.input}
        placeholder="Enter Quantity"
        keyboardType="number-pad"
        value={quantity.toString()}
        onChangeText={setQuantity}
      />
      <Button title="Add to Basket" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 },
});
