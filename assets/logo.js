import React from 'react';
import {Image} from 'react-native';

const Logo = ({image, id}) => {
  return (
    <Image
      source={image} // Replace with the path to your logo image
      style={
        id === 3
          ? {width: 200, height: 100}
          : id === 2
          ? {width: 200, height: 100}
          : {width: 300, height: 420}
      } // Adjust the width and height as per your logo dimensions
      resizeMode="contain" // You can use 'contain', 'cover', 'stretch', etc. to adjust the image size
    />
  );
};

export default Logo;
