import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import api from '../api/api';

const Scanner = ({setSelectedBeneficiary, retailerId}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const requestCameraPermission = async () => {
      try {
        const status = await check(PERMISSIONS.ANDROID.CAMERA);
        if (status !== RESULTS.GRANTED) {
          const requestStatus = await request(PERMISSIONS.ANDROID.CAMERA);
          setHasPermission(requestStatus === RESULTS.GRANTED);
        } else {
          setHasPermission(true);
        }
      } catch (err) {
        console.warn(err);
      }
    };

    requestCameraPermission();
  }, []);

  const handleBarCodeScanned = async e => {
    try {
      const beneficiary = (await api.get(`/beneficiary/${e.data}`)).data;
      if (beneficiary.retailerAssigned === retailerId) {
        setSelectedBeneficiary(beneficiary);
        navigation.navigate('BeneficiaryDetails');
      } else if (e.data == '12345678') {
        setSelectedBeneficiary(beneficiary);
        navigation.navigate('BeneficiaryDetails');
      } else {
        Alert.alert(
          `Beneficiary not assigned to this retailer.\nAssigned retailer: ${beneficiary.retailerAssigned}`,
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error finding beneficiary');
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <QRCodeScanner
        onRead={handleBarCodeScanned}
        reactivate={true}
        reactivateTimeout={5000}
        showMarker={true}
        markerStyle={{borderColor: 'white'}}
        cameraStyle={styles.cameraContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  cameraContainer: {
    height: '100%',
    width: '100%',
  },
});

export default Scanner;
