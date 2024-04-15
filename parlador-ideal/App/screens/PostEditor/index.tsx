import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { styles } from './styles'
import Input from '../../components/Input'
import CircularProgress, { CircularProgressBase } from 'react-native-circular-progress-indicator'
import { theme } from '../../@globals/styles/theme'
import Button from '../../components/Button'
import { Ionicons } from '@expo/vector-icons'
import { useNavigation, CommonActions, useRoute } from '@react-navigation/native'
import PostService from '../../services/post/PostService'
import Toast from 'react-native-toast-message'
import ToastHelper from '../../helpers/ToastHelper'

export default function PostEditor() {

  const [content,setContent] = useState("");
  const [postId, setPostId] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();

  const getIndicatorColor = () =>{
    const percentage = (content.length / 280) * 100;
    if(percentage < 80 ){
      return theme.colors.primary1;
    }
    if(percentage >=80 && percentage < 100){
      return "#ffb703";
    }
    return "#a4161a"
  }

  const createPost = async() =>{
    try{
      const createdPost = await PostService.createPost(content);
      ToastHelper.showSuccess("Post criado com sucesso!");

      navigation.dispatch(
        CommonActions.reset({
          index:0,
          routes:[{name:"Home"}]
        })
      )
    }catch(e){
      ToastHelper.showError(e)
    }
  }

  const updatePost = async() =>{
    try{
      const updatedPost = await PostService.updatePost(content,postId);
      ToastHelper.showSuccess("Post atualizado com sucesso!")

      navigation.dispatch(
        CommonActions.reset({
          index:0,
          routes:[{name:"Home"}]
        })
      )
    }catch(e){
      ToastHelper.showError(e)
    }
  }

  useEffect(()=>{
    const contentFromScreen = route.params as {content?:string, id?:string};
    setContent(contentFromScreen?.content || "");
    setPostId(contentFromScreen?.id);
  },[])

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={()=>{navigation.goBack()}}>
          <Ionicons name='arrow-back-circle-outline' style={{fontSize:40, color:theme.colors.primary3}}/>
        </TouchableOpacity>
        <Text style={styles.header_text}>Criar novo post</Text>
      </SafeAreaView>
        <Input onChanged={(text)=>{setContent(text)}} 
          placeholder='Novo post...' 
          multiline={true} 
          style={{minHeight:150}} 
          maxLength={280}
          initalText={content}/>

        <View style={styles.counter_container}>
          <CircularProgressBase
            value={content.length}
            activeStrokeColor={getIndicatorColor()}
            maxValue={280}
            radius={15}

          />
          <Text style={styles.counter}>
            {content.length}/280
          </Text>
        </View>
        {
          !postId &&
          <Button onPressed={async()=>{await createPost()}} text='Publicar' style={{marginTop:40, width:"60%", alignSelf:"flex-end"}}/>
        }
        {
          postId &&
          <Button onPressed={async()=>{await updatePost()}} text='Atualizar' style={{marginTop:40, width:"60%", alignSelf:"flex-end"}}/>
        }
    </View>
  )
}