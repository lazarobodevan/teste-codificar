import { View, Text, TextInput, TouchableOpacity, StyleProp, ViewStyle } from 'react-native'
import React, { useState } from 'react'
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import {styles} from './styles';
import { IconProps } from '@expo/vector-icons/build/createIconSet';

type Props = {
    iconLeft?: keyof typeof Ionicons.glyphMap,
    style?: StyleProp<ViewStyle>,
    multiline?:boolean,
    placeholder: string,
    isSecure?: boolean,
    maxLength?:number,
    initalText?:string,
    onChanged: (text:string)=>void;
}

export default function Input(
    {iconLeft, 
        placeholder, 
        isSecure = false, 
        style, 
        multiline = false, 
        maxLength,
        initalText,
        onChanged}:Props) {

    const [isFocused, setIsFocused] = useState(false);
    const [isSecureText, setIsSecureText] = useState(isSecure);
    const [isSecureVisible, setIsSecureVisible] = useState(false);

    return (
        <View>
            {
                iconLeft && <Ionicons name={iconLeft} style={[styles.icon, {opacity:isFocused?1:.4}]}/>
            }
            {
                isSecureText &&
                <TouchableOpacity style={styles.secure_icon} onPress={()=>{setIsSecureVisible(!isSecureVisible)}}>
                    <Ionicons 
                        name={isSecureVisible ? 'eye' : 'eye-off'}
                        style={styles.secure_icon}
                        />
                </TouchableOpacity>
            }
            <TextInput 
                placeholder={placeholder}
                secureTextEntry={isSecureText && !isSecureVisible}
                style={[styles.input, isFocused && styles.focused, style]}
                onFocus={()=>setIsFocused(true)}
                onBlur={()=>setIsFocused(false)}
                autoCapitalize='none'
                autoCorrect={false}
                onChangeText={onChanged}
                multiline={multiline}
                maxLength={maxLength}
                defaultValue={initalText}
                />
        </View>
    )
}