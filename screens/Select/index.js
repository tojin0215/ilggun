import React, {useState} from 'react';
import { AsyncStorage } from 'react-native';
import {
  View,ImageBackground,
  Text, Button,
  TextInput, Image,
  TouchableOpacity,Alert,
  StyleSheet, TouchableHighlight
} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
 
const SelectScreen = ({ onSignIn, navigation }) => {

  const [dataLoaded, setDataLoaded] = useState(false);
  const [id, setId] = useState('');
    const fetchFonts = () => {
      return Font.loadAsync({

      }).then(res =>{ setDataLoaded(true); });
    };

    React.useEffect(() => {
      AsyncStorage.getItem("userData").then((userData) =>{
        setId(JSON.parse(userData));
      });
        if(!dataLoaded){
            fetchFonts();
        }
        
    }, [dataLoaded, setDataLoaded, fetchFonts, id, setId]);


  const ownerImg = require('../../img/onwer.png')
  const ownerImgChecked = require('../../img/onwer_click.png')
  const ownerI = {ownerImg, ownerImgChecked}
  const [ownerImgSelected, setOwnerImgSelected] = useState(ownerI.ownerImg)

  const empImg = require('../../img/emp.png')
  const empImgChecked = require('../../img/emp_click.png')
  const empI = {empImg, empImgChecked}
  const [empImgSelected, setempImgSelected] = useState(empI.empImg)

  const ownerchangeImg =()=>{
    setOwnerImgSelected(ownerI.ownerImgChecked)
    setempImgSelected(empI.empImg)
    navigation.navigate('Business List');
    console.log("ddddddddddddddddd")
  }

  const empchangeImg =()=>{
    setempImgSelected(empI.empImgChecked)
    setOwnerImgSelected(ownerI.ownerImg)
    console.log("eeeeeeeeeeeeeeeeee")
  }

  return ( 
    <View>
    <ImageBackground style={styles.image} source={require('../../img/page1_1.png')}>
      
      <View style={styles.textArea}>
      <Text style={styles.text1}>"{id}"</Text>
        <Text  style={styles.text2}>님 안녕하세요.</Text>
      </View>
      <View style={styles.buttonArea}>
        <TouchableHighlight
                style={styles.button}
                onPress={ownerchangeImg}
            >
            <Image style={styles.buttonTitle1} source={ownerImgSelected}></Image>
        </TouchableHighlight>
        {/*<TouchableOpacity 
          style={styles.button}
          //navigation.navigate('Business List')
          onPress={() => {ownerchangeImg();}}>
          <Image style={styles.buttonTitle1} source={ownerImgSelected}/>
      </TouchableOpacity>
        */}
      <TouchableOpacity 
        style={styles.button}
        //navigation.navigate('Worker Business List')
        onPress={() => {empchangeImg();navigation.navigate('Worker Business List');}}>
        <Image style={styles.buttonTitle1} source={empImgSelected}></Image>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonlogoArea}>
         <Image style={styles.logobottom} source={require('../../img/logo_bottom.png') }/> 
      </View>
    </ImageBackground>
  </View>
  );
};
 

const styles = StyleSheet.create({
  image:{
    justifyContent: "flex-start",
    alignItems:"center",
    width: "100%", height: "100%",
  },
  container: {
    width: "100%", height: "100%",
    backgroundColor: 'white',
    paddingLeft: wp('10%'),
    paddingRight: wp('10%'),
    paddingBottom: wp('10%'),
    justifyContent: 'center',
},
  textArea:{
    justifyContent:"center", 
    width:"100%",
    flexDirection:"row",
    marginTop:hp('10%')
  }, 
  text1:{
    fontSize:wp('7%'), 
    fontFamily:"NanumSquareB", 
  },
  text2:{
    fontSize:wp('7%'), 
    fontFamily:"NanumSquare",
  },
  buttonArea: {
      marginTop:hp('8%'),
      marginBottom:hp('20%'),
      width: '90%',
      flexDirection:"row",
      alignItems:"center",
      justifyContent:"center"
  },
  button: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight:wp('3%'),
      marginLeft:wp('3%'),
      //borderRadius:10
  },
  buttonTitle1: {
      width:wp('35%'), height:wp('35%')
  },  
  buttonlogoArea: {
    position:"absolute",
    alignItems:"center",
    bottom: hp('2%'),
    width: "100%",
    height: hp('5%'),
},
logobottom:{
  width:wp('22%'), height:wp('3%'),
  justifyContent:"center",
  alignItems:"center",
  fontFamily:"NanumSquare",
},
})

export default SelectScreen;