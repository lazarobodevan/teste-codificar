import Toast from "react-native-toast-message";

class ToastHelper{
    
    public static showSuccess(text:string){
        Toast.show({
            type:"success",
            text1:"Sucesso",
            text2:text,
            text1Style:{fontSize:14},
            text2Style:{fontSize:14},
            position:"bottom"
          });
    }

    public static showError(text:string){
        Toast.show({
            type:"error",
            text1:"Erro",
            text2:text,
            text1Style:{fontSize:14},
            text2Style:{fontSize:14},
            position:"bottom"
          });
    }
}

export default ToastHelper;