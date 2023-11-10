import React, {useState, useEffect, useCallback} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import {Alert} from 'react-native';
import api from '../api/api';
import {activeId} from '../App';
import {isPrinterOk} from '../api/btprinter';
import items from '../api/comodities';
import retailerData from '../api/retailerData.json';

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
import {retailerId} from '../App';

export default function CartPage({
  selectedBeneficiary,
  retailer,
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
        console.log(retailers);
        console.log(retailerId);

        const assignedRetailer = retailers.find(
          retailer => retailer.retailerId === retailerId,
        );
        console.log(assignedRetailer);

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

  const handlePrintReceipt = async () => {
    const orderID = generateOrderID(selectedBeneficiary);
    console.log('Order ID:', orderID);

    try {
      const currentDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Colombo', // Set the time zone to Sri Lanka
      });

      let bal = selectedBeneficiary.amount;
      let cycle = '18/11/2023';

      setIsLoading(false);

      // Use the "amount" in your code as needed

      try {
        // Set alignment to CENTER for the header
        BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        );
        BluetoothEscposPrinter.setBlob(0);

        // Print the header
        BluetoothEscposPrinter.printText('WFP - DSD\n\r', {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1,
        });

        // Set alignment to CENTER for the header
        BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        );
        BluetoothEscposPrinter.setBlob(0);

        // Print the header
        BluetoothEscposPrinter.printText('Mini\n\r', {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1,
        });

        // Set alignment to CENTER for the header
        BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        );
        BluetoothEscposPrinter.setBlob(0);

        // Print the header
        BluetoothEscposPrinter.printText('Food-City\n\r', {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1,
        });

        // Print "Receipt" text
        BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        );
        BluetoothEscposPrinter.setBlob(0);
        BluetoothEscposPrinter.printText('Receipt\n\r', {
          encoding: 'GBK',
          codepage: 0,
          widthtimes: 0,
          heigthtimes: 0,
          fonttype: 1,
        });
        BluetoothEscposPrinter.printText(
          '--------------------------------\n\r',
          {},
        );

        // Set alignment to LEFT for the rest of the receipt
        BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);

        // Print customer details, order number, and date
        if (selectedBeneficiary.id) {
          if (assignedRetailer) {
            assignedRetailer.name = assignedRetailer.name;
            assignedRetailer.dsDivision = assignedRetailer.dsDivision;
            assignedRetailer.gnDivision = assignedRetailer.gnDivision;
          } else {
            !assignedRetailer;
          }
          {
            setAssignedRetailer({
              name: 'n/a',
              dsDivision: 'n/a',
              retailerId: 'n/a',
              gnDivision: 'n/a',
            });
          }
        } else if (!selectedBeneficiary) {
          selectedBeneficiary.name = ' ';
        }

        BluetoothEscposPrinter.printText(
          'Customer: ' + selectedBeneficiary.id + '\n\r',
          {},
        );

        BluetoothEscposPrinter.printText('Order#: ' + orderID + '\n\r', {});
        BluetoothEscposPrinter.printText('Date: ' + currentDate + '\n\r', {});

        // Print a separator line
        BluetoothEscposPrinter.printText(
          '--------------------------------\n\r',
          {},
        );

        BluetoothEscposPrinter.printColumn(
          [16, 7, 9], // Adjust column widths as needed
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ['Item', 'Qty', 'Amount'], // Column headers
          {},
        );

        // Print an empty line
        BluetoothEscposPrinter.printText('\n\r', {});

        // Loop through cart items and print each item's details, including the unit and amount
        cartItems.forEach(item => {
          const itemEng =
            items.find(i => i.tam === item.name) ||
            items.find(i => i.sin === item.name);
          const itemName = itemEng ? itemEng.eng || itemEng.sin : item.name;
          const unit = item.unit || '';
          const itemquantity = Number(item.Rquantity) * Number(item.quantity);
          const amount = (item.price * item.quantity).toFixed(2); // Calculate the total amount for the item
          BluetoothEscposPrinter.printColumn(
            [16, 7, 9], // Adjust column widths as needed
            [
              BluetoothEscposPrinter.ALIGN.LEFT,
              BluetoothEscposPrinter.ALIGN.CENTER,
              BluetoothEscposPrinter.ALIGN.RIGHT,
            ],
            [itemName.toString(), `${itemquantity}${unit}`, amount],
            {
              encoding: 'UTF8',
            },
          );
        });

        // Print an empty line
        BluetoothEscposPrinter.printText('\n\r', {});

        // Calculate and print the total quantity and total amount
        let totalQuantity = 0;
        let totalAmount = 0;
        const totalItems = cartItems.length;

        cartItems.forEach(item => {
          totalQuantity += item.quantity;
          totalAmount += item.price * item.quantity;
        });

        BluetoothEscposPrinter.printColumn(
          [16, 7, 9], // Adjust column widths as needed
          [
            BluetoothEscposPrinter.ALIGN.LEFT,
            BluetoothEscposPrinter.ALIGN.CENTER,
            BluetoothEscposPrinter.ALIGN.RIGHT,
          ],
          ['Total', totalItems.toString(), totalAmount.toFixed(2)],
          {
            encoding: 'UTF8',
            codepage: 11,
          },
        );

        BluetoothEscposPrinter.printText('\n\r', {});
        BluetoothEscposPrinter.printText(
          '--------------------------------\n\r',
          {},
        );

        // Print additional details
        // BluetoothEscposPrinter.printText("Discount rate: 100%\n\r", {});
        BluetoothEscposPrinter.printText(
          'Total amount: ' + totalAmount.toFixed(2) + '\n\r',
          {},
        );
        BluetoothEscposPrinter.printText(
          'Paid: ' + totalAmount.toFixed(2) + '\n\r',
          {},
        );
        BluetoothEscposPrinter.printText(
          'Voucher Balance: ' + bal + '\n\r',
          {},
        );
        // Print printing timestamp and footer
        if (!assignedRetailer) {
          assignedRetailer.name = 'N/A';
          assignedRetailer.gnDivision = 'N/A';
          assignedRetailer.dsDivision = 'N/A';
        }
        BluetoothEscposPrinter.printText(
          '--------------------------------\n\r',
          {},
        );
        // Check if assignedRetailer.name is null and provide a default value
        // console.log('Retailer name ', assignedRetailer.name);
        //const retailerName = assignedRetailer.name ? assignedRetailer.name : "n/a";
        BluetoothEscposPrinter.printText('Retailer: TEST' + '\n\r', {});

        // Check if assignedRetailer.gnDivision and assignedRetailer.dsDivision are null and provide default values
        //const gnDivision = assignedRetailer.gnDivision ? assignedRetailer.gnDivision : "n/a";
        //const dsDivision = assignedRetailer.dsDivision ? assignedRetailer.dsDivision : "n/a";
        BluetoothEscposPrinter.printText(
          'Test DS' + ' - ' + 'Test GN' + '\n\r',
          {},
        );
        BluetoothEscposPrinter.printText(
          '--------------------------------\n\r',
          {},
        );

        // Set alignment to CENTER for the thank you message
        BluetoothEscposPrinter.printerAlign(
          BluetoothEscposPrinter.ALIGN.CENTER,
        );

        // Print a thank you message
        BluetoothEscposPrinter.printText('Thank you for your visit\n\r', {});
        BluetoothEscposPrinter.printText('Voucher expires on ' + cycle.to, {});
        BluetoothEscposPrinter.printText('\n\r', {});
        BluetoothEscposPrinter.printText('\n\r', {});
        BluetoothEscposPrinter.printText('\n\r', {});
        BluetoothEscposPrinter.printText('\n\r', {});
        BluetoothEscposPrinter.printText('\n\r', {});
        BluetoothEscposPrinter.printText('\n\r', {});
        BluetoothEscposPrinter.printText('\n\r', {});
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
        await handlePrintReceipt();
        setIsLoading(false);
        Alert.alert('Receipt reprinted.');
      } catch (printError) {
        console.error('Error printing receipt:', printError);
        if (retryCount < 5) {
          console.log('Retrying');
          retryCount++;
          // You can add more retries or other logic here.
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
          // Find the index of the selectedBeneficiary in the benData array
          const index = benData.findIndex(
            ben => ben.id === selectedBeneficiary.id,
          );

          // Make a copy of benData to avoid direct state mutation
          let benDataTmp = [...benData];

          if (index !== -1) {
            // Make a copy of selectedBeneficiary to avoid direct state mutation
            let selectedBeneficiaryTmp = {...selectedBeneficiary};

            // Modify the itemsPurchased array and the amount key
            selectedBeneficiaryTmp.itemsPurchased.push({
              date: new Date(),
              items: cartItems,
            });
            selectedBeneficiaryTmp.amount =
              totalPrice - selectedBeneficiaryTmp.amount;
            selectedBeneficiaryTmp.uploaded = false;
            // Replace the object at the found index with the updated selectedBeneficiary
            benDataTmp[index] = selectedBeneficiaryTmp;
          }

          setBenData(benDataTmp);

          // Save the updated benData array to AsyncStorage
          await AsyncStorage.removeItem('benData');
          await AsyncStorage.setItem('benData', JSON.stringify(benDataTmp));
          setloadingState('Printing');
          setIsReceiptPrinted(true);
          try {
            await handlePrintReceipt();
            setIsCheckoutSuccess(true);
            Alert.alert('Order placed successfully!');
          } catch (printError) {
            console.error('Error printing receipt:', printError);
            if (retryCount < 5) {
              console.log('Retrying');
              retryCount++;
              // You can add more retries or other logic here.
            } else {
              console.error('Printing failed after multiple retries.');
              setIsLoading(false);
              return;
            }
          }
        } else {
          await api
            .post('/beneficiaries/updateCart', {cartItems, id, retailer})
            .then(async response => {
              setTimeout(async () => {
                setloadingState('Printing');
                setIsReceiptPrinted(true);
                if (isPrinterOk) {
                  try {
                    // await connectPrinter(activeId);
                    // await delay(3000); // Wait for the printer connection
                    console.log('FUCK OFF');
                  } catch (error) {
                    console.log('Printer error:', error);
                    Alert.alert(
                      'Printer disconnected. Check printer and reprint',
                    );
                    setIsLoading(false);
                    return; // Stop execution if there's a printer error
                  }
                } else {
                  console.log('No paired devices found.');
                  Alert.alert(
                    'Printer disconnected. Check printer and reprint',
                  );
                  setIsLoading(false);
                  setIsCheckoutSuccess(true);
                  return; // Stop execution if there are no paired devices
                }
                try {
                  await handlePrintReceipt();
                  setIsCheckoutSuccess(true);
                  Alert.alert('Order placed successfully!');
                } catch (printError) {
                  console.error('Error printing receipt:', printError);
                  if (retryCount < 5) {
                    console.log('Retrying');
                    retryCount++;
                    // You can add more retries or other logic here.
                  } else {
                    console.error('Printing failed after multiple retries.');
                    setIsLoading(false);
                    return;
                  }
                }
                // Introduce a 2-second delay before setting the loading state back to false
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

  useEffect(() => {
    // Load cartItems and index from cache on mount
    const loadCartData = async () => {
      try {
        const cartData = await AsyncStorage.getItem('cartData');
        if (cartData != null) {
          const {cartItems, index} = JSON.parse(cartData);
          if (index === id) {
            setCartItems(cartItems);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };
    loadCartData();
  }, []);

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
              {checkoutInitiated ? 'Reprint' : 'Checkout & Print'}
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
