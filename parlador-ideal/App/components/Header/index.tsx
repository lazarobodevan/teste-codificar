import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { theme } from '../../@globals/styles/theme'
import { styles } from './styles'
import { useNavigation } from '@react-navigation/native'

type Props = {
    text:string
}

export default function Header({text}:Props) {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={()=>{navigation.goBack()}}>
                <Ionicons name='arrow-back-circle-outline' style={{fontSize:40, color:theme.colors.primary3}}/>
            </TouchableOpacity>
            <Text style={styles.header_text}>{text}</Text>
        </View>
    )
}