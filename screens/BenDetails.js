import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import Card from '../components/Card';
import CartButton from '../components/CartButton';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import items from '../api/comodities';

export default function BeneficiaryDetails({
  selectedBeneficiary,
  cartItems,
  setSelectedBeneficiary,
  setLanguage,
  language,
  setCartItems,
  handleAddToCart,
}) {
  const navigation = useNavigation();
  const amount = selectedBeneficiary ? selectedBeneficiary.amount : 0;
  const nic = selectedBeneficiary ? selectedBeneficiary.NIC : 0;
  const lastname = selectedBeneficiary ? selectedBeneficiary.lastName : ' ';
  const [languageModalVisible, setLanguageModalVisible] = useState(false);

  const handleCartPress = () => {
    navigation.navigate('Cart');
  };

  // Show confirmation dialog when the user presses the back button
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = navigation.addListener('beforeRemove', e => {
        e.preventDefault();
        Alert.alert(
          'Confirm',
          'Are you sure you want to go back?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {},
            },
            {
              text: 'Logout',
              style: 'destructive',
              onPress: () => {
                setSelectedBeneficiary(null);
                setCartItems([]);
                navigation.dispatch(e.data.action);
              },
            },
          ],
          {cancelable: false},
        );
      });
      return unsubscribe;
    }, [navigation]),
  );

  const handleLanguageChange = lang => {
    setLanguage(lang);
    setLanguageModalVisible(false);
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const renderItem = useCallback(
    ({item, index}) => {
      if (index === 31) {
        return (
          <View style={styles.fullWidthCard}>
            <Card
              name={item[language]}
              price={item.price}
              Rquantity={item.quantity}
              max={item.max}
              id={item.id}
              unit={item.unit}
              amount={amount}
              cartTotal={cartTotal}
              fixed={item.fixed}
              image={item.image}
              navigation={navigation}
              onAddToCart={handleAddToCart}
              exist={cartItems.some(cartItem => cartItem.id === item.id)}
            />
          </View>
        );
      } else if (index % 2 === 0 && index < 30) {
        return (
          <View style={index === 31 ? {display: 'none'} : styles.cardRow}>
            <Card
              name={item[language]}
              price={item.price}
              Rquantity={item.quantity}
              max={item.max}
              id={item.id}
              unit={item.unit}
              amount={amount}
              cartTotal={cartTotal}
              fixed={item.fixed}
              image={item.image}
              navigation={navigation}
              onAddToCart={handleAddToCart}
              exist={cartItems.some(cartItem => cartItem.id === item.id)}
            />
            {items[index + 1] && (
              <Card
                name={items[index + 1][language]}
                price={items[index + 1].price}
                id={items[index + 1].id}
                Rquantity={items[index + 1].quantity}
                unit={items[index + 1].unit}
                max={items[index + 1].max}
                navigation={navigation}
                fixed={items[index + 1].fixed}
                amount={amount}
                cartTotal={cartTotal}
                image={items[index + 1].image}
                onAddToCart={handleAddToCart}
                exist={cartItems.some(
                  cartItem => cartItem.id === items[index + 1].id,
                )}
              />
            )}
          </View>
        );
      }
    },
    [cartItems, handleAddToCart, items, language],
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#007DBC', '#6FB9E8']} style={styles.card}>
        <View style={styles.balanceRow}>
          <Text style={styles.balanceText}>Balance: Rs. {amount}</Text>
          <Text style={styles.nic}>NIC: {nic}</Text>
          <MaterialCommunityIcons
            name="earth"
            size={30}
            color="#fff"
            onPress={() => setLanguageModalVisible(true)}
          />
        </View>
        <View style={styles.cartTotalRow}>
          <Text style={styles.cartTotalText}>
            Cart Total: Rs. {cartTotal.toFixed(2)}
          </Text>
          <Text style={styles.lastname}>Last Name: {lastname}</Text>
        </View>
      </LinearGradient>
      <View style={styles.header}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            flex: 1,
          }}></View>
      </View>
      <FlatList
        data={items.sort((a, b) => a.id - b.id)}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        style={styles.scrollView}
        numColumns={1}
      />
      <CartButton
        balance={amount}
        onPress={handleCartPress}
        cartItems={cartItems}
      />
      {/* Language modal */}
      <Modal
        visible={languageModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setLanguageModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => handleLanguageChange('eng')}>
              <Text style={styles.modalOption}>
                {language === 'eng' ? '✓ ' : ''}English
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLanguageChange('tam')}>
              <Text style={styles.modalOption}>
                {language === 'tam' ? '✓ ' : ''}தமிழ்
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleLanguageChange('sin')}>
              <Text style={styles.modalOption}>
                {language === 'sin' ? '✓ ' : ''}සිංහල
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  nic: {
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '400',
    color: '#fff',
  },
  fullWidthCard: {
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  lastname: {
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: '400',
    color: '#fff',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  cartTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 10,
    alignSelf: 'flex-end',
    textAlign: 'center',
    marginRight: 20,
    paddingBottom: 10,
  },
  card: {
    borderRadius: 10,
    padding: 20,
    margin: 20,
    marginTop: 40,
    width: '90%',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  balanceText: {
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '400',
    color: '#fff',
  },
  scrollView: {
    width: '100%',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  cartTotalText: {
    fontFamily: 'Roboto',
    fontSize: 15,
    fontWeight: '400',
    color: '#fff',
    marginTop: 10, // Add some top margin to separate it from the balance text
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalOption: {
    fontFamily: 'Roboto',
    fontSize: 20,
    fontWeight: '400',
    color: '#007DBC',
    marginVertical: 10,
  },
});
