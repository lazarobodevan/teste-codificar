import { View, Text, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import {styles} from './styles'
import icon from '../../assets/icon.png'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'
import ToastHelper from '../../helpers/ToastHelper'
import { Link } from '@react-navigation/native'

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const {onLogin, onRegister} = useAuth();

  const handleLogin = async()=>{
    try{
      setIsLoading(true);
      await onLogin(email, password);
      setIsLoading(false);
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

  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.img}/>
      <Text style={styles.title}>Parlador Ideal</Text>

      <View style={styles.login_wrapper}>
        <Text style={styles.login_title}>Login</Text>
        <Input iconLeft='mail-outline' placeholder='E-mail' onChanged={(text)=>setEmail(text)}/>
        <Input iconLeft='lock-closed-outline' placeholder='Senha' isSecure={true} onChanged={(text)=>setPassword(text)}/>
        <Button 
          text='Logar' 
          style={{marginTop:20}} 
          onPressed={()=>handleLogin()}
          isLoading={isLoading}/>
        <Text style={styles.register}>
          Ainda não tem uma conta?{"\n"}
          <Link to={"/Register"} style={[styles.register, {color:"blue"}]}>
            Cadastre-se!
          </Link>
        </Text>
      </View>
    </View>
  )
}