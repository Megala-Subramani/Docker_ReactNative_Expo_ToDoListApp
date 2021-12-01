/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React,{useEffect, useState} from 'react';
 import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList 
} from 'react-native';
import AlertAsync from "react-native-alert-async";
import AsyncStorage from "@react-native-async-storage/async-storage";

const App = () => {
  const [text,setText] = useState('');
  const [UNotes,setUnotes] = useState([]);
  const UpdateUserInput=(data)=>{
    console.log("TextInput : ",data);
    setText(data);
  }
  const addNewNotes= async ()=>{
    if(text === ""){
      alert("No Data available!");
      return;
    }
    var notesArr = await AsyncStorage.getItem('notes');
    if (notesArr !== null) {
      // We have data!!
      notesArr = JSON.parse(notesArr);
      console.log(notesArr);
    }else{
      notesArr = [];
    }
    notesArr[notesArr.length] = text;
    await AsyncStorage.setItem('notes',JSON.stringify(notesArr));
    setUnotes([...notesArr]);
    console.log("Array Added===>: ",notesArr);
    setText('');        
  }
 
  useEffect (async () =>{
    var notesArr = await AsyncStorage.getItem('notes');
    if (notesArr !== null) {
      // We have data!!
      notesArr = JSON.parse(notesArr);
      console.log(notesArr);
    }else{
      notesArr = [];
    }
    setUnotes([...notesArr]);
    console.log("MEGALA===>notesArr : ",notesArr)
  },[])

  const onDeleteItem= async (item)=>{
    console.log("data::: ",item)
    const choice = await AlertAsync(
      'Confirm',
      'Are you sure you want to delete?',
      [
        {text: 'Yes', onPress: () => 'yes'},
        {text: 'No', onPress: () => Promise.resolve('no')},
      ],
      {
        cancelable: true,
        onDismiss: () => 'no',
      },
    );
    if (choice === 'yes') {
      var notesArr = await AsyncStorage.getItem('notes');
      if (notesArr !== null) {
        // We have data!!
        notesArr = JSON.parse(notesArr);
        console.log(notesArr);
      }else{
        notesArr = [];
      }
      const index = notesArr.indexOf(item)
      console.log("index==>",index, "item: ",item)
      if (index > -1) {
        notesArr.splice(index, 1);
      }
      console.log("After delete: ",notesArr)
      await AsyncStorage.setItem('notes',JSON.stringify(notesArr));
      setUnotes([...notesArr]);
    }
  }
  const CreateUserNotes=({item,index})=>{
    return(
      <View style={{flexDirection:'row',height:40}} >
        <TouchableOpacity style={{width:98+'%',borderBottomWidth:3,borderBottomColor:'#b7551d'}} onPress={()=>onDeleteItem(item)} >
         <Text numberOfLines={1} style={{flex:1,marginLeft:5,width:98+'%',lineHeight:30 }} >{item}</Text>
       </TouchableOpacity>
      </View>
    )
  }
  
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      {console.log("Yes Coming into renderer",UNotes)}
      
        <View style={styles.HeaderView}>
          <Text style={styles.HeaderText}>Notes</Text>
        </View>
        <View style={{height:35}}> 
          <View style={{flexDirection:'row'}} >
            <TextInput  selectionColor={'black'} style={styles.UserInputText} value={text} onChangeText={(text)=>UpdateUserInput(text)} />
            <TouchableOpacity style={styles.UserAddBtn} onPress={()=>addNewNotes()} >
              <Text style={styles.UserAddText}>+</Text>
            </TouchableOpacity>
          </View>
        </View> 
        <ScrollView contentInsetAdjustmentBehavior="automatic" >
          <FlatList  data={UNotes} renderItem={CreateUserNotes} keyExtractor={(item, index) => index} />
        </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backgroundStyle : {
    flex:1,
    backgroundColor: '#ff954a',
  },
  HeaderView:{
    height:70,
    backgroundColor:'#a55823'
  },
  HeaderText:{
    lineHeight:90,
    fontSize:27,
    marginLeft:5
  },
  UserInputText:{
    backgroundColor:'#ff954a',
    borderWidth:1,
    borderColor:'black',
    marginTop:2,
    width:85+'%',
    marginLeft:2,
    paddingLeft:5
  },
  UserAddBtn:{
    width:13+'%',
    borderWidth:1,
    backgroundColor:'gray',
    marginLeft:3,
    marginTop:2
  },
  UserAddText:{
    fontSize:30,
    lineHeight:32,
    textAlign:'center'
  }

});

export default App;
