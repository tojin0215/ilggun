import React, { useEffect, useState} from 'react';
import { AsyncStorage } from 'react-native';
import { View, Text, Button, StyleSheet, TouchableOpacity,ImageBackground } from 'react-native';
// ======================바뀐부분A==================================================================
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import axios from 'axios';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  image:{
    
    justifyContent: "flex-start",
    alignItems:"center",
    width: "100%", height: "100%",
  },
  text: {
    fontSize: wp('15%'),
    textAlign: 'center',
    color: 'white',
    fontFamily:"NanumSquare",
  },
  textStyle:{
    fontFamily:"NanumSquare",
    fontSize: wp('6%'),
    color: '#040525',
    marginTop:hp('10%')
  },
  buttonArea: {
    marginTop:hp('7%'),
    width: '100%',
    height: hp('6%'),
    alignItems: 'center',
  },
  button: {
    backgroundColor: "#7085DF",
    width: "75%",
    height: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius:wp('5%'),
    marginTop:hp('2.5%')
  },
  buttonTitle: {
      color: '#040525',
      fontSize:wp('5%'),
      fontFamily:"NanumSquare",
  },
  addbutton: {
    backgroundColor: '#7085DF',
    position:"absolute",
    alignItems:"center",
    bottom: hp('2%'),
    width: "100%",
    width: wp('15%'),
    height: wp('15%'),
    marginBottom: hp('5%'),
    borderRadius: wp('15%'),
    /*
    ...Platform.select({
        ios: {
            shadowColor: 'rgba(0,0,0,0.2)',
            shadowOpacity: 1,
            shadowOffset: {height: 2, width: 2},
            shadowRadius: 2,
        },

        android: {
            elevation: 0,
            marginHorizontal: 30,
        },
    })*/
  },
}); 

const WorkerBusinessListScreen = ({navigation}) => {
  const [business, setBusiness] = useState([]);
  const [clicked, setClicked] = useState(-1);
  React.useEffect(() => {
    console.log("안녕");
          fetchData();
  },[]);

      //return unsubscribe;
    //});

  //const [idid, setId] = useState('');

  /*const [password, setPassword] = useState('');
  const storeToken = async(user) => {
    try {
       await AsyncStorage.setItem("userData", JSON.stringify(user));
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
  const getToken = async() => {
    try {
      let userData = await AsyncStorage.getItem("userData");
      let data = JSON.parse(userData);
      console.log("나와라라ㅏㅏㅏㅏ"+data);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }*/
    ///setId('dd');
    async function fetchData() { 
        try {
          axios.post('https://www.kwonsoryeong.tk:3000/selectBusinessByWorker', {},
          {  headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'}
          })
            /*let res = await fetch('https://www.kwonsoryeong.tk:3000/selectBusinessByWorker', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                //id : idid
              }),
            })
            .then(res => res.json())*/
            .then(res => {
              if(res.data[0]){
                console.log(JSON.parse(res.data[0].bang));
                setBusiness(JSON.parse(res.data[0].bang));
              }
            });
            
            /*.then((response) => response.json())
            .then((res) => {
                //setBusiness(res);
            })*/
        } catch (e) {
            console.error(e);
          }
    }
    

    //React.useEffect(() => {
    /*  AsyncStorage.getItem("userData")
      .then((userData) => {
        console.log(JSON.parse(userData))
        fetchData(JSON.parse(userData))
      })*/
      
      /*const unsubscribe =*/
      
      /*navigation.addListener('focus', () => {
          fetchData();
      });*/

      //return unsubscribe;
    //});
    
    return (
        <View>
        <ImageBackground style={styles.image} source={require('../../img/page2_1.png')}>

        {
          <View style={styles.buttonArea}>{
            business?
            Object.entries(business).map(([key, value]) => (
              <>
                <TouchableOpacity 
                  key = {key}
                  style={{
                    backgroundColor: clicked==key?"#7085DF":"#D3DDFF",
                    width: "75%",
                    height: "100%",
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius:wp('5%'),
                    marginTop:hp('2.5%')}}
                  onPress={() => {
                    setClicked(key)
                    AsyncStorage.setItem("bangCode", key)
                    .then(() =>{
                      setClicked(-1)
                      navigation.navigate('Worker Home',{bname : key})
                    })
                  }}>
                  <Text style={styles.buttonTitle}>{key}</Text>
                </TouchableOpacity>
              </>)
            )      
          :<Text style={styles.textStyle}>초대받은 사업장이 없습니다.</Text>}
            </View>
        }
        </ImageBackground>
        </View>
    );
};
export default WorkerBusinessListScreen;