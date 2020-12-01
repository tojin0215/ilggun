import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Alert, Animated, ImageBackground} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Table, TableWrapper, Row, Rows, Col} from 'react-native-table-component';
import DropDownPicker from 'react-native-dropdown-picker';
import StatementScreen from '../Statemanet';
import { AsyncStorage } from 'react-native';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { TouchableOpacity } from 'react-native-gesture-handler';

import XLSX from 'xlsx';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

//data 순서 : 입사일/월급(보수총액)->DB/추가금액->DB/공제액->계산/실지금액->계산

//정규공제) SocialInsurance:사대보험 (국민연금+건강보험+고용보험) / IncomeTax:갑근세 / InhabitantsTax:주민세
//알바공제) WithholdingTax:3.3세금공제


// 정규직은 이름/근무형태/보수총액(기본월급)/추가금 //// 알바는 이름/근무형태/시급/근무시간/추가금
/*const arrName= [['2020.09','김지은','알바','8590','70','10000'],['2020.09','서효선','알바','8590','50','20000']
                ,['2020.09','권소령','정규직','3000000','10000'],['2020.09','전세웅','정규직','1000000','0'], 
                ['2020.09','김수정','알바','8590','20','50000'],['2020.09','정민지','정규직','2000000','30000'],
                ['2020.10','김지은','알바','8590','50','5000'],['2020.10','서효선','알바','8590','100','20000']
                ,['2020.10','권소령','정규직','2000000','30000'],['2020.10','전세웅','정규직','2000000','10000'], 
                ['2020.10','김수정','알바','8590','30','10000'],['2020.10','정민지','정규직','3000000','0']]
*/

class StatementScreen1 extends React.Component {
// 급여대장
    constructor(props) {
      super(props);
      this.state = {
          itemA: '2020년', isVisibleA: false, itemB: '10월', isVisibleB: false,
          tableHead: ['이름', '분류', '보수총액\n(신고금액)','추가금','공제','실지금액'],
          tableTitle: [],
          tableData: [],
          arrName: [],
          week: [],
          addtime: {},
          bangcode: '',
      }
      AsyncStorage.getItem("bangCode")
      .then((bangCode) => {
        this.setState({bangcode:bangCode});
        this.fetchData(bangCode)
      })
      

    }

    fetchData = async(bangCode) => { 
      try {
        
        console.log(bangCode);
          await fetch('http://192.168.43.253:3000/selectOvertimework', {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  year : this.state.itemA.split('년')[0]*1,
                  month : this.state.itemB.split('월')[0]*1,
                }),
              }).then(res => res.json())
              .then(res => {
                console.log("???");
                  console.log(res);
                let dic ={};
                for(let i=0 ; i<res.length ; i++){
                  if(!dic[res[i].workername]){
                    dic[res[i].workername] = res[i].subt;   
                  }
                  else{
                    dic[res[i].workername] += res[i].subt;   //this.setState({addtime :{...this.state.addtime, n : s}});
                  }
                }
                console.log("???");
                  console.log(dic);
                this.setState({addtime : dic})
                

              });
          let res = await fetch('http://192.168.43.253:3000/selectWorker', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              business : bangCode
            }),
          }).then(res => res.json())
          .then(res => {
            let week=[4,4,4,4,4,4,4];
      
            // console.log(this.state.itemA.split('년')[0]+' '+ this.state.itemB.split('월')[0])
              let nalsu = new Date(this.state.itemA.split('년')[0], this.state.itemB.split('월')[0], 0).getDate();
              let namugi = nalsu%7;
              let it = new Date(this.state.itemA.split('년')[0], this.state.itemB.split('월')[0], 0).getDay();
              console.log(nalsu, namugi, it, this.state.itemA.split('년')[0], this.state.itemB.split('월')[0]);
              for(let i=0 ; i<namugi ; i++){
                week[(it-i)%7]++;
              }

            let rowall = []
            for (let i = 0; i < res.length; i++) {
              if(res[i].type==1){
                let sum = 0;
                let eachtime = res[i].eachtime.split('/');
                for(let i=0 ; i<7 ; i++){
                  console.log((eachtime[i]*1) , week[i]);
                  sum += (eachtime[i]*1) * week[i];
                }
                console.log(">>>");
                console.log(res);
                console.log(">>>");
                rowall.push([this.state.itemA.split('년')[0]+'.'+this.state.itemB.split('월')[0], res[i].workername, "알바", String(res[i].pay/*시급*/), String(sum/* 시간 */) , String((this.state.addtime[res[i].workername]?this.state.addtime[res[i].workername]:0)*8560/*시급*/)]);
              }
              else{
                rowall.push([this.state.itemA.split('년')[0]+'.'+this.state.itemB.split('월')[0], res[i].workername, "정규직", String(res[i].pay), String(this.state.addtime[res[i].workername]?this.state.addtime[res[i].workername]:0)]);
              }
            }
            this.setState({arrName: rowall})
            console.log(this.state.arrName);
            
          });
      } catch (e) {
          console.error(e);
        }
        this.show();
    }
    clickHandler = async() => {
      console.log(this.state.tableTitle);
      console.log(this.state.arrName)
      let t = this.state.tableData;
      var data = [
        {
          "년월":this.state.arrName[0][0]
        }
      ];
      for(let i=0 ; i<t.length ; i++)
      {
        data.push({
          "이름" : this.state.tableTitle[i],
          "분류" : t[i][0],
          "보수총액(신고금액)" : t[i][1] ,
          "추가금" : t[i][2],
          "공제" : t[i][3],
          "실지금액" : t[i][4],
        })
      }
      var ws = XLSX.utils.json_to_sheet(data);
      var wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Cities");
      const wbout = XLSX.write(wb, {
        type: 'base64',
        bookType: "xlsx"
      });
      const uri = FileSystem.cacheDirectory + 'statement.xlsx';
      console.log(`Writing to ${JSON.stringify(uri)} with text: ${wbout}`);
      await FileSystem.writeAsStringAsync(uri, wbout, {
        encoding: FileSystem.EncodingType.Base64
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        dialogTitle: 'MyWater data',
        UTI: 'com.microsoft.excel.xlsx'
      });
    }
    show(){
      //console.log(this.state.itemA);
      //console.log(this.state.itemB);

      let year = this.state.itemA.substring(0,4)
      let month = this.state.itemB.substring(0,2)
      let select = year +'.'+ month
      console.log('////'+select)

      let WorkingType ='정규직'
      let tableTitleArr = [];
      let tableDataArr = [];
      let data =[];

      // 정규) MonthlySalary:보수총액 / AddSalary:추가급여
      let MonthlySalary = '0'
      let AddSalary = '0' 

      // 알바) HourlyWage : 시급 / WorkingHour : 한달 일한 시간 / AddSalaryPartTime:추가급여
      let WorkingHour = '0'
      let HourlyWage = '0'
      let AddSalaryPartTime = '0'
      
      for(let i=0; i<this.state.arrName.length; i++){
          
          //if(select == this.state.arrName[i][0]) {
              WorkingType = this.state.arrName[i][2];
              data=[];
  
              if(WorkingType == '정규직'){
                  tableTitleArr.push(this.state.arrName[i][1])
                  MonthlySalary = this.state.arrName[i][3]
                  AddSalary = this.state.arrName[i][4]
      
                  // NationalPension:국민연금 (보수총액*4.5%)
                  let NationalPension = (parseInt(MonthlySalary)*4.5/100).toFixed(0);
                  // HealthInsurance:건강보험 (보수총액*3.3335%)
                  let HealthInsurance = (parseInt(MonthlySalary)*3.335/100).toFixed(0);
                  // RegularCare:건강보험(정기요양) (건강보험료*5.125%)
                  let RegularCare = (HealthInsurance*10.25/100).toFixed(0);
                  // EmploymentInsurance : 고용보험 (보수총액*0.8%)
                  let EmploymentInsurance = (parseInt(MonthlySalary)*0.8/100).toFixed(0);//근로자_고용보험
                  // SocialInsurance:사대보험 (국민연금+건강보험+고용보험)
                  let SocialInsurance = (parseInt(NationalPension)+parseInt(HealthInsurance)+parseInt(RegularCare)+parseInt(EmploymentInsurance)).toFixed(0);
      
                  // WithholdingTax:원천과세(IncomeTax+InhabitantsTax)
                  // IncomeTax : 갑근세(소득세) : 보수총액*3.0%
                  let IncomeTax = (parseInt(MonthlySalary)*0.03).toFixed(0)
                  // InhabitantsTax : 주민세 (갑근세의 10%)
                  let InhabitantsTax = (parseInt(IncomeTax)*0.1).toFixed(0)
      
                  // TotalDeduction:공제총액(사대보험+갑근세+주민세)
                  let TotalDeduction = parseInt(SocialInsurance) + parseInt(IncomeTax) + parseInt(InhabitantsTax)
      
      
                  // 실지급액(보수총액+추가급여-공제총액)
                  let ActualSalary = parseInt(MonthlySalary) + parseInt(AddSalary) - parseInt(SocialInsurance) 
      
                  data=[WorkingType,MonthlySalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  , AddSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  , TotalDeduction.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  , ActualSalary.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")]
                  tableDataArr.push(data)
              } 
         //}
      }

      for(let i=0; i<this.state.arrName.length; i++){
          //if(select == this.state.arrName[i][0]) {
              WorkingType = this.state.arrName[i][2];
              data=[];
              if(WorkingType == '알바'){
                  tableTitleArr.push(this.state.arrName[i][1])
                  HourlyWage = this.state.arrName[i][3]
                  WorkingHour = this.state.arrName[i][4]
                  AddSalaryPartTime = this.state.arrName[i][5]

                  // MonthlySalaryPartTime : 한달보수총액
                  let MonthlySalaryPartTime = parseInt(WorkingHour) * parseInt(HourlyWage);

                  // WithholdingTax:3.3세금공제(갑근세+주민세)
                  let WithholdingTax = (parseInt(MonthlySalaryPartTime)*3.3/100).toFixed(0); 

                  // 실지급액(보수총액+추가급여-공제총액)
                  let ActualSalaryPartTime = parseInt(MonthlySalaryPartTime) + parseInt(AddSalaryPartTime) - parseInt(WithholdingTax) 

                  data = [WorkingType,MonthlySalaryPartTime.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  , AddSalaryPartTime.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  , WithholdingTax.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  , ActualSalaryPartTime.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")]
                  tableDataArr.push(data)
              } 
          //}
          
      }
      
      let dataValue = this.state.data;

      this.setState({
          tableTitle:tableTitleArr,
          tableData:tableDataArr,
          YearMonth:dataValue,
      })
  }

    changeVisibility(state) {
        this.setState({
            isVisibleA: false,
            isVisibleB: false,
            ...state
        });
    }

    render() {
        const state = this.state;

        return (
          <ImageBackground style={styles.image} source={require('../../img/workMpage.png')}>
          <ScrollView>
            <View style={styles.titleArea}>
            <Text style={styles.textTitle}>월별 급여대장</Text>
            </View>
              <View style={styles.dropDownArea}>
                <DropDownPicker
                    items={[
                        {label: '2016년', value: '2016년'},
                        {label: '2017년', value: '2017년'},
                        {label: '2018년', value: '2018년'},
                        {label: '2019년', value: '2019년'},
                        {label: '2020년', value: '2020년'},
                    ]}
                    defaultValue={this.state.itemA}
                    containerStyle={{height: hp('6%'), width:wp('40%')}}
                    dropDownStyle={{backgroundColor: 'white', borderBottomLeftRadius: wp('1.7%'), borderBottomRightRadius: wp('1.7%')}}
                    itemStyle={{justifyContent: 'center', }}
                    labelStyle={{
                      height:hp('4%'),
                      textAlign: 'center',
                      color:'#040525',
                      fontFamily:"NanumSquare",
                      fontSize: wp('4.8%'),
                      marginTop:hp('1%')
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
                }}
                
                />
            
                <DropDownPicker
                    items={[
                    {label: '1월', value: '01월'},
                    {label: '2월', value: '02월'},
                    {label: '3월', value: '03월'},
                    {label: '4월', value: '04월'},
                    {label: '5월', value: '05월'},
                    {label: '6월', value: '06월'},
                    {label: '7월', value: '07월'},
                    {label: '8월', value: '08월'},
                    {label: '9월', value: '09월'},
                    {label: '10월', value: '10월'},
                    {label: '11월', value: '11월'},
                    {label: '12월', value: '12월'},
                    ]}
                    defaultValue={this.state.itemB}
                    containerStyle={{height: hp('6%'), width:wp('30%')}}
                    dropDownStyle={{backgroundColor: 'white', borderBottomLeftRadius: wp('1.7%'), borderBottomRightRadius: wp('1.7%')}}
                    itemStyle={{justifyContent: 'center'}}
                    labelStyle={{
                      height:hp('4%'),
                      textAlign: 'center',
                      color:'#040525',
                      fontFamily:"NanumSquare",
                      fontSize: wp('4.8%'),
                      marginTop:hp('1%')
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
                <TouchableOpacity
                  style={styles.button}
                  onPress={()=>{
                    this.fetchData(this.state.bangcode)
                    this.show()}
                  }>
                  <Text style={styles.buttonTitle}>조회하기</Text>
                </TouchableOpacity>
                </View>

                <View style={styles.textArea}> 
                    <Text style={styles.textStyle}>{this.state.itemA +' '+ this.state.itemB} 근로자 급여대장 </Text>
                </View>

                <View  style={styles.tableArea}>
                    <Table borderStyle={{borderWidth: 1}}>
                        <Row data={state.tableHead} flexArr={[1, 0.8, 1, 1, 1, 1]} style={styles.head} textStyle={styles.tableTitleText}/>
                        <TableWrapper style={styles.wrapper}>
                        <Col data={state.tableTitle} style={styles.title} heightArr={[hp('6%'),hp('6%')]} textStyle={styles.tableText}/>
                        <Rows data={state.tableData} flexArr={[0.8, 1, 1, 1, 1]} style={styles.row} textStyle={styles.tableText}/>
                        </TableWrapper>
                    </Table>
                </View>

           
                <Button title="엑셀 공유" onPress={()=> this.clickHandler()}/>
             </ScrollView>
          </ImageBackground>
        )
    }
}

export default StatementScreen1;

const styles = StyleSheet.create({
  image:{
    alignItems: 'center', justifyContent:"center",
      width: "100%", height: "103%", 
  },
  
  titleArea:{
    alignItems:"center"
  },
  textTitle:{
      fontSize:wp('5.5%'),
      color: '#040525',
      fontFamily:"NanumSquareB",
      marginBottom:hp('1%'),
      marginTop:hp('4%')
  },
  dropDownArea:{
    flexDirection:'row',
    marginTop:hp('3%'),
    marginBottom:hp('2%'),
    width:wp('90%'), height:hp('6%'),
    alignItems:"center", justifyContent:"center"
  },
  button: {
    backgroundColor: "#67C8BA",
    width:wp('20%'), height: hp('6%'),
    justifyContent: 'center', alignItems:"center",
    borderRadius:wp('1.7%'),
  },
  buttonTitle: {
    color: '#040525',
    fontFamily:"NanumSquareB",
    fontSize: wp('4.8%'),
  },
  tableArea:{
    marginTop:hp('1%'),
    marginBottom:hp('2%'),
    width:wp('90%'),
  },
  textArea:{
    marginTop:hp('2%'),
    marginLeft:wp('1.5%')
  },
  textStyle:{
    fontSize:wp('4.5%'),
    fontFamily:"NanumSquare",
    color: '#040525',
    marginTop:wp('1%'),
    marginBottom:wp('1.5%'),
    marginRight:wp('2%'),
  },  
  wrapper: { flexDirection: 'row' },
  head: {  height: hp('6%'),  backgroundColor: 'white'  },
  title: { flex: 1, backgroundColor: 'white' },
  row: {  height: hp('6%') },
  tableText: { 
      textAlign: 'center', 
      fontFamily:"NanumSquare", 
      color: '#040525',
      fontSize: wp('3.35%') },
  tableTitleText: { 
      textAlign: 'center', 
      color: '#040525',
      fontFamily:"NanumSquare", 
      fontSize: wp('3.6%') },
  
});