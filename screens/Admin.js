import React, {useState, useEffect} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import handlePrintReceipt from '../components/PrintReciept';
import data from '../api/data.json';
import retailerData from '../api/retailerData.json';

import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';

const Admin = ({mode, retailer, setMode, setRetailer, BenCache}) => {
  const [showScanner, setShowScanner] = useState(false);
  const [pin, setPin] = useState('');
  const [inputRetailer, setRetailerInput] = useState('');
  const [online, setOnline] = useState(false);
  const [beneficiary, setBeneficiary] = useState(false);
  const [offlineBen, setOfflineBen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleBenListOff = async () => {
      BenCache.filter(item => {
        if (item.uploaded === false) {
          setOfflineBen([...offlineBen, item]);
        }
      });
    };
    handleBenListOff();
    console.log(offlineBen);
  }, []);

  const handleUpdate = async () => {
    // Update retailer ID
    const BenCache = [];
    try {
      if (retailer !== inputRetailer) {
        await AsyncStorage.removeItem('retailer');
        await AsyncStorage.setItem('retailer', inputRetailer);
        setRetailer(inputRetailer);
        if (online) {
          data.map(async (item, index) => {
            if (item.retailerAssigned == inputRetailer) {
              BenCache.push(item);
              console.log(item);
            }
          });
          await AsyncStorage.setItem('benCache', JSON.stringify(BenCache));
        }
        setRetailer(inputRetailer);
      }
      if (online !== mode) {
        await AsyncStorage.removeItem('isOnline');
        await AsyncStorage.setItem('isOnline', JSON.stringify(online));
      }
      Alert.alert('Retailer ID updated successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error updating retailer ID');
    }
  };

  const handlePrintCycle = async e => {
    const cycle = (await api.get(`/beneficiary/${pin}/cycle/${e}`)).data;
    const beneficiary = (await api.get(`/beneficiary/${pin}`)).data;
    const benRetailer = beneficiary.retailerAssigned;
    const assignedRetailer = retailerData.filter(retailer => retailer.retailerId === benRetailer);

    console.log('Printing receipt');
    const orderID = `ADMINPRINT-CYCLE-${e}`;
    handlePrintReceipt(
      cycle,
      pin,
      (balance = beneficiary.amount),
      assignedRetailer,
      orderID,
      e,
    );
    // Print receipt
  };

  const handleRequestPin = async e => {
    try {
      const beneficiary = (await api.get(`/beneficiary/${pin}`)).data;
      setBeneficiary(beneficiary);
      console.log(beneficiary);
    } catch (error) {
      setError('Error finding beneficiary');
    }
    setLoading(false);
    setShowScanner(false);
    // Handle scanned QR code
  };
  const handleRequestQR = async e => {
    try {
      const beneficiary = (await api.get(`/beneficiary/${e.data}`)).data;
    } catch (error) {
      Alert.alert('Error finding beneficiary');
    }
    // Handle scanned QR code
    setShowScanner(false);
  };

  const handleSync = async () => {
    const das = await AsyncStorage.getItem('benCache');
    console.log(online);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Admin Dashboard</Text>

      <View style={styles.switchContainer}>
        <Text>Offline Mode:</Text>
        <Switch value={online} onValueChange={setOnline} />
      </View>
      <View style={styles.BeneficiaryInputBox}>
        <TextInput
          style={styles.input}
          value={inputRetailer}
          onChangeText={setRetailerInput}
          placeholder={retailer !== null ? retailer : 'Enter Retailer ID'}
        />
        <Button title="Update" onPress={handleUpdate} />

        <Text style={styles.headerText}>Find Beneficiary</Text>
        <View style={{marginBottom: 20}}>
          <TextInput
            style={styles.input}
            value={pin}
            onChangeText={setPin}
            placeholder={'PIN'}
          />
          <Button title="Enter PIN" onPress={handleRequestPin} />
        </View>
        <Button title="Scan QR Code" onPress={() => setShowScanner(true)} />
        {showScanner && (
          <QRCodeScanner
            onRead={handleRequestQR}
            reactivate={true}
            reactivateTimeout={5000}
            showMarker={true}
            markerStyle={{borderColor: 'white'}}
            cameraStyle={styles.qrScanner}
          />
        )}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        beneficiary && (
          <View style={styles.beneficiaryDetails}>
            <Text style={styles.beneficiaryText}>
              Name: {beneficiary.lastName}
            </Text>
            <Text style={styles.beneficiaryText}>NIC: {beneficiary.NIC}</Text>
            <Text style={styles.beneficiaryText}>
              GN Division: {beneficiary.gnDivision}
            </Text>

            <Text style={styles.headerText}>Cycle</Text>
            {beneficiary.cycle.map((cycle, index) => (
              <View key={index} style={styles.cycleContainer}>
                <Text style={styles.cycleText}>
                  Cycle {index + 1}: {cycle.amount}
                </Text>
                {cycle.amount !== 17500 && (
                  <Button
                    title={`Print Receipt Cycle ${index + 1}`}
                    onPress={() => handlePrintCycle(index)}
                    style={styles.printReceiptButton}
                  />
                )}
              </View>
            ))}
          </View>
        )
      )}

      <Button title="Sync" onPress={handleSync} />
    </View>
  );
};

const styles = StyleSheet.create({
  Pincontainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  container: {
    flex: 1,
    justifyContent: 'start',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  qrScanner: {
    height: 200,
    width: '100%',
    marginBottom: 20,
  },
  BeneficiaryInputBox: {
    width: '80%',
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
  button: {
    width: '80%',
    backgroundColor: '#841584',
    color: '#ffffff',
  },
  beneficiaryDetails: {
    width: '80%',
    marginTop: 20,
    marginBottom: 20,
  },
  beneficiaryText: {
    fontSize: 16,
    marginBottom: 10,
  },
  cycleContainer: {
    marginBottom: 20,
  },
  cycleText: {
    fontSize: 16,
    marginBottom: 5,
  },
  printReceiptButton: {
    backgroundColor: '#841584',
    color: '#ffffff',
  },
});

export default Admin;
