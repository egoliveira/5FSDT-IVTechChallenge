import {StyleSheet, View, ViewStyle} from "react-native";
import {Avatar, Button, Text} from "react-native-paper"
import {UserResponse} from "../types/user/UserResponse";
import React from "react";

interface Props {
    style?: ViewStyle;
    user: UserResponse | null,
    onLoginClick: () => void,
    onLogoutClick: () => void
}

const UserInfo: React.FC<Props> = ({style, user, onLoginClick, onLogoutClick}) => {
    return (
        <View style={style}>
            {(user != null) && (
                <View style={styles.loggedUserContainer}>
                    <Avatar.Icon icon="account-circle-outline" size={48}/>
                    <Text style={styles.username} variant="bodyMedium" numberOfLines={1}>{user.name}</Text>
                    <Button style={styles.logoutButton} mode="contained" onPress={() => onLogoutClick()}>Sair</Button>
                </View>
            )}
            {(user == null) && (
                <View>
                    <Button style={styles.loginButton} mode="contained" onPress={() => onLoginClick()}>Entrar</Button>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    loginButton: {
        width: "100%",
    },
    loggedUserContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    username: {
        marginTop: 4,
        width: "100%",
        justifyContent: 'center',
    },
    logoutButton: {
        width: "100%",
        marginTop: 16,
    }
});

export default UserInfo;