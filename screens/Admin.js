import React, {useState} from 'react';
import QRCodeScanner from 'react-native-qrcode-scanner';

import {
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5fcff',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  qrScanner: {
    height: 200,
    width: '100%',
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
});

const PinRequest = ({onPinEnter}) => {
  const [pin, setPin] = useState('');

  const handlePinSubmit = () => {
    if (pin === '2121212') {
      onPinEnter(true);
    } else {
      Alert.alert('Invalid PIN', 'Please enter the correct PIN.');
      onPinEnter(false);
    }
  };

  return (
    <View style={styles.container}>
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

const Admin = () => {
  const [onlineMode, setOnlineMode] = useState(false);
  const [retailerId, setRetailerId] = useState('');
  const [showScanner, setShowScanner] = useState(false);

  const handleUpdate = () => {
    // Update retailer ID
  };

  const handleScan = e => {
    // Handle scanned QR code
    setShowScanner(false);
  };

  const handleSync = () => {
    // Sync data
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Admin Dashboard</Text>

      <View style={styles.switchContainer}>
        <Text>Online Mode:</Text>
        <Switch
          value={onlineMode}
          onValueChange={value => setOnlineMode(value)}
        />
      </View>

      <TextInput
        style={styles.input}
        value={retailerId}
        onChangeText={setRetailerId}
        placeholder="Enter Retailer ID"
      />

      <Button title="Update" onPress={handleUpdate} />

      <Text style={styles.headerText}>Find Beneficiary</Text>

      <Button title="PIN" onPress={() => setShowScanner(true)} />

      {showScanner && (
        <QRCodeScanner
          onRead={handleScan}
          reactivate={true}
          reactivateTimeout={5000}
          showMarker={true}
          markerStyle={{borderColor: 'white'}}
          cameraStyle={styles.qrScanner}
        />
      )}

      <Button title="Sync" onPress={handleSync} />
    </View>
  );
};

const App = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  const handlePinEnter = isValid => {
    setIsAdmin(isValid);
  };

  return isAdmin ? <Admin /> : <PinRequest onPinEnter={handlePinEnter} />;
};

export default App;
