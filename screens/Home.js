import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import Logo from '../assets/logo';
import {useNavigation} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import {BlurView} from '@react-native-community/blur';
import banner from '../assets/banner.png';
import wfp from '../assets/wfp.png';
import samurdhi from '../assets/samurdhi.png';

export default function Home() {
  const navigation = useNavigation();
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const logoTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-200, 0],
  });

  const buttonsTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 400],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={10}>
        <LinearGradient
          colors={['#f0c11b', '#ffffff']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.gradient}
        />
        <Animated.View
          style={[
            styles.logoContainer,
            {transform: [{translateY: logoTranslateY}]},
          ]}>
          <Logo image={banner} />
        </Animated.View>
        <Animated.View
          style={[
            styles.contentContainer,
            {transform: [{translateY: buttonsTranslateY}]},
          ]}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Scanner')}>
            <Icon
              style={{marginRight: 10}}
              size={30}
              color="#fff"
              name="qrcode"
            />
            <Text style={{color: 'white', fontSize: 20}}>Scan QR</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {marginTop: 20}]}
            title="Pin"
            onPress={() => navigation.navigate('Pin')}>
            <Icon
              style={{marginRight: 10}}
              size={30}
              color="#fff"
              name="lock"
              type="font-awesome"
            />
            <Text style={{color: 'white', fontSize: 20}}>Enter PIN</Text>
          </TouchableOpacity>
          <View style={styles.footer}>
            <View style={styles.footerContainer}>
              <Text style={styles.partnerText}>Associated With</Text>
              <View style={styles.logos}>
                <Logo id={2} image={wfp} />
                <Logo id={3} image={samurdhi} />
              </View>
            </View>
            <TouchableOpacity
              style={styles.adminButton}
              onPress={() => navigation.navigate('AdminPin')}>
              <Icon
                style={{marginRight: 10}}
                size={20}
                color="#fff"
                name="key"
                type="font-awesome"
              />
              <Text style={{color: 'white', fontSize: 15}}>Admin</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  logos: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  partnerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 30,
    width: 250,
    height: 80,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  adminButton: {
    display: 'inline-block',
    backgroundColor: 'red',
    width: 105,
    height: 50,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
