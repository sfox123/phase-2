import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import QRCodeScanner from 'react-native-qrcode-scanner';
import api from '../api/api';

const Scanner = ({setSelectedBeneficiary, retailerId, benData, mode}) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
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
          if (pin === '12345678') {
            ToastAndroid.show(
              'This is a dummy account to be used for training purposes only',
              ToastAndroid.SHORT,
            );
            setSelectedBeneficiary(beneficiary);
            ToastAndroid.show('Logged in', ToastAndroid.SHORT);
            navigation.navigate('BeneficiaryDetails');
          } else {
            setSelectedBeneficiary(beneficiary);
            ToastAndroid.show('Logged in', ToastAndroid.SHORT);
            navigation.navigate('BeneficiaryDetails');
          }
        } else {
          Alert.alert('Beneficiary not found');
        }
      } else {
        const beneficiary = (await api.get(`/beneficiary/${e.data}`)).data;
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
            const beneficiaryRetailerdata = (await api.get(`/retailers`)).data;
            const assignedRetailer = beneficiaryRetailerdata.find(
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
