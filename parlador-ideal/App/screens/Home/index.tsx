import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native'
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
  const [displayPage, setDisplayPage] = useState(1);
  const [totalPages, setTotalPages] = useState(null);
  const [loading, setLoading] = useState(false);

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
      setDisplayPage(page+1)
      setTotalPages(loadedPosts.totalPages);
    }catch(e:any){
      console.log(e);
    }
  }

  const handleDelete = (postId: string) =>{
    setPosts(posts.filter(post => post.id != postId));
  }

  const refresh = async()=>{
    try{
      const loadedPosts = await PostService.getPosts(0);
      setPosts(loadedPosts.data);
      setPage(1);
      setDisplayPage(1);
      setTotalPages(loadedPosts.totalPages);
    }catch(e){
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
            Página {displayPage}/{totalPages}
          </Text>
        </View>
        <FlatList
          style={{marginTop:20}}
          data={posts}
          renderItem={({item})=><PostComponent 
            post={item}
            onDelete={handleDelete}/>}
            ItemSeparatorComponent={()=><View style={{height:30}}/>}
          keyExtractor={item => String(item.id)}
          onEndReached={getPosts}
          onEndReachedThreshold={.1}
          ListEmptyComponent={()=> <Text>Nenhum post por aqui...</Text>}
          refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh}/>}
        />
      </View>

    </SafeAreaView>
  )
}