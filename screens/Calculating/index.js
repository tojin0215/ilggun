import React from 'react';
import { View, Text, StyleSheet, Button,TouchableOpacity, ImageBackground,Image } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonArea: {
    marginTop:hp('5%'),
    width: '100%',
    height: hp('13%'),
    alignItems: 'center',
  },
  button: {
    width: "75%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:wp('5%'),
    marginTop:hp('2.5%')
  },
  buttonTitle: {
      color: '#040525',
      fontSize:wp('5.9%'),
      fontFamily:"NanumSquare",
  },
  image:{
    alignItems: 'center',
    justifyContent:'flex-start',
    width: "100%", height: "100%", 
  },
  buttonImg:{
    width: wp('75%'),
    height: hp('13%'),
    justifyContent: 'center',
    alignItems: 'center',

  }
});
 

const CalculatingScreen = ({navigation}) => {
  return (
       <ImageBackground style={styles.image} source={require('../../img/workMpage.png')}>
            
    <View style={styles.buttonArea}>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Calculating1')}>
        <Image style={styles.buttonImg} source={require('../../img/calculate1.png')}/>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Calculating2')}>
        <Image style={styles.buttonImg} source={require('../../img/calculate2.png')}/>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.button}
        onPress={() => navigation.navigate('Calculating3')}>
        <Image style={styles.buttonImg} source={require('../../img/calculate3.png')}/>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};
export default CalculatingScreen;