import { StyleSheet } from "react-native";
import { theme } from "../../@globals/styles/theme";

export const styles = StyleSheet.create({

    container:{
        minHeight:100,
        borderBottomWidth:1,
        borderBottomColor: theme.colors.primary3
    },

    header:{
        justifyContent:'space-between',
        flexDirection:'row',
        alignItems:'center'
    },

    user_data:{
        flexDirection:"row",
        alignItems:"center",
        gap:10
    },

    user_data_right:{
        alignItems:"flex-end"
    },

    avatar:{
        width:40,
        height:40
    },

    author_name:{
        fontFamily: theme.fonts.poppins_regular,
        fontSize:16
    },

    created_at:{
        fontFamily: theme.fonts.poppins_regular
    },

    content_container:{
        paddingHorizontal:40,
        paddingVertical:10
    }
});