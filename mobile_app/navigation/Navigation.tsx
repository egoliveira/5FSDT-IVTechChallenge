import {NavigationContainer} from "@react-navigation/native";
import React from "react";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import DrawerNavigator from "./DrawerNavigator";
import {useAppTheme} from "../screens/theme";
import LoginScreen from "../screens/LoginScreen";
import CreateEditPostScreen from "../screens/CreateEditPostScreen";
import ViewPostScreen from "../screens/ViewPostScreen";
import CreateEditUserScreen from "../screens/CreateEditUserScreen";
import ViewUserScreen from "../screens/ViewUserScreen";
import ViewStudentScreen from "../screens/ViewStudentScreen";
import EditStudentScreen from "../screens/EditStudentScreen";

const Navigation: React.FC = () => {
    const Stack = createNativeStackNavigator();

    const theme = useAppTheme();

    return (<NavigationContainer theme={theme}>
        <Stack.Navigator>
            <Stack.Screen name="MainDrawer" component={DrawerNavigator} options={{headerShown: false}}/>
            <Stack.Screen name="LoginScreen" component={LoginScreen} options={{
                title: "Login",
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary
            }}/>
            <Stack.Screen name="ViewPostScreen" component={ViewPostScreen} options={{
                title: "Ver Postagem",
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary
            }}/>
            <Stack.Screen name="CreatePostScreen" component={CreateEditPostScreen} options={{
                title: "Criar Postagem",
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary
            }}/>
            <Stack.Screen name="EditPostScreen" component={CreateEditPostScreen} options={{
                title: "Editar Postagem",
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary
            }}/>
            <Stack.Screen name="CreateUserScreen" component={CreateEditUserScreen} options={{
                title: "Criar Usuário",
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary
            }}/>
            <Stack.Screen name="EditUserScreen" component={CreateEditUserScreen} options={{
                title: "Editar Usuário",
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary
            }}/>
            <Stack.Screen name="ViewUserScreen" component={ViewUserScreen} options={{
                title: "Ver Usuário",
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary
            }}/>
            <Stack.Screen name="ViewStudentScreen" component={ViewStudentScreen} options={{
                title: "Ver Aluno",
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary
            }}/>
            <Stack.Screen name="EditStudentScreen" component={EditStudentScreen} options={{
                title: "Editar Aluno",
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary
            }}/>
        </Stack.Navigator>
    </NavigationContainer>);
}

export default Navigation;