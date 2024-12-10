import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { createBasket, joinBasket } from '../api';

export default function HomeScreen({ navigateToBasket }) {
  const [basketCode, setBasketCode] = useState('');
  const [name, setName] = useState('');

  const handleCreateBasket = async () => {
    const result = await createBasket();
    navigateToBasket(result.basket_code, name);
  };

  const handleJoinBasket = async () => {
    const result = await joinBasket(basketCode, name);
    if (!result.error) {
      navigateToBasket(basketCode, name);
    } else {
      alert(result.error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Shared Basket</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateBasket}>
        <Text style={styles.buttonText}>Create Basket</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Enter basket code"
        placeholderTextColor="#aaa"
        value={basketCode}
        onChangeText={setBasketCode}
      />
      <TouchableOpacity style={styles.button} onPress={handleJoinBasket}>
        <Text style={styles.buttonText}>Join Basket</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15,
    width: '100%',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
