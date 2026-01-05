import {Image, StyleSheet, View} from "react-native";
import drawerIcon from "../assets/drawer_icon.png";
import {Button, Snackbar, Text, TextInput} from "react-native-paper";
import {useState} from "react";
import {useCurrentUserMutation, useCurrentUserRolesMutation, useLoginMutation} from "../services/schola_blog_api";
import {LoginRequest} from "../types/user/LoginRequest";
import {setCurrentUser, setCurrentUserRoles, setToken} from "../redux/slices/UserSlice";
import {useDispatch} from "react-redux";
import {useNavigation} from "@react-navigation/native";
import {clearFilters} from "../redux/slices/PostSlice";

const LoginScreen = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [canLogin, setCanLogin] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showSnackbar, setShowSnackbar] = useState(false);

    const [login] = useLoginMutation();
    const [getCurrentUser] = useCurrentUserMutation();
    const [getCurrentUserRoles] = useCurrentUserRolesMutation();

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const updateCanLogin = (username: string, password: string) => {
        setCanLogin((username.trim().length >= 3) && (password.trim().length >= 8));
    }

    const performLogin = async () => {
        setIsLoggingIn(true);

        const request = new LoginRequest(username, password);

        try {
            const loginResponse = await login(request).unwrap();

            dispatch(setToken(loginResponse.token));

            const currentUser = await getCurrentUser(undefined).unwrap();

            if (currentUser) {
                dispatch(setCurrentUser(currentUser));
            } else {
                throw new Error();
            }

            const currentUserRoles = await getCurrentUserRoles(undefined).unwrap();

            if (currentUserRoles) {
                dispatch(setCurrentUserRoles(currentUserRoles));
            } else {
                throw new Error();
            }

            dispatch(clearFilters(undefined));

            navigation.goBack();
        } catch (error) {
            if (error.message) {
                setSnackbarMessage(error.message);
            } else {
                setSnackbarMessage("Ocorreu um erro ao efetuar o login. Tente novamente.");
            }

            dispatch(setToken(null));
            dispatch(setCurrentUser(null));
            dispatch(setCurrentUserRoles(null));

            setShowSnackbar(true);
        } finally {
            setIsLoggingIn(false);
        }
    }

    return (
        <View style={styles.container}>
            <Image source={drawerIcon}/>

            <Text style={styles.appTitle} variant="headlineMedium">Schola Blog</Text>

            <TextInput style={styles.username}
                       label="Usuário"
                       inputMode="email"
                       mode="outlined"
                       value={username}
                       numberOfLines={1}
                       maxLength={100}
                       disabled={isLoggingIn}
                       onChangeText={(value) => {
                           setUsername(value);
                           updateCanLogin(value, password);
                       }}/>

            <TextInput style={styles.password}
                       label="Senha"
                       inputMode="text"
                       mode="outlined"
                       value={password}
                       numberOfLines={1}
                       maxLength={100}
                       secureTextEntry={!showPassword}
                       disabled={isLoggingIn}
                       right={<TextInput.Icon
                           icon={!showPassword ? "eye-outline" : "eye-off-outline"}
                           onPress={() => setShowPassword(!showPassword)}/>}
                       onChangeText={(value) => {
                           setPassword(value);
                           updateCanLogin(username, value);
                       }}/>

            <Button style={styles.loginButton}
                    mode="contained"
                    disabled={!canLogin || isLoggingIn}
                    onPress={performLogin}>Entrar</Button>

            <Snackbar visible={showSnackbar} onDismiss={() => setShowSnackbar(false)}>
                {snackbarMessage}
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    appTitle: {
        marginTop: 8,
    },
    username: {
        width: '80%',
        marginTop: 16,
    },
    password: {
        width: '80%',
        marginTop: 8,
    },
    loginButton: {
        width: '60%',
        marginTop: 24,
    }
});

export default LoginScreen;