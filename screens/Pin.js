// This component is the PIN login screen. It is displayed when the user first launches the app.

import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ToastAndroid,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import api from '../api/api';
import retailerData from '../api/retailerData.json';
import data from '../api/data.json';

export default function Pin({
  setSelectedBeneficiary,
  retailerId,
  mode,
  benData,
}) {
  const navigation = useNavigation();
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // When the user clicks the login button
  const handleLogin = async () => {
    setIsLoading(true);
    if (pin === '12345678') {
      ToastAndroid.show(
        'This is a dummy account to be used for training purposes only',
        ToastAndroid.SHORT,
      );
    }

    try {
      if (mode) {
        const beneficiary = benData.find(ben => ben.id == pin);
        if (beneficiary) {
          console.log('WTF');
          if (pin === '12345678') {
            ToastAndroid.show(
              'This is a dummy account to be used for training purposes only',
              ToastAndroid.SHORT,
            );
            setSelectedBeneficiary(beneficiary);
            ToastAndroid.show('Logged in', ToastAndroid.SHORT);
            navigation.navigate('BeneficiaryDetails');
          } else if (beneficiary.retailerAssigned == retailerId) {
            setSelectedBeneficiary(beneficiary);
            ToastAndroid.show('Logged in', ToastAndroid.SHORT);
            navigation.navigate('BeneficiaryDetails');
          } else {
            console.log('WTF');
            const assignedRetailer = retailerData.find(
              retailer => retailer.retailerId === beneficiary.retailerAssigned,
            );
            const {name, gnDivision, retailerId} = assignedRetailer;
            Alert.alert(
              `Beneficiary not allowed to make purchases from this retailer.\nAssigned retailer: ${name} - ${gnDivision} (${retailerId})`,
            );
          }
        } else {
          console.log('WTF');
          const beneficiary = data.find(ben => ben.id == pin);
          const assignedRetailer = retailerData.find(
            retailer => retailer.retailerId == beneficiary.retailerAssigned,
          );
          console.log(retailerData);
          const {name, gnDivision, retailerId} = assignedRetailer;
          Alert.alert(
            `Beneficiary not allowed to make purchases from this retailer.\nAssigned retailer: ${name} - ${gnDivision} (${retailerId})`,
          );
        }
      } else {
        const beneficiary = (await api.get(`/beneficiary/${pin}`)).data;
        if (beneficiary) {
          console.log(`Text/PIN input is used to login. Used ID: ${pin}`);
          console.log('APK_Assigned_retailer:', retailerId);
          console.log('Retailer assigned:', beneficiary.retailerAssigned);

          if (beneficiary.retailerAssigned == retailerId) {
            setSelectedBeneficiary(beneficiary);
            ToastAndroid.show('Logged in', ToastAndroid.SHORT);
            navigation.navigate('BeneficiaryDetails');
          } else if (beneficiary.id == '12345678') {
            ToastAndroid.show(
              'Skipping retailer check for test beneficiary',
              ToastAndroid.SHORT,
            );
            setSelectedBeneficiary(beneficiary);
            navigation.navigate('BeneficiaryDetails');
          } else {
            const assignedRetailer = retailerData.find(
              retailer => retailer.retailerId === beneficiary.retailerAssigned,
            );

            if (assignedRetailer) {
              const {name, gnDivision, retailerId} = assignedRetailer;
              Alert.alert(
                `Beneficiary not allowed to make purchases from this retailer.\nAssigned retailer: ${name} - ${gnDivision} (${retailerId})`,
              );
            }
          }
        } else {
          Alert.alert('Beneficiary not found');
        }
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error finding beneficiary');
    } finally {
      setIsLoading(false);
    }
  };
  // This function checks whether the login button should be disabled
  const isLoginDisabled = () => {
    return pin.length < 6;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your PIN</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        maxLength={8}
        value={pin}
        onChangeText={text => setPin(text)}
        secureTextEntry={true}
      />
      <TouchableOpacity
        style={[styles.button, isLoginDisabled() && styles.disabledButton]}
        onPress={handleLogin}
        disabled={isLoginDisabled()}>
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: 200,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 24,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    width: 200,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
