import React, {useState, useEffect, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Alert} from 'react-native';
import api from '../api/api';
import {activeId} from '../App';
import {isPrinterOk} from '../api/btprinter';
import items from '../api/comodities';
import retailerData from '../api/retailerData.json';
import handlePrintReceipt from '../components/PrintReciept';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import CheckoutItem from '../components/CheckoutItem';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StatusBar} from 'react-native';
import {connectPrinter} from '../api/btprinter';
import {BluetoothEscposPrinter} from 'react-native-bluetooth-escpos-printer';

export default function CartPage({
  selectedBeneficiary,
  retailerId,
  cartItems,
  mode,
  benData,
  setBenData,
  handleRemoveFromCart,
  setCartItems,
  setSelectedBeneficiary,
}) {
  const {amount, balance, id} = selectedBeneficiary ?? {
    amount: 0,
    balance: 0,
    id: null,
  };

  let orderID = null;

  const {currentCycle: {amount: bal} = {amount: 0}} = selectedBeneficiary ?? {
    currentCycle: {amount: 0},
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const [isLoading, setIsLoading] = useState(false);
  const [loadingState, setloadingState] = useState('Processing');
  const [isSuccess, setIsSuccess] = useState(false);
  const [assignedRetailer, setAssignedRetailer] = useState({name: 'baskar'});
  const [isReceiptPrinted, setIsReceiptPrinted] = useState(false);
  const [checkoutInitiated, setCheckoutInitiated] = useState(false);
  const [CheckoutSuccess, setIsCheckoutSuccess] = useState(false);

  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      if (checkoutInitiated) {
        navigation.setOptions({
          gestureEnabled: false,
        });
      } else {
        navigation.setOptions({
          gestureEnabled: true,
        });
      }
    }, [checkoutInitiated, navigation]),
  );

  useEffect(() => {
    if (isFocused) {
      const unsubscribe = navigation.addListener('beforeRemove', e => {
        if (checkoutInitiated) {
          e.preventDefault();
          // setTimeout(() => {
          //   if (isFocused) {
          //   Alert.alert(
          //     "Not allowed:",
          //     "Transaction already processed. Please logout when done"
          //   );}
          // }, 3000);
        }
      });

      return () => {
        unsubscribe();
      };
    }
  }, [checkoutInitiated, isFocused, navigation]);

  function generateOrderID(selectedBeneficiary) {
    // Get the current date and time
    const currentDate = new Date();

    // Format the date and time components (e.g., YYYYMMDDHHMMSS)
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    // Get the beneficiary's ID
    const beneficiaryID = selectedBeneficiary.id;

    // Combine the components to create the order ID
    const orderID = `${hours}${minutes}${seconds}-${year}${month}${day}-${beneficiaryID}`;

    return orderID;
  }

  useEffect(() => {
    const fetchRetailers = async () => {
      try {
        const retailers = retailerData;

        const assignedRetailer = retailers.find(
          retailer => retailer.retailerId === retailerId,
        );

        if (assignedRetailer) {
          setAssignedRetailer(assignedRetailer);
        } else {
          console.log('Retailer not found with ID: ', retailerId);
        }
      } catch (error) {
        console.error('Error fetching retailers: ', error);
      }
    };

    // Call the function to fetch retailers when the component mounts
    fetchRetailers();
  }, [retailerId]);

  const handleReceipt = async () => {
    if (!orderID) {
      orderID = generateOrderID(selectedBeneficiary);
    }

    console.log('Order ID:', orderID);

    try {
      setIsLoading(false);

      try {
        console.log(
          cartItems,
          selectedBeneficiary.id,
          selectedBeneficiary.amount,
          assignedRetailer,
          orderID,
        );
        handlePrintReceipt(
          cartItems,
          selectedBeneficiary.id,
          selectedBeneficiary.amount,
          assignedRetailer,
          orderID,
          e = 0,
        );
      } catch (warning) {
        console.log('Printer Warning', warning);
      }
    } catch (error) {
      console.log(error);
      return;
    }
  };

  const handleCheckout = async () => {
    setCheckoutInitiated(true);

    navigation.setOptions({
      gestureEnabled: false,
    });

    setloadingState('Processing');

    let retryCount = 0;

    StatusBar.setHidden(true);

    setIsLoading(true);

    if (isReceiptPrinted) {
      try {
        setloadingState('Reprinting');
        await handleReceipt();
        setIsLoading(false);
        Alert.alert('Receipt reprinted.');
      } catch (printError) {
        console.error('Error printing receipt:', printError);
        if (retryCount < 5) {
          console.log('Retrying');
          retryCount++;
        } else {
          console.error('Printing failed after multiple retries.');
          setIsLoading(false);
          return;
        }
      }
    } else {
      try {
        setloadingState('Pushing data');
        if (mode) {
          const index = benData.findIndex(
            ben => ben.id === selectedBeneficiary.id,
          );

          let benDataTmp = [...benData];

          if (index !== -1) {
            let selectedBeneficiaryTmp = {...selectedBeneficiary};
            selectedBeneficiaryTmp.itemsPurchased = [
              {
                date: new Date(),
                cartItems,
              },
            ];
            selectedBeneficiaryTmp.amount =
              Number(selectedBeneficiaryTmp.amount) - Number(totalPrice);
            selectedBeneficiaryTmp.uploaded = false;
            benDataTmp[index] = selectedBeneficiaryTmp;
          }
          console.log('benDataTmp', benDataTmp);
          await AsyncStorage.setItem('benCache', JSON.stringify(benDataTmp));
          setBenData(benDataTmp);
          setloadingState('Printing');
          setIsReceiptPrinted(true);
          try {
            await handleReceipt();
            setIsCheckoutSuccess(true);
            Alert.alert('Order placed successfully!');
          } catch (printError) {
            console.error('Error printing receipt:', printError);
            if (retryCount < 5) {
              console.log('Retrying');
              retryCount++;
            } else {
              console.error('Printing failed after multiple retries.');
              setIsLoading(false);
              return;
            }
          }
        } else {
          await api
            .post('/beneficiaries/updateCart', {cartItems, id, retailerId})
            .then(async response => {
              setTimeout(async () => {
                setloadingState('Printing');
                setIsReceiptPrinted(true);
                if (isPrinterOk) {
                  try {
                  } catch (error) {
                    console.log('Printer error:', error);
                    Alert.alert(
                      'Printer disconnected. Check printer and reprint',
                    );
                    setIsLoading(false);
                    return;
                  }
                } else {
                  console.log('No paired devices found.');
                  Alert.alert(
                    'Printer disconnected. Check printer and reprint',
                  );
                  setIsLoading(false);
                  setIsCheckoutSuccess(true);
                  return;
                }
                try {
                  await handleReceipt();
                  setIsCheckoutSuccess(true);
                  Alert.alert('Order placed successfully!');
                } catch (printError) {
                  console.error('Error printing receipt:', printError);
                  if (retryCount < 5) {
                    console.log('Retrying');
                    retryCount++;
                  } else {
                    console.error('Printing failed after multiple retries.');
                    setIsLoading(false);
                    return;
                  }
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
                setIsLoading(false);
              }, 4000);
              handleRemoveFromCart(null);
            })
            .catch(error => {
              console.error(error);
            });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCloseSuccess = () => {
    setCheckoutInitiated(false);
    setIsSuccess(true);
    navigation.navigate('Home');
    setSelectedBeneficiary && setSelectedBeneficiary(null);
    setCartItems && setCartItems([]);
  };

  const handleReprintReceipt = async () => {
    setIsLoading(true);
    handleCheckout();
  };

  const handleLogoutPress = async () => {
    setIsSuccess(true);
  };

  // useEffect(() => {
  //   // Load cartItems and index from cache on mount
  //   const loadCartData = async () => {
  //     try {
  //       const cartData = await AsyncStorage.getItem('cartData');
  //       if (cartData != null) {
  //         const {cartItems, index} = JSON.parse(cartData);
  //         if (index === id) {
  //           setCartItems(cartItems);
  //         }
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   loadCartData();
  // }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        {cartItems.map(item => (
          <CheckoutItem
            key={`${item.name}-${item.quantity}`}
            handleRemoveFromCart={
              checkoutInitiated ? null : handleRemoveFromCart
            }
            item={item}
            removable={!checkoutInitiated}
          />
        ))}
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total:</Text>
          <Text style={styles.totalPrice}>Rs {totalPrice.toFixed(2)}</Text>
        </View>
        {totalPrice > amount ? (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>Exceeds balance</Text>
          </View>
        ) : null}
        {totalPrice < 17001 ? (
          <View style={styles.messageContainer}>
            <Text style={styles.messageText}>Minimum order is Rs 17000</Text>
          </View>
        ) : null}
        <TouchableOpacity
          style={[
            styles.checkoutButton,
            totalPrice === 0 || totalPrice > amount || totalPrice < 17001
              ? styles.disabledButton
              : null,
            isLoading ? styles.loadingButton : null,
          ]}
          onPress={checkoutInitiated ? handleReprintReceipt : handleCheckout}
          disabled={
            totalPrice === 0 ||
            totalPrice > amount ||
            isLoading ||
            totalPrice < 17001
          }>
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#ffffff" />
              <Text style={styles.loadingText}>{loadingState}</Text>
            </View>
          ) : (
            <Text style={styles.checkoutText}>
              {checkoutInitiated ? 'Reprint/Merchant Copy' : 'Checkout & Print'}
            </Text>
          )}
        </TouchableOpacity>
        {CheckoutSuccess && (
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleCloseSuccess}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        )}
        {/* <Modal visible={isSuccess} animationType="slide" transparent={true}>
          <View style={styles.successContainer}>
            <AntDesign name="closecircle" size={64} color="red" />
            <Text style={styles.successText}>
              Are you sure you want to logout?
            </Text>
            <TouchableOpacity
              style={[
                styles.checkoutButton,
                styles.button,
                isLoading ? styles.loadingButton : null,
              ]}
              onPress={handleCloseSuccess}>
              <Text style={styles.checkoutText}>Yes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.checkoutButton,
                styles.button,
                isLoading ? styles.loadingButton : null,
              ]}
              onPress={() => setIsSuccess(false)}
            >
              <Text style={styles.checkoutText}>No</Text>
            </TouchableOpacity>
          </View>
        </Modal> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#007DBC',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    justifyContent: 'center',
  },
  checkoutText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingButton: {
    backgroundColor: '#cccccc',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  messageContainer: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  messageText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  successContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  closeText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutContainer: {
    color: '#ff0000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    textAlign: 'center',
  },
  logoutText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
