import { StatusBar, StyleSheet } from "react-native";
import { theme } from "../../@globals/styles/theme";

export const styles = StyleSheet.create({
    header:{
        flexDirection:"row",
        alignItems:'center',
        marginBottom:20,
        gap:10,
        width:"100%",
        marginTop: StatusBar.currentHeight,
        position:"absolute",
        padding:20
    },

    header_text:{
        fontFamily: theme.fonts.poppins_bold,
        fontSize:18
    },
})