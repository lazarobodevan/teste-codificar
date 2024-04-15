import { StyleSheet } from "react-native";
import { theme } from "../../@globals/styles/theme";

export const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems:'center'
    },

    img:{
        width: 160,
        height: 160
    },

    title:{
        fontFamily: theme.fonts.merriweather,
        fontSize: 23,
        fontWeight: '600'
    },

    login_wrapper:{
        width:"100%",
        paddingHorizontal: 40,
        paddingVertical:20,
        gap:10
    },

    login_title:{
        fontFamily: theme.fonts.poppins_bold,
        fontSize:20,
    },

    input:{
        borderColor: theme.colors.primary1,
        borderWidth:1,
        padding:10,
        borderRadius:10,
        fontFamily: theme.fonts.poppins_regular
    },

    register:{
        alignSelf:"center",
        textAlign:"center",
        fontFamily: theme.fonts.poppins_regular
    }
})