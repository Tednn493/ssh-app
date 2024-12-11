import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  Button, 
  TouchableWithoutFeedback, 
  Keyboard,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { ExpandablePanel, ProductCard } from './StyledComponents';

const products = [
  {
    product: 'Apple',
    price: 0.5,
    imageSource: require('../assets/apple.png')
  },
  {
    product: 'Banana',
    price: 0.3,
    imageSource: require('../assets/banana.png')
  },
  {
    product: 'Bread',
    price: 1.0,
    imageSource: require('../assets/bread.png')
  },
  {
    product: 'Milk',
    price: 1.5,
    imageSource: require('../assets/milk.png')
  },
  {
    product: 'Eggs',
    price: 2.5,
    imageSource: require('../assets/eggs.png')
  },
  {
    product: 'Beef',
    price: 10.0,
    imageSource: require('../assets/Beef.png')
  },
  {
    product: 'chicken',
    price: 6.99,
    imageSource: require('../assets/chicken.png')
  },
  {
    product: 'Oranges',
    price: 2.0,
    imageSource: require('../assets/oranges.png')
  },
  {
    product: 'Tomatoes',
    price: 1.75,
    imageSource: require('../assets/tomato.png')
  }
];

export default function ProductSearch({ onAddItem }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);
  const [forceCollapse, setForceCollapse] = useState(false);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setForceCollapse(true);
    setTimeout(() => {
      setForceCollapse(false);
    }, 300); // Match the animation duration
  };

  const handleAdd = () => {
    Keyboard.dismiss();
    if (quantity > 0) {
      onAddItem(selectedProduct.product, selectedProduct.price, parseInt(quantity));
      setQuantity(1);
    } else {
      alert('Quantity must be greater than 0');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ExpandablePanel title="Available Products" forceCollapse={forceCollapse}>
          {products.map((product, index) => (
            <ProductCard
              key={index}
              product={product.product}
              price={product.price}
              imageSource={product.imageSource}
              selected={selectedProduct.product === product.product}
              onSelect={() => handleProductSelect(product)}
            />
          ))}
        </ExpandablePanel>

        <View style={styles.quantityContainer}>
          <View style={styles.selectedInfo}>
            <TextInput
              style={[styles.input, styles.readonly]}
              value={`${selectedProduct.product} - $${selectedProduct.price}`}
              editable={false}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Enter Quantity"
            keyboardType="number-pad"
            value={quantity.toString()}
            onChangeText={(text) => setQuantity(parseInt(text) || 0)}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />
          <Button 
            title="Add to Basket"
            onPress={handleAdd}
          />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    gap: 16,
  },
  quantityContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  readonly: {
    backgroundColor: '#f5f5f5',
    color: '#666',
  },
  selectedInfo: {
    marginBottom: 8,
  }
});