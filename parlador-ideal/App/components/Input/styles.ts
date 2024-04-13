import { StyleSheet } from "react-native";
import { theme } from "../../@globals/styles/theme";


export const styles = StyleSheet.create({
    icon:{
        position:"absolute",
        left:10,
        top: "25%",
        fontSize:25,
        opacity:.4,
        color:theme.colors.primary3
    },
    
    input:{
        borderColor: "rgba(0, 119, 182, .4)",
        borderWidth:1,
        paddingLeft:40,
        paddingVertical:10,
        borderRadius:10,
        fontFamily: theme.fonts.poppins_regular,
    },

    focused:{
        borderColor: "rgba(0, 119, 182, 1)"
    },

    secure_icon:{
        position:'absolute',
        right:10,
        top:"25%",
        fontSize:25,
        zIndex:9999
    }
});