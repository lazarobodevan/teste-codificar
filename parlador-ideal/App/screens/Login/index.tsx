import { View, Text, Image, TextInput } from 'react-native'
import React, { useState } from 'react'
import {styles} from './styles'
import icon from '../../assets/icon.png'
import Input from '../../components/Input'
import Button from '../../components/Button'
import { useAuth } from '../../context/AuthContext'

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {onLogin, onRegister} = useAuth();

  return (
    <View style={styles.container}>
      <Image source={icon} style={styles.img}/>
      <Text style={styles.title}>Parlador Ideal</Text>

      <View style={styles.login_wrapper}>
        <Text style={styles.login_title}>Login</Text>
        <Input iconLeft='mail-outline' placeholder='E-mail' onChanged={(text)=>setEmail(text)}/>
        <Input iconLeft='lock-closed-outline' placeholder='Senha' isSecure={true} onChanged={(text)=>setPassword(text)}/>
        <Button text='Logar' style={{marginTop:20}} onPressed={()=>onLogin(email, password)}/>
      </View>
    </View>
  )
}