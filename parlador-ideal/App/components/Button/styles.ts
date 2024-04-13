import { StyleSheet } from "react-native";
import { theme } from "../../@globals/styles/theme";

export const styles = StyleSheet.create({
    button:{
        width:"100%",
        height:50,
        backgroundColor: theme.colors.primary1,
        borderRadius:20,
        alignItems:'center',
        justifyContent:'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
    },

    text:{
        color:"white",
        fontSize:18,
    }
})