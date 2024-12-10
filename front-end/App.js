import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import HomeScreen from './components/HomeScreen';
import BasketScreen from './components/BasketScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('Home');
  const [basketCode, setBasketCode] = useState(null);
  const [userName, setUserName] = useState(null);

  const navigateToBasket = (basketCode, userName) => {
    setBasketCode(basketCode);
    setUserName(userName);
    setCurrentScreen('Basket');
  };

  const navigateToHome = () => {
    setBasketCode(null);
    setUserName(null);
    setCurrentScreen('Home');
  };

  return (
    <View style={styles.container}>
      {currentScreen === 'Home' ? (
        <HomeScreen navigateToBasket={navigateToBasket} />
      ) : (
        <BasketScreen basketCode={basketCode} userName={userName} navigateToHome={navigateToHome} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});