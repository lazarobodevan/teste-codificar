import { StyleSheet } from "react-native";
import { theme } from "../../@globals/styles/theme";

export const styles = StyleSheet.create({

    container:{
        padding:20
    },


    counter_container:{
        flexDirection:"row",
        alignItems:'center',
        justifyContent:"flex-end",
        marginTop:5
    },

    counter:{
        fontFamily:theme.fonts.poppins_regular,
        alignSelf:"flex-end",
        marginTop:5,
        width:60,
        textAlign:"right"
    },

    counter_max:{
        color: "red"
    }
})