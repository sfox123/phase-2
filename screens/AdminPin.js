import React, {useState} from 'react';

import {View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
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
    width: '80%',
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

const AdminPin = () => {
  const [pin, setPin] = useState('');
  const navigation = useNavigation();

  const handlePinSubmit = () => {
    if (pin === '2121212') {
      // onPinEnter(true);
      navigation.navigate('Admin');
    } else {
      Alert.alert('Invalid PIN', 'Please enter the correct PIN.');
      // onPinEnter(false);
    }
  };

  return (
    <View style={styles.Pincontainer}>
      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={setPin}
        placeholder="Enter PIN"
        secureTextEntry
      />
      <Button
        title="Submit"
        onPress={handlePinSubmit}
        color={styles.button.backgroundColor}
      />
    </View>
  );
};

export default AdminPin;
