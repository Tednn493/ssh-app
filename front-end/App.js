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
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home">
          {(props) => (
            <HomeScreen
              {...props}
              navigateToBasket={navigateToBasket}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Basket">
          {(props) => (
            <BasketScreen
              {...props}
              basketCode={basketCode}
              userName={userName}
              navigateToHome={navigateToHome}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="OrderSummary"
          component={OrderSummaryScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
