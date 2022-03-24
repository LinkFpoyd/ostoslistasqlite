import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import * as SQLite from'expo-sqlite';


export default function App() {

  const [title, setTitle] = useState('');
  const [data, setData] = useState([]);

  const db = SQLite.openDatabase('coursedb.db');

  useEffect(() => { 
     db.transaction(tx => {
           tx.executeSql('create table if not exists shopping (id integer primary key not null, title text);');  
          }, null, updateList);}, []);

  const listAdd = () => {
      db.transaction(tx => {
            tx.executeSql('insert into shopping (title) values (?);',
              [title]);
                }, null, updateList)
      setTitle('')        
      }

  const clearList = () => {
    db.transaction(tx => {
      tx.executeSql('drop table shopping;');  
     }, null, null)
    db.transaction(tx => {
      tx.executeSql('create table if not exists shopping (id integer primary key not null, title text);');  
     }, null, updateList)
  }

  const deleteItem = (id) => {
      db.transaction(tx => {tx.executeSql('delete from shopping where id = ?;'
      , [id]);}, null, updateList) 
      console.log("xd")
    }

  const updateList = () => {
      db.transaction(tx => {
            tx.executeSql('select * from shopping;', [], (_, { rows }) =>
                  setData(rows._array)    );   }, null, null);}

  return (
    <View style={styles.container}>
        <Text>OSTOSLISTASOVELLUS</Text>
        <TextInput style={styles.input} onChangeText={input => setTitle(input)} value={title}></TextInput>
      <View style={styles.buttons}>
        <View style={styles.button}>
          <Button onPress={listAdd} title='Lisää listaan'/>
        </View>
        <View style={styles.button}>
          <Button onPress={clearList} title='Tyhjennä'/>
        </View>
      </View>
      <Text style={styles.listheader}>Ostoslistasi:</Text>
      <FlatList
        data={data}
        renderItem={({ item }) =>
        <View style={styles.list}> 
          <Text>{item.title}</Text>
          <Text>   </Text>
          <Text style={{color: '#0000ff', marginRight: 10}} onPress={() => deleteItem(item.id)} >Ostettu</Text> 
        </View>}
        keyExtractor={item => item.id.toString()}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 150,
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input : {
    marginTop: 20,
    width: 200,
    height: 40,
    borderColor: 'gray', 
    borderWidth: 1
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    margin: 10
  },
  listheader: {
    color: 'red',
    fontSize: 20
  },
  list:{
    flexDirection: 'row',
    alignItems: 'center'
  }
});
