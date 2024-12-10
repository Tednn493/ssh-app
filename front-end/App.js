import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './components/HomeScreen';
import BasketScreen from './components/BasketScreen';
import OrderSummaryScreen from './components/OrderSummaryScreen';

const Stack = createStackNavigator();

export default function App() {
  const [basketCode, setBasketCode] = useState(null);
  const [userName, setUserName] = useState(null);

  const navigateToBasket = (basketCode, userName) => {
    setBasketCode(basketCode);
    setUserName(userName);
  };

  const navigateToHome = () => {
    setBasketCode(null);
    setUserName(null);
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
