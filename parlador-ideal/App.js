import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, View } from 'react-native';
import Login from './App/screens/Login/index';
import { useFonts, Poppins_400Regular, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { Merriweather_400Regular } from '@expo-google-fonts/merriweather';
import { AuthProvider, useAuth } from './App/context/AuthContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from './App/screens/Home';
import NewPost from './App/screens/NewPost';
import Toast from 'react-native-toast-message';

export default function App() {
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Merriweather_400Regular
  });

  if (!fontsLoaded) {
    return null; // ou qualquer outra lógica de carregamento de fonte
  }

  
  return (
    <AuthProvider>
      <Layout></Layout>
      <Toast/>
    </AuthProvider>
    
  );
}

export const Layout = () =>{
  const {authState, onLogout} = useAuth();
  const Stack = createNativeStackNavigator();
  return(
    <NavigationContainer>
        <Stack.Navigator screenOptions={{headerShown:false}}>
          {authState.token ? 
            <Stack.Screen name='Home' 
              component={Home}>
            </Stack.Screen>:
            <Stack.Screen name='Login' component={Login} ></Stack.Screen>}
            <Stack.Screen name='NewPost' component={NewPost}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});