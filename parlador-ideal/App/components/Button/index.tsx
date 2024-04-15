import { View, Text, TouchableOpacity, StyleProp, ViewStyle, ActivityIndicator } from 'react-native'
import React from 'react'
import { styles } from './styles'

type Props = {
    style?: StyleProp<ViewStyle>,
    text: string,
    isLoading?: boolean,
    onPressed: ({...rest})=>any;
}

export default function Button({style, text, isLoading = false, onPressed}:Props) {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      onPress={!isLoading ? onPressed : ()=>{}}>

      {isLoading && <ActivityIndicator color={"white"}/>}
      {!isLoading && <Text style={styles.text}>{text}</Text>}
      
    </TouchableOpacity>
  )
}