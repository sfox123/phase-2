import React, {useState, useEffect} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import {Picker} from '@react-native-picker/picker';
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
  ScrollView,
} from 'react-native';

const Admin = ({
  mode,
  retailer,
  setMode,
  setRetailer,
  BenCache,
  setBenData,
}) => {
  const [showScanner, setShowScanner] = useState(false);
  const [pin, setPin] = useState('');
  const [inputRetailer, setRetailerInput] = useState('');
  const [online, setOnline] = useState(mode);
  const [beneficiary, setBeneficiary] = useState(false);
  const [offlineBen, setOfflineBen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDsDivision, setSelectedDsDivision] = useState(null);
  const [selectedGnDivision, setSelectedGnDivision] = useState(null);
  const [selectedRetailer, setSelectedRetailer] = useState(null);

  const dsDivisions = [...new Set(retailerData.map(item => item.dsDivision))];
  const gnDivisions = selectedDsDivision
    ? retailerData
        .filter(item => item.dsDivision === selectedDsDivision)
        .map(item => item.gnDivision)
    : [];

  const handleDsDivisionChange = dsDivision => {
    setSelectedDsDivision(dsDivision);
    setSelectedGnDivision(null);
    setSelectedRetailer(null);
  };
  const handleGnDivisionChange = gnDivision => {
    setSelectedGnDivision(gnDivision);
    const retailer = retailerData.find(
      item =>
        item.dsDivision === selectedDsDivision &&
        item.gnDivision === gnDivision,
    );
    setSelectedRetailer(retailer);
  };

  useEffect(() => {
    console.log('Admin Page: ', BenCache);

    // Create a new array
    let newOfflineBen = [];

    BenCache.map((item, index) => {
      if (item.uploaded === false) {
        // Add items to the new array instead of offlineBen
        newOfflineBen.push(item);
      }
    });

    // Set offlineBen to the new array
    setOfflineBen(newOfflineBen);

    console.log('Offline Ben: ', newOfflineBen);
  }, []);

  const handleUpdate = async () => {
    // Update retailer ID
    console.log(selectedRetailer);
    const BenCache = [];
    try {
      if (retailer !== inputRetailer) {
        await AsyncStorage.removeItem('retailer');
        await AsyncStorage.setItem('retailer', selectedRetailer.retailerId);
        if (online) {
          data.map(async (item, index) => {
            if (item.retailerAssigned == selectedRetailer.retailerId) {
              BenCache.push(item);
              console.log(item);
            }
          });
          await AsyncStorage.setItem('benCache', JSON.stringify(BenCache));
          setBenData(BenCache);
        }
        setRetailer(selectedRetailer.retailerId);
      }
      if (online === true) {
        setMode(online);
        await AsyncStorage.removeItem('isOnline');
        await AsyncStorage.setItem('isOnline', JSON.stringify(online));
      }
      if (online === false) {
        setMode(online);
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
    const assignedRetailer = retailerData.filter(
      retailer => retailer.retailerId === benRetailer,
    );

    console.log('Printing receipt');
    const orderID = `ADMINPRINT-CYCLE-${e + 1}`;
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
      setBeneficiary(beneficiary);
      setShowScanner(false);
    } catch (error) {
      Alert.alert('Error finding beneficiary');
    }
    // Handle scanned QR code
    setShowScanner(false);
  };
  const handleSync = async () => {
    setLoading(true);
    try {
      const promises = offlineBen.map(async (item, index) => {
        const cartItems = item.itemsPurchased[0].cartItems;
        const id = item.id;
        console.log(cartItems, id, retailer);
        const req = await api.post('/beneficiaries/updateCart', {
          cartItems,
          id,
        });
        item.uploaded = true;
        return req.data;
      });

      const results = await Promise.all(promises);
      console.log(results);

      await AsyncStorage.removeItem('benCache');
      await AsyncStorage.setItem('benCache', JSON.stringify(offlineBen));
      setOfflineBen([]);
      Alert.alert('Data synced successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error syncing data');
    } finally {
      setLoading(false);
    }
    console.log(offlineBen);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.headerText}>Admin Dashboard</Text>

        <View style={styles.switchContainer}>
          <Text>Offline Mode:</Text>
          <Switch value={online} onValueChange={setOnline} />
        </View>
        <View style={styles.BeneficiaryInputBox}>
          <Picker
            selectedValue={selectedDsDivision}
            onValueChange={handleDsDivisionChange}>
            {dsDivisions.map(dsDivision => (
              <Picker.Item
                key={dsDivision}
                label={dsDivision}
                value={dsDivision}
              />
            ))}
          </Picker>

          {selectedDsDivision && (
            <Picker
              selectedValue={selectedGnDivision}
              onValueChange={handleGnDivisionChange}>
              {gnDivisions.map(gnDivision => (
                <Picker.Item
                  key={gnDivision}
                  label={gnDivision}
                  value={gnDivision}
                />
              ))}
            </Picker>
          )}
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
        <View style={styles.BeneficiaryInputBox}>
          <Text style={styles.headerText}>
            Total Offline Beneficiaries: {offlineBen.length}
          </Text>
          <Button title="Upload" onPress={handleSync} />
          {loading && <ActivityIndicator size="large" color="#000" />}
        </View>
      </View>
    </ScrollView>
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
