import { View, Text, Image, TextInput, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import {styles} from './styles'
import icon from '../../assets/icon.png'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'
import ToastHelper from '../../helpers/ToastHelper'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../../@globals/styles/theme'
import Header from '../../components/Header'

export default function Register() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {onLogin, onRegister} = useAuth();
  const navigation = useNavigation();

  const handleRegister = async()=>{
    try{

      if(!validateForm()) return;

      setIsLoading(true);
      await onRegister(name, email, password);
      setIsLoading(false);

      ToastHelper.showSuccess("Conta criada com sucesso!");
      navigation.goBack();
    }catch(e){
      setIsLoading(false);
      if (e.response) {
        ToastHelper.showError(e.response.data.error);
      } else if (e.request) {
        ToastHelper.showError("Erro de solicitação: O servidor não respondeu.");
      } else {
        ToastHelper.showError("Erro desconhecido ao tentar fazer login.");
      }
    }
  }

  const validateForm = () =>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!name.trim()){
      console.log(name)
      ToastHelper.showError("Nome é obrigatório.")
      return false;
    }

    if(!email.trim()){
      ToastHelper.showError("Email é obrigatório.");
      return false;
    }
    if(!emailRegex.test(email.trim())){
      ToastHelper.showError("Email inválido.");
      return false;
    }

    if(!password.trim()){
      ToastHelper.showError("Senha é obrigatória.")
      return false;
    }

    if(!confirmPassword.trim()){
      ToastHelper.showError("Confirmar senha é obrigatório.")
      return false;
    }
    if(password != confirmPassword){
      ToastHelper.showError("As senhas são diferentes")
      return false;
    }
    return true;
  }

  return (
    <View style={{flex:1}}>
      <SafeAreaView style={{alignSelf:"flex-start"}}>
          <Header text='Cadastre-se'/>
      </SafeAreaView>
      <View style={styles.container}>
        <Image source={icon} style={styles.img}/>
        <Text style={styles.title}>Parlador Ideal</Text>

        <View style={styles.login_wrapper}>
          <Text style={styles.login_title}>Cadastre-se</Text>
          <Input 
            iconLeft='person-outline' 
            placeholder='Nome' 
            onChanged={(text)=>setName(text)}/>

          <Input 
            iconLeft='mail-outline' 
            placeholder='E-mail' 
            onChanged={(text)=>setEmail(text)}/>

          <Input 
            iconLeft='lock-closed-outline' 
            placeholder='Senha' 
            isSecure={true} 
            onChanged={(text)=>setPassword(text)}/>

          <Input 
            iconLeft='lock-closed-outline' 
            placeholder='Confirmar senha' 
            isSecure={true} 
            onChanged={(text)=>setConfirmPassword(text)}/>
          <Button 
            text='Cadastrar' 
            style={{marginTop:20}} 
            onPressed={()=>handleRegister()}
            isLoading={isLoading}/>
        </View>
      </View>
    </View>
  )
}