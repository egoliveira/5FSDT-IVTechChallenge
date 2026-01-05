import React from "react";
import {Drawer, Text} from "react-native-paper"
import {DrawerContentComponentProps} from "@react-navigation/drawer";
import {SafeAreaView} from "react-native-safe-area-context";
import {UserResponse} from "../types/user/UserResponse";
import UserInfo from "../components/UserInfo";
import {Image, StyleSheet} from "react-native";
import drawerIcon from "../assets/drawer_icon.png";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";

interface Props extends DrawerContentComponentProps {
    user: UserResponse | null,
    onLoginClick: () => void,
    onLogoutClick: () => void
}

const DrawerMenu: React.FC<Props> = (props: Props) => {
    const isAdmin = useSelector((state: RootState) => state.user.isAdmin);
    const isTeacher = useSelector((state: RootState) => state.user.isTeacher);

    return (
        <SafeAreaView>
            <Drawer.Section title="" showDivider={true} style={styles.header}>
                <Image source={drawerIcon}/>
                <Text style={styles.appTitle} variant="headlineMedium">Schola Blog</Text>
                <UserInfo style={styles.userInfo} user={props.user} onLoginClick={props.onLoginClick}
                          onLogoutClick={props.onLogoutClick}/>
            </Drawer.Section>
            <Drawer.Section style={styles.items} title="">
                <Drawer.Item label="Postagens"
                             active={props?.state?.index === 0}
                             onPress={() => props?.navigation?.navigate('Posts')}/>
                {isAdmin && (<Drawer.Item label="Usuários"
                                          active={props?.state?.index === 1}
                                          onPress={() => props?.navigation?.navigate('Users')}/>)}
                {isTeacher && (<Drawer.Item label="Alunos"
                                            active={props?.state?.index === 2}
                                            onPress={() => props?.navigation?.navigate('Students')}/>)}
            </Drawer.Section>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    appTitle: {
        marginTop: 8,
    },
    userInfo: {
        marginTop: 16,
    },
    items: {
        marginTop: 16,
    }
});

export default DrawerMenu;