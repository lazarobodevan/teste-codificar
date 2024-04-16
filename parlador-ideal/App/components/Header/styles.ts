import { StatusBar, StyleSheet } from "react-native";
import { theme } from "../../@globals/styles/theme";

export const styles = StyleSheet.create({
    header:{
        flexDirection:"row",
        alignItems:'center',
        gap:10,
        width:"100%",
        paddingTop: StatusBar.currentHeight+5,
        position:"absolute",
        paddingVertical:10,
        paddingHorizontal:20,
        backgroundColor: '#f2f2f2',
        zIndex:9999,
        elevation: 1
    },

    header_text:{
        fontFamily: theme.fonts.poppins_bold,
        fontSize:18
    },
})