import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Post from '../../models/Post'
import { styles } from './styles'
import axios from 'axios';
import Button from '../Button';
import moment from 'moment';
import 'moment/locale/pt-br'
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { Menu, MenuItem } from 'react-native-material-menu';

export default function PostComponent(post:Post) {
    
    const [avatar, setAvatar] = useState(null);
    const {authState} = useAuth();
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    moment.locale('pt-br');

    const userName = post.author.name.length > 12 ? 
    post.author.name.split(" ")[0].substring(0,12) +"...": 
    post.author.name;

    useEffect(() => {
        const getAvatar = async () => {
            try {
                const apiAvatar = await axios.get(`https://ui-avatars.com/api/?name=${post.author.name}&rounded=true&format=png&background=random`, { responseType: 'blob' });
                const reader = new FileReader();
                reader.readAsDataURL(apiAvatar.data);
                reader.onloadend = () => {
                    setAvatar(reader.result);
                };
            } catch (error) {
                console.error('Error fetching avatar:', error);
            }
        }
        getAvatar();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.user_data}>
                    <Image 
                        source={{ uri: avatar }} 
                        style={styles.avatar} />
                    <Text style={styles.author_name}>{userName}</Text>
                </View>
                <View style={styles.user_data_right}>
                    { authState.user.id === post.author.id && (
                        <View>
                            <Menu
                                visible={isMenuVisible}
                                onRequestClose={()=>setIsMenuVisible(false)}
                                anchor={<TouchableOpacity onPress={()=>setIsMenuVisible(true)}>
                                            <Ionicons name='ellipsis-horizontal' style={{fontSize:18}}/>
                                        </TouchableOpacity>}
                            >
                                <MenuItem onPress={()=>{}}>Editar</MenuItem>
                                <MenuItem onPress={()=>{}}>Deletar</MenuItem>
                            </Menu>
                        </View>
                    ) 
                    }
                    <Text style={styles.created_at}>
                        {moment(post.createdAt).startOf('day').fromNow()}
                    </Text>
                    
                </View>
            </View>
            <View style={styles.content_container}>
                <Text>{post.content}</Text>
            </View>
        </View>
    )
}