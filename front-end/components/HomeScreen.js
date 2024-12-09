import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { createBasket, joinBasket } from '../api';

export default function HomeScreen({ navigateToBasket }) {
  const [basketCode, setBasketCode] = useState('');
  const [name, setName] = useState('');

  const handleCreateBasket = async () => {
    const result = await createBasket();
    if (!result.error) {
      navigateToBasket(result.basket_code, name);
    } else {
      alert(result.error);
    }
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
        value={name}
        onChangeText={setName}
      />
      <Button title="Create Basket" onPress={handleCreateBasket} />
      <TextInput
        style={styles.input}
        placeholder="Enter basket code"
        value={basketCode}
        onChangeText={setBasketCode}
      />
      <Button title="Join Basket" onPress={handleJoinBasket} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, marginBottom: 20 },
  input: { height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10, width: '80%' },
});
