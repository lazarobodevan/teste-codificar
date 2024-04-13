import { View, Text, TouchableOpacity, StyleProp, ViewStyle } from 'react-native'
import React from 'react'
import { styles } from './styles'

type Props = {
    style?: StyleProp<ViewStyle>,
    text: string
    onPressed: ({...rest})=>any;
}

export default function Button({style, text, onPressed}:Props) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPressed}>
        <Text style={styles.text}>{text}</Text>
    </TouchableOpacity>
  )
}