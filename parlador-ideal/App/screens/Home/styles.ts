import { StyleSheet } from "react-native";
import { theme } from "../../@globals/styles/theme";

export const styles = StyleSheet.create({
    container:{
        paddingHorizontal:20,
        paddingVertical:20,
        flex:1
    },
    header:{
        width:"100%",
        justifyContent:"space-between",
        
        alignItems:"flex-start",
        flexDirection:"row"
    },
    greetings:{
        fontFamily: theme.fonts.poppins_bold,
        fontSize:20,
        flexDirection:"row",
    },
    logout:{
        fontSize:30,
        color:"red"
    },

    new_post:{
        width:"100%",
        height:100,
        backgroundColor: "rgba(0, 119, 182, .1)",
        borderColor:"rgba(0, 119, 182, .4)",
        borderWidth:1,
        borderRadius:10,
        padding:20,
        opacity:.3,
        marginTop:20
    },

    new_post_text:{
        fontFamily:theme.fonts.poppins_regular,
        fontSize:14
    },

    posts_container:{
        flex:1,
        marginTop:20
    },

    posts_header:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"space-between"
    },

    post_title:{
        fontFamily: theme.fonts.poppins_bold,
        fontSize: 18
    }
})