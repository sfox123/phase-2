// In a separate ModalComponent.js file
import React, {useState, useContext, useEffect} from 'react';
import {
  Modal,
  View,
  TextInput,
  TouchableOpacity,
  Text,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ModalComponent = ({
  img,
  name,
  Rquantity,
  exist = false,
  handleDecrement,
  handleIncrement,
  quantity,
  newPrice,
  district,
  handlePriceChange,
  id,
  unit,
  benDistrict,
  price,
  handleAddToCartPress,
  modalVisible,
  setModalVisible,
}) => {
  useEffect(() => {
    console.log(newPrice === '');
  }, []);
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <Image source={img} style={styles.modalImage} />
              <Text
                style={styles.modalName}>{`${name} ${Rquantity}${unit}`}</Text>
              <View style={styles.modalPriceQuantityContainer}>
                <View style={styles.modalPriceContainer}>
                  <Text style={styles.modalPrice}>Rs {price}</Text>
                </View>
                {id == '26' ? (
                  <View style={styles.modalPriceContainer}>
                    <TextInput
                      style={styles.modalPriceInput}
                      value={newPrice.toString()}
                      onChangeText={handlePriceChange}
                      keyboardType="numeric"
                    />
                  </View>
                ) : (
                  <View style={styles.modalQuantityContainer}>
                    <TouchableOpacity onPress={handleDecrement}>
                      <Text style={styles.modalQuantityButton}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.modalQuantity}>{quantity}</Text>
                    <TouchableOpacity onPress={handleIncrement}>
                      <Text style={styles.modalQuantityButton}>+</Text>
                    </TouchableOpacity>
                  </View>
                )}
                <TouchableOpacity
                  style={[
                    styles.modalCartButton,
                    exist && styles.modalCartButtonDisabled,
                    id == '26' &&
                      newPrice === '' &&
                      styles.modalCartButtonDisabled,
                  ]}
                  onPress={exist ? null : handleAddToCartPress}
                  disabled={exist || (id == '26' && newPrice === '')}>
                  <Text
                    style={[
                      styles.modalCartButtonText,
                      exist && styles.modalCartButtonTextDisabled,
                      id == '26' &&
                        newPrice === '' &&
                        styles.modalCartButtonTextDisabled,
                    ]}>
                    Add to cart
                  </Text>
                  <AntDesign name="shoppingcart" size={24} color="#ffffff" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

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

export default ModalComponent;
