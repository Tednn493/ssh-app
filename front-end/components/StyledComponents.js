import React from 'react';
import { View, Text, Pressable, Animated, StyleSheet, Image, ScrollView, Dimensions, Easing } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const IMAGE_SIZE = 80;

export const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>
    {children}
  </View>
);

export const ExpandablePanel = ({ title, children, forceCollapse }) => {
  const [expanded, setExpanded] = React.useState(false);
  const animation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (forceCollapse) {
      setExpanded(false);
      Animated.timing(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
        easing: Easing.ease
      }).start();
    }
  }, [forceCollapse]);

  const toggleExpand = () => {
    setExpanded(!expanded);
    Animated.timing(animation, {
      toValue: expanded ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
      easing: Easing.ease
    }).start();
  };

  const maxHeight = Dimensions.get('window').height * 0.4;

  const animatedHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, maxHeight],
    extrapolate: 'clamp'
  });

  return (
    <Card style={styles.expandablePanel}>
      <Pressable onPress={toggleExpand} style={styles.header}>
        <Text style={styles.headerText}>{title}</Text>
        <Text style={styles.expandIcon}>{expanded ? '▼' : '▶'}</Text>
      </Pressable>
      <Animated.View 
        style={[
          styles.content,
          {
            maxHeight: animatedHeight,
          }
        ]}
      >
        <ScrollView 
          style={{ maxHeight }}
          showsVerticalScrollIndicator={true}
          bounces={false}
        >
          {children}
        </ScrollView>
      </Animated.View>
    </Card>
  );
};

export const ProductCard = ({ product, price, imageSource, onSelect, selected }) => {
  return (
    <Pressable 
      onPress={onSelect}
      style={[styles.productCard, selected && styles.selectedProduct]}
    >
      <View style={styles.productImageContainer}>
        <Image
          source={imageSource}
          style={styles.productImage}
          resizeMode="contain"
        />
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{product}</Text>
        <Text style={styles.productPrice}>${price.toFixed(2)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  expandablePanel: {
    padding: 0,
    overflow: 'hidden',
    maxWidth: screenWidth - 32,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  expandIcon: {
    fontSize: 14,
  },
  content: {
    overflow: 'hidden',
  },
  productCard: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
    height: IMAGE_SIZE + 24,
  },
  selectedProduct: {
    backgroundColor: '#e3f2fd',
  },
  productImageContainer: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: IMAGE_SIZE * 0.8,
    height: IMAGE_SIZE * 0.8,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 16,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
});