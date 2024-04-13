import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import {SafeAreaView} from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import { useAuth } from '../../context/AuthContext';
import { styles } from './styles';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Post from '../../models/Post';
import PostService from '../../services/post/PostService';
import Button from '../../components/Button';
import PostComponent from '../../components/Post';
import { theme } from '../../@globals/styles/theme';

export default function Home() {
  const {authState, onLogout} = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(null);

  const userName = authState.user.name.length > 8 ? 
    authState.user.name.split(" ")[0].substring(0,8) +"...": 
    authState.user.name;

  const navigation = useNavigation();

  const getPosts = async() =>{
    try{

      const loadedPosts = await PostService.getPosts(page, totalPages);
      if(!loadedPosts?.data) return;

      setPosts([...posts, ...loadedPosts.data]);
      setPage(page+1)
      setTotalPages(loadedPosts.totalPages);
    }catch(e:any){
      console.log(e);
    }
  }

  useEffect(()=>{
    
    getPosts();
  },[])

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greetings}>Olá, {userName}!</Text>
        <TouchableOpacity onPress={()=>{onLogout()}}>
          <Ionicons name='log-out' style={styles.logout}/>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={()=>{navigation.navigate("NewPost" as never)}}>
        <View style={styles.new_post}>
          <Text style={styles.new_post_text}>Criar novo post...</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.posts_container}>
        <View style={styles.posts_header}>
          <Text style={styles.post_title}>Posts recentes</Text>
          <Text style={{fontFamily:theme.fonts.poppins_regular}}>
            Página {page}/{totalPages}
          </Text>
        </View>
        <FlatList
          style={{marginTop:20}}
          data={posts}
          renderItem={({item})=><PostComponent 
            id={item.id}
            content={item.content}
            author={item.author!}
            createdAt={item.createdAt}
            key={item.id}/>}
            ItemSeparatorComponent={()=><View style={{height:30}}/>}
          keyExtractor={item => String(item.id)}
          onEndReached={getPosts}
          onEndReachedThreshold={.1}
        />
      </View>

    </SafeAreaView>
  )
}