import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  ImageBackground,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ModalComponent from './ModelComponent';
import AppContext from '../AppContext';
// import images from './Image';
const images = {
  1: require('../assets/Commodities/red-rice.png'),
  2: require('../assets/Commodities/w-rice.png'),
  3: require('../assets/Commodities/nood.png'),
  4: require('../assets/Commodities/wheat.png'),
  5: require('../assets/Commodities/red-r-floor.png'),
  6: require('../assets/Commodities/tea.png'),
  7: require('../assets/Commodities/sugar.png'),
  8: require('../assets/Commodities/milk-powder.png'),
  9: require('../assets/Commodities/green.png'),
  10: require('../assets/Commodities/dhal.png'),
  11: require('../assets/Commodities/weli-dhal.png'),
  12: require('../assets/Commodities/chick.png'),
  13: require('../assets/Commodities/sprats.png'),
  14: require('../assets/Commodities/salt.png'),
  15: require('../assets/Commodities/coconut-oil.png'),
  16: require('../assets/Commodities/soya.jpg'),
  17: require('../assets/Commodities/red-chilly-powder.png'),
  18: require('../assets/Commodities/weli-chilly-powder.png'),
  19: require('../assets/Commodities/turmeric.png'),
  20: require('../assets/Commodities/curry.png'),
  21: require('../assets/Commodities/dry-chilly.png'),
  22: require('../assets/Commodities/coriander.png'),
  23: require('../assets/Commodities/pepper.png'),
  24: require('../assets/Commodities/garlic.png'),
  25: require('../assets/Commodities/life.png'),
  26: require('../assets/Commodities/other.png'),
  27: require('../assets/Commodities/baby.png'),
  28: require('../assets/Commodities/vim.png'),
  29: require('../assets/Commodities/eva.png'),
  30: require('../assets/Commodities/marie.png'),
  31: require('../assets/Commodities/matches.png'),
  // Add more as needed
};
export default function Card({
  image,
  name,
  price,
  amount,
  benDistrict,
  cartTotal,
  benDs,
  onAddToCart,
  unit,
  max,
  fixed,
  Rquantity,
  exist,
  id,
  district,
}) {
  const initialQuantity = fixed ? max / Rquantity : 1;
  const [quantity, setQuantity] = useState(initialQuantity);
  const [modalVisible, setModalVisible] = useState(false);
  const [newPrice, setNewPrice] = useState('');
  const [dist, setDist] = useState('');
  const handleIncrement = () => {
    const newQuantity = quantity + 1;
    if (newQuantity <= initialQuantity) {
      setQuantity(newQuantity);
    }
    if (
      !fixed &&
      Number(price) * Number(newQuantity) <= amount - cartTotal &&
      newQuantity <= max
    ) {
      setQuantity(newQuantity);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCartPress = () => {
    if (id === '26') {
      setModalVisible(false);
      const updatedPrice = parseFloat(newPrice);
      onAddToCart(name, 1, updatedPrice, '26', 'LOT', 1);
    } else {
      onAddToCart(name, quantity, price, id, unit, Rquantity);
      setQuantity(initialQuantity);
      setModalVisible(false);
    }
  };

  const handlePriceChange = text => {
    if (Number(text) <= amount - cartTotal) {
      setNewPrice(text);
    }
  };
  const cardStyle = [
    styles.cardContainer,
    exist
      ? styles.cardContainerDisabled
      : district !== 1 && district !== dist
      ? styles.cardContainerDisabled
      : false,
    {borderColor: fixed ? 'green' : 'orange', borderWidth: 2},
  ];

  useEffect(() => {
    if (benDs === 'Manthai East' || benDs === 'Thunukkai') {
      setDist(2);
    } else if (benDs === 'Welioya') {
      setDist(3);
    } else {
      setDist(1);
    }
  }, []);

  const otherCardStyle = [
    styles.otherCardContainer,
    exist && styles.cardContainerDisabled,
    {borderColor: fixed ? 'green' : 'orange', borderWidth: 2},
  ];
  let img = images[id];
  return /*district !== 1 && district !== dist ? null :*/ (
    <TouchableOpacity
      style={cardStyle}
      onPress={() => setModalVisible(true)}
      disabled={exist || (district !== 1 && district !== dist)}>
      <ImageBackground source={img} style={styles.image}>
        <View style={styles.overlay}>
          <Text style={styles.name}>{`${id} . ${name}`}</Text>
        </View>
      </ImageBackground>
      <ModalComponent
        img={img}
        name={name}
        Rquantity={Rquantity}
        handleDecrement={handleDecrement}
        handleIncrement={handleIncrement}
        quantity={quantity}
        exist={exist}
        district={district}
        unit={unit}
        benDistrict={benDistrict}
        id={id}
        price={price}
        fixed={fixed}
        max={max}
        newPrice={newPrice}
        handlePriceChange={handlePriceChange}
        handleAddToCartPress={handleAddToCartPress}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '45%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'start',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  otherCardContainer: {
    display: 'flex',
    alignSelf: 'center',
    flexDirection: 'column',
    width: '45%',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'start',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 10,
  },
  cardContainerDisabled: {
    opacity: 0.5, // Reduce the opacity of the card to make it look disabled
  },
  cartButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginLeft: 25,
    marginTop: 10,
  },
  cartButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    padding: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  otherModalBackground: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPriceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 10,
  },
  modalName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalPriceQuantityContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalPriceContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  otherModalPriceQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  modalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalQuantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalQuantityButton: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
  },
  modalQuantity: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  modalPriceInputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalPriceInputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalPriceInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b6b',
    borderRadius: 10, // Increase the border radius for a rounded look
    paddingHorizontal: 20, // Increase the horizontal padding
    paddingVertical: 25, // Increase the vertical padding
    marginTop: 20,
  },
  modalCartButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  modalCartButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
  },
  modalCartButtonTextDisabled: {
    color: '#999999',
  },
});
