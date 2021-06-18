import React, {Component} from 'react';
import { View, Text, StyleSheet, ScrollView, Button, TextInput, Alert } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import Icon from 'react-native-vector-icons/Feather';
import { AsyncStorage } from 'react-native';
import * as Font from 'expo-font';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { abs } from 'react-native-reanimated';
import { TouchableOpacity } from 'react-native-gesture-handler';
import axios from 'axios';


const styles = StyleSheet.create({
  container: {
    width:'100%', height:'100%',
    backgroundColor:'white', padding:wp('5%')
  },
  textArea:{
    marginTop:hp('3%'),
    marginBottom:hp('2%')
  },
  dateTextStyle:{
    marginTop:hp('2%'),
    marginBottom:hp('2%'),
    marginLeft:wp('0.5%'),
    marginRight:wp('1%'),
    fontSize:wp('4.5%'),
    fontFamily:"NanumSquareB",
    color: '#040525',
  },  
  textStyle:{
    fontSize:wp('4.5%'),
    fontFamily:"NanumSquareB",
    color: '#040525',
    marginTop:wp('1%'),
    marginBottom:wp('1.5%'),
    marginLeft:wp('2%'),
  },  
  textInputStyle:{
    fontSize:wp('4.5%'),
    fontFamily:"NanumSquare",
    color: '#040525',
    paddingBottom:hp('1%'), paddingLeft:wp('2%'),
    borderBottomWidth:hp('0.5%'),
    borderBottomColor:'#7085DF'
  },
  pickerArea:{
    flexDirection: 'row',
    marginTop:hp('1%'),
    width:wp('90%'), height:hp('25%'),
    justifyContent:"center",alignItems:"flex-start",
    marginRight:wp('2%'),
  },
  textForm:{
    height:hp('18%')
  },
  textinputArea:{
    width:wp('80%'), height:hp('7%'),
    marginLeft:wp('2%'),
  },
  buttonArea:{
    justifyContent:"flex-end", alignItems:"center",
    height:hp('10%'), 
  },
  button:{
    backgroundColor:'#7085DF',
    width:wp('90%'), height:hp('5.5%'),
    justifyContent:"center", alignItems:"center",marginBottom:hp('1%'),
    borderRadius:wp('6%')
  },
  buttonTitle:{
    fontSize:wp('4.5%'),
    fontFamily:"NanumSquare",
    color: 'white',
  }
});


class VacationRequestScreen extends Component{

  updateState(){}

  constructor(props) {
    super(props);
    console.log("매개변수 : ");
    this.state = {
        bangCode:'',
      itemA: '2021', //'2020년',
      isVisibleA: false,
   
      itemB: '1',//'10월',
      isVisibleB: false,

      itemAA: '1', //'2020년',
      isVisibleAA: false,

      bangCode : null,
      originalTime : null,
      workernames: [],
      comment: '',

      owner:'',
      clicked: false
    }

    AsyncStorage.getItem("bangCode")
      .then((bangCode) => {
        this.setState({bangCode: bangCode})
        
      })
  }
/* =====================================================바뀐부분J====================================== */
  fetchData1 = async() => { 
    try {
      let today = new Date();
      console.log(today.getFullYear()+"/"+this.state.itemA*1 +"//"+(today.getMonth()+1)+"/"+this.state.itemB*1 +"//"+ today.getDate()+"/"+this.state.itemAA*1)
      if(today.getFullYear()<this.state.itemA*1 
        || (today.getFullYear()==this.state.itemA*1 && today.getMonth()+1<this.state.itemB*1)
        || (today.getFullYear()==this.state.itemA*1 && today.getMonth()+1==this.state.itemB*1 && today.getDate()<this.state.itemAA*1)
        ){
        if(this.state.comment){
          await axios.post('http://13.124.141.28:3000/selectBusinessByName', {
            bname : this.state.bangCode
          },
          {  headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'}
          })
          .then(res => {
            this.setState({owner : res.data[0].id});
          });
          await axios.post('http://13.124.141.28:3000/sendMessage', {
              type: 2,
              system:1,
              f: this.props.route.params.id,
              t : this.state.owner,
              message : '('+this.state.bangCode + ')님이 '+ this.state.itemA+"-"+(this.state.itemB.length==1?'0'+this.state.itemB:this.state.itemB)+"-"+(this.state.itemAA.length==1?'0'+this.state.itemAA:this.state.itemAA)+'에 유급 휴가를 요청합니다.\n"'+ this.state.comment+'"\n승인하시겠습니까?"',
              time : this.state.itemA+"-"+this.state.itemB+"-"+this.state.itemAA,
              r:0
          },
          {  headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'}
          })
          .then(res => {
            console.log("뭘까요?2")
            console.log(res.data);
            let rowall = []
            for (let i = 0; i < res.data.length; i++) {
              rowall.push({label: res.data[i].workername, value: res.data[i]});
            }
            this.setState({workernames: rowall})
            Alert.alert("유급 휴가 신청이 완료되었습니다.")
            this.props.navigation.navigate('Worker Home');
          });
        }
        else{
          Alert.alert("휴가신청 사유를 입력해주세요.")
          this.props.navigation.navigate('Worker Home');
        }
      }
    else{        
      Alert.alert("날짜가 제대로 입력되었는지 확인해주세요.")
      this.props.navigation.navigate('Worker Home');
    }
    } catch (e) {
      Alert.alert("유급 휴가 신청이 완료되었습니다.")    
      console.error(e);      
      }
  }

  fetchData2 = async() => { 
    try {
      let today = new Date();
      console.log(today.getFullYear()+"/"+this.state.itemA*1 +"//"+(today.getMonth()+1)+"/"+this.state.itemB*1 +"//"+ today.getDate()+"/"+this.state.itemAA*1)
      if(today.getFullYear()<this.state.itemA*1 
        || (today.getFullYear()==this.state.itemA*1 && today.getMonth()+1<this.state.itemB*1)
        || (today.getFullYear()==this.state.itemA*1 && today.getMonth()+1==this.state.itemB*1 && today.getDate()<this.state.itemAA*1)
        ){
        if(this.state.comment){
          await axios.post('http://13.124.141.28:3000/selectBusinessByName', {
            bname : this.state.bangCode
          },
          {  headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'}
          })
          .then(res => {
            this.setState({owner : res.data[0].id});
          });
          await axios.post('http://13.124.141.28:3000/sendMessage', {
              type: 2,
              system:1,
              f: this.props.route.params.id,
              t : this.state.owner,
              message : '('+this.state.bangCode + ')님이 '+ this.state.itemA+"-"+(this.state.itemB.length==1?'0'+this.state.itemB:this.state.itemB)+"-"+(this.state.itemAA.length==1?'0'+this.state.itemAA:this.state.itemAA)+'에 무급 휴가를 요청합니다.\n"'+ this.state.comment+'"\n승인하시겠습니까?"',
              time : this.state.itemA+"-"+this.state.itemB+"-"+this.state.itemAA,
              r:0
          },
          {  headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'}
          })
          .then(res => {
            console.log("뭘까요?2")
            console.log(res.data);
            let rowall = []
            for (let i = 0; i < res.data.length; i++) {
              rowall.push({label: res.data[i].workername, value: res.data[i]});
            }
            this.setState({workernames: rowall})
            Alert.alert("무급 휴가 신청이 완료되었습니다.")
            this.props.navigation.navigate('Worker Home');
          });
        }
        else{
          Alert.alert("휴가신청 사유를 입력해주세요.")
          this.props.navigation.navigate('Worker Home');
        }
      }
    else{  
      Alert.alert("날짜가 제대로 입력되었는지 확인해주세요.")
      this.props.navigation.navigate('Worker Home');
    }
    } catch (e) {
      Alert.alert("무급 휴가 신청이 완료되었습니다.")
        console.error(e);
      }
  }

  fetchData3 = async() => {
    Alert.alert('휴가 신청 취소', '이전 페이지로 이동합니다.')
    this.props.navigation.navigate('Worker Home')}
 
/* =====================================================바뀐부분====================================== */
  changeVisibility(state) {
    this.setState({
        isVisibleA: false,
        isVisibleB: false,
        isVisibleAA: false,
        ...state
    });
  }
  
  render() {
    const state = this.state;
    const {workernames} = this.state
    
    return (
      <View style={styles.container}>
{/* =====================================================바뀐부분A====================================== */}
<ScrollView>
        <View style={styles.textForm}>
          <View style={styles.textArea}>
          <Text style={styles.textStyle}>휴가 신청 이유</Text>
        </View>
        <View style={styles.textinputArea}>
        <TextInput 
                onChangeText={item => {
                    console.log(item);
                    this.setState({
                        comment: item
                    })
                    console.log(this.state.comment)
                    console.log('///')
                }
                }
                defaultValue={this.state.comment}
                style={styles.textInputStyle} 
                //underlineColorAndroid='#7085DF'
                placeholder={"휴가 신청 사유를 입력하세요."}/>         
        </View>
        </View>

        <View style={styles.textArea}>
          <Text style={styles.textStyle}>날짜를 선택해주세요.</Text>
        </View>
{/* =====================================================바뀐부분A====================================== */}
          <View style={styles.pickerArea}>
          <DropDownPicker
                items={[
                    {label: '2021', value: '2021'},
                    {label: '2022', value: '2022'},
                ]}
                defaultValue={this.state.itemA}
                containerStyle={{height:hp('7%'), width:wp('22%'),}}
                style={{
                  borderTopWidth:hp('0.3%'), borderBottomWidth:hp('0.3%'),
                  borderTopLeftRadius:0, borderTopRightRadius:0, borderBottomLeftRadius:0, borderBottomRightRadius:0,
                  borderTopColor:'#7085DF', borderBottomColor:'#7085DF',
                  borderRightWidth:0, borderLeftWidth:0,
                }}
                placeholder="2020"

                dropDownStyle={{backgroundColor: 'white',}}
                itemStyle={{justifyContent: 'center'}}
                labelStyle={{
                  height:hp('3%'),
                  textAlign: 'center',
                  color:'#040525',
                  fontFamily:"NanumSquare",
                  marginTop:hp('1%'),
                  fontSize: wp('4.8%'),
                }}
                isVisible={this.state.isVisibleA}
                onOpen={() => this.changeVisibility({
                    isVisibleA: true
                })}
                onClose={() => this.setState({
                    isVisibleA: false
                })}
                onChangeItem={item => {
                  this.setState({
                    itemA: item.value
                })
                console.log(item.label, item.value);
              }}
              
            />
            <Text style={styles.dateTextStyle}>년</Text>
            <DropDownPicker
                items={[
                    {label: '1', value: '1'},
                    {label: '2', value: '2'},
                    {label: '3', value: '3'},
                    {label: '4', value: '4'},
                    {label: '5', value: '5'},
                    {label: '6', value: '6'},
                    {label: '7', value: '7'},
                    {label: '8', value: '8'},
                    {label: '9', value: '9'},
                    {label: '10', value: '10'},
                    {label: '11', value: '11'},
                    {label: '12', value: '12'},
                ]}
                defaultValue={this.state.itemB}
                containerStyle={{height:hp('7%'), width:wp('17%'), marginLeft:wp('3%')}}
                style={{
                  borderTopWidth:hp('0.3%'), borderBottomWidth:hp('0.3%'),
                  borderRightWidth:0, borderLeftWidth:0,
                  borderTopLeftRadius:0, borderTopRightRadius:0, borderBottomLeftRadius:0, borderBottomRightRadius:0,
                  borderTopColor:'#7085DF', borderBottomColor:'#7085DF',
                }}
                placeholder="12"

                dropDownStyle={{backgroundColor: 'white',}}
                itemStyle={{justifyContent: 'center'}}
                labelStyle={{
                  height:hp('3%'),
                  textAlign: 'center',
                  color:'#040525',
                  fontFamily:"NanumSquare",
                  marginTop:hp('1%'),
                  fontSize: wp('4.8%'),
                }}
                isVisible={this.state.isVisibleB}
                onOpen={() => this.changeVisibility({
                    isVisibleB: true
                })}
                onClose={() => this.setState({
                    isVisibleB: false
                })}
                onChangeItem={item => this.setState({
                    itemB: item.value
                })}
            />
            <Text style={styles.dateTextStyle}>월</Text>
            <DropDownPicker
                items={[
                    {label: '1', value: '1'},
                    {label: '2', value: '2'},
                    {label: '3', value: '3'},
                    {label: '4', value: '4'},
                    {label: '5', value: '5'},
                    {label: '6', value: '6'},
                    {label: '7', value: '7'},
                    {label: '8', value: '8'},
                    {label: '9', value: '9'},
                    {label: '10', value: '10'},
                    {label: '11', value: '11'},
                    {label: '12', value: '12'},
                    {label: '13', value: '13'},
                    {label: '14', value: '14'},
                    {label: '15', value: '15'},
                    {label: '16', value: '16'},
                    {label: '17', value: '17'},
                    {label: '18', value: '18'},
                    {label: '19', value: '19'},
                    {label: '20', value: '20'},
                    {label: '21', value: '21'},
                    {label: '22', value: '22'},
                    {label: '23', value: '23'},
                    {label: '24', value: '24'},
                    {label: '25', value: '25'},
                    {label: '26', value: '26'},
                    {label: '27', value: '27'},
                    {label: '28', value: '28'},
                    {label: '29', value: '29'},
                    {label: '30', value: '30'},
                    {label: '31', value: '31'},
                ]}
                defaultValue={this.state.itemAA}
                containerStyle={{height:hp('7%'), width:wp('17%'), marginLeft:wp('3%') }}
                style={{
                  borderTopWidth:hp('0.3%'), borderBottomWidth:hp('0.3%'),
                  borderRightWidth:0, borderLeftWidth:0,
                  borderTopLeftRadius:0, borderTopRightRadius:0, borderBottomLeftRadius:0, borderBottomRightRadius:0,
                  borderTopColor:'#7085DF', borderBottomColor:'#7085DF', 
                }}
                placeholder="25"

                dropDownStyle={{backgroundColor: 'white',}}
                itemStyle={{justifyContent: 'center'}}
                labelStyle={{
                  height:hp('3%'),
                  textAlign: 'center',
                  color:'#040525',
                  fontFamily:"NanumSquare",
                  marginTop:hp('1%'),
                  fontSize: wp('4.8%'),
                }}
                isVisible={this.state.isVisibleAA}
                onOpen={() => this.changeVisibility({
                    isVisibleAA: true
                })}
                onClose={() => this.setState({
                    isVisibleAA: false
                })}
                onChangeItem={item => {
                  this.setState({
                    itemAA: item.value
                })
                console.log(item.label, item.value);
              }}
              
            />
           <Text style={styles.dateTextStyle}>일</Text>
          </View>
{/* =====================================================바뀐부분J====================================== */}
          <View style={styles.buttonArea}>  
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if(!this.state.clicked){
                  this.setState({clicked : true}, () => this.fetchData1())
                }                
              }}>
              <Text style={styles.buttonTitle}>유급 휴가 신청</Text> 
            </TouchableOpacity>
          </View>

          <View style={styles.buttonArea}>          
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if(!this.state.clicked){
                  this.setState({clicked : true}, () => this.fetchData2())
                }                
              }}>
               
                <Text style={styles.buttonTitle}>무급 휴가 신청</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonArea}>          
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                if(!this.state.clicked){
                  this.setState({clicked : true}, () => this.fetchData3())
                }                
              }}>              
                <Text style={styles.buttonTitle}>취소</Text>

            </TouchableOpacity>
          </View>
          </ScrollView>
{/* =====================================================바뀐부분====================================== */}
      </View>
        
    )
  }
}

export default VacationRequestScreen;