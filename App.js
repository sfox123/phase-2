import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Scanner from './screens/Scanner';
import {createStackNavigator} from '@react-navigation/stack';
import Home from './screens/Home';
import Pin from './screens/Pin';
import Admin from './screens/Admin';
import Status from './screens/Status';
import BeneficiaryDetails from './screens/BenDetails';
import CartPage from './screens/CartPage';
import {NavigationContainer} from '@react-navigation/native';
import LanguageSelectionScreen from './screens/Lang';
import Other from './screens/Other';
import {Alert, StatusBar} from 'react-native';
import {DeviceEventEmitter} from 'react-native';
const Stack = createStackNavigator();
import {BluetoothManager} from 'react-native-bluetooth-escpos-printer';
import {connectPrinter} from './api/btprinter';
import AdminPin from './screens/AdminPin';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
  const [language, setLanguage] = useState('tam');
  const [retailer, setRetailer] = useState('');
  const [benData, setBenData] = useState([]);
  const [mode, setMode] = useState('');

  StatusBar.setTranslucent(true);
  StatusBar.setBackgroundColor('rgba(0, 0, 0, 0.2)');

  useEffect(() => {
    const deviceFoundListener = DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_DEVICE_FOUND,
      devices => {
        console.log('Found devices:');
        console.log(devices);
      },
    );

    const deviceAlreadyPairedListener = DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_DEVICE_ALREADY_PAIRED,
      devices => {
        console.log('Already paired devices discovered: ', devices);
      },
    );

    const deviceDiscoverDoneListener = DeviceEventEmitter.addListener(
      BluetoothManager.EVENT_DEVICE_DISCOVER_DONE,
      () => {
        // Handle device discovery done
        console.log('Device discovery done');
        // You can emit a custom event or perform any necessary actions here
        // setIsScanning(false);
      },
    );

    return () => {
      deviceFoundListener.remove();
      deviceDiscoverDoneListener.remove();
      deviceAlreadyPairedListener.remove();
    };
  }, []);

  const handleAddToCart = (name, quantity, price, id, unit, Rquantity) => {
    const newItem = {name, quantity, price, id, unit, Rquantity};
    setCartItems([...cartItems, newItem]);
    console.log('Adding to cart :', cartItems);
  };

  const handleRemoveFromCart = item => {
    const newCartItems = cartItems.filter(cartItem => cartItem !== item);
    setCartItems(newCartItems);
  };

  var paired = [];

  const BluetoothEnable = async () => {
    try {
      console.log('Checking devices');
      const devices = await BluetoothManager.enableBluetooth();
      console.log(devices);

      if (devices && devices.length > 0) {
        for (var i = 0; i < devices.length; i++) {
          try {
            paired.push(JSON.parse(devices[i]));
          } catch (e) {
            console.log('Parsing error', e);
          }
        }
      }
      try {
        connectPrinter(paired[0].address);
      } catch (error) {
        console.log('PRINTER ERROR');
      }
      paired = [];
    } catch (error) {
      if (error.message === 'EVENT_BLUETOOTH_NOT_SUPPORT') {
        Alert.alert(
          'Bluetooth Error:',
          'Device does not support Bluetooth. This application needs Bluetooth to function.',
        );
      } else {
        console.log('Bluetooth error:', error);
        Alert.alert('Bluetooth Error', error.toString());
      }
    }
  };

  const enableBluetoothInBackground = () => {
    const interval = setInterval(() => {
      console.log('Sending printer wake up signal');
      BluetoothEnable();
    }, 5 * 4000);
    return () => {
      clearInterval(interval);
    };
  };

  useEffect(() => {
    enableBluetoothInBackground(); // Start running BluetoothEnable in the background
  }, []);

  //setting parameters for offline mode
  useEffect(() => {
    const getLanguage = async () => {
      try {
        const lang = await AsyncStorage.getItem('selectedLanguage');
        const onlineMode = await AsyncStorage.getItem('isOnline');
        const retailerCache = await AsyncStorage.getItem('retailer');
        const BenCache = await AsyncStorage.getItem('benCache');
        console.log(retailerCache);
        if (lang !== null) {
          setLanguage('tam');
        }
        if (retailer !== null) {
          setRetailer(retailerCache);
          console.log(retailer);
        }
        if (onlineMode !== null) {
          setMode(onlineMode === 'true' ? true : false);
        }
        if (BenCache !== null) {
          setBenData(JSON.parse(BenCache));
        }
        console.log('BenCache', BenCache);
        console.log('Retailer', retailerCache);
        console.log('Online Mode', onlineMode);
      } catch (error) {
        console.error(error);
      }
    };
    getLanguage();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Pin">
          {props => (
            <Pin
              {...props}
              retailerId={retailer}
              mode={mode}
              benData={benData}
              setSelectedBeneficiary={setSelectedBeneficiary}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Admin">
          {props => (
            <Admin
              {...props}
              mode={mode}
              setMode={setMode}
              retailer={retailer}
              BenCache={benData}
              setBenData={setBenData}
              setRetailer={setRetailer}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="AdminPin">
          {props => <AdminPin {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Status">
          {props => (
            <Status
              {...props}
              retailerId={retailer}
              setSelectedBeneficiary={setSelectedBeneficiary}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Scanner">
          {props => (
            <Scanner
              {...props}
              retailerId={retailer}
              mode={mode}
              benData={benData}
              setSelectedBeneficiary={setSelectedBeneficiary}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Cart">
          {props => (
            <CartPage
              {...props}
              cartItems={cartItems}
              setSelectedBeneficiary={setSelectedBeneficiary}
              setCartItems={setCartItems}
              retailerId={retailer}
              mode={mode}
              benData={benData}
              setBenData={setBenData}
              selectedBeneficiary={selectedBeneficiary}
              handleRemoveFromCart={handleRemoveFromCart}
            />
          )}
        </Stack.Screen>

        <Stack.Screen
          name="BeneficiaryDetails"
          options={{title: 'Beneficiary Details', headerShown: false}}>
          {props => (
            <BeneficiaryDetails
              {...props}
              cartItems={cartItems}
              selectedBeneficiary={selectedBeneficiary}
              setSelectedBeneficiary={setSelectedBeneficiary}
              setCartItems={setCartItems}
              setLanguage={setLanguage}
              handleAddToCart={handleAddToCart}
              language={language}
              handleRemoveFromCart={handleRemoveFromCart}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="LanguageSelection"
          component={LanguageSelectionScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen name="Other" options={{headerShown: false}}>
          {props => <Other {...props} setCartItems={setCartItems} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
