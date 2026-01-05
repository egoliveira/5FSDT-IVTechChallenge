import PostsScreen from "../screens/PostsScreen";
import DrawerMenu from "./DrawerMenu";
import {Badge, IconButton} from "react-native-paper";
import {createDrawerNavigator} from "@react-navigation/drawer";
import React, {useState} from "react";
import {useAppTheme} from "../screens/theme";
import {useNavigation} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentUser, setCurrentUserRoles, setToken} from "../redux/slices/UserSlice";
import {currentUser} from "../redux/slices/current_user";
import {clearFilters as clearPostFilters, setShowPostsFilters} from "../redux/slices/PostSlice";
import {StyleSheet, View} from "react-native";
import {RootState} from "../redux/store";
import UsersScreen from "../screens/UsersScreens";
import StudentsScreen from "../screens/StudentsScreens";

const DrawerNavigator = () => {
    const navigation = useNavigation();
    const Drawer = createDrawerNavigator();

    const theme = useAppTheme();

    const dispatch = useDispatch();

    const [postsFiltersCount, setPostsFiltersCount] = useState(0);

    useSelector((state: RootState) => {
        const filtersState = state.post.filtersState;

        let count = 0;

        if (filtersState.fullContent && (filtersState.fullContent.trim().length >= 2)) {
            count++;
        }

        if (filtersState.subject) {
            count++;
        }

        if (filtersState.teachingLevel) {
            count++;
        }

        if (filtersState.teachingGrade) {
            count++;
        }

        if (filtersState.teacher) {
            count++;
        }

        if (count != postsFiltersCount) {
            setPostsFiltersCount(count);
        }
    });

    const isAdmin = useSelector((state: RootState) => state.user.isAdmin);

    const isTeacher = useSelector((state: RootState) => state.user.isTeacher);

    const usersDisplay = isAdmin ? "contents" : "none";

    const studentsDisplay = isTeacher ? "contents" : "none";

    return (
        <Drawer.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.colors.primary,
                },
                headerTintColor: theme.colors.onPrimary
            }}
            drawerContent={props => <DrawerMenu
                user={currentUser()}
                onLoginClick={() => {
                    navigation.navigate("LoginScreen");

                    props.navigation.closeDrawer();
                }}
                onLogoutClick={() => {
                    dispatch(setToken(null));
                    dispatch(setCurrentUser(null));
                    dispatch(setCurrentUserRoles(null));

                    dispatch(clearPostFilters(undefined));

                    props.navigation.closeDrawer();

                    props.navigation.reset({
                        index: 0,
                        routes: [{name: 'Posts'}],
                    });
                }}
                {...props} />
            }>
            <Drawer.Screen name="Posts" options={
                {
                    title: 'Postagens',
                    headerRight: () => (
                        <View style={styles.postsFilterContainer}>
                            <IconButton icon="filter-outline" iconColor={theme.colors.onPrimary} size={24}
                                        onPress={() => dispatch(setShowPostsFilters(true))}/>
                            {(postsFiltersCount > 0) && (
                                <Badge
                                    style={[styles.postsFilterBadge, {backgroundColor: theme.colors.error}]}
                                    size={15}>{postsFiltersCount}</Badge>
                            )}
                        </View>
                    )
                }
            } component={PostsScreen}/>
            <Drawer.Screen name="Users" options={
                {
                    title: 'Usuários',
                    drawerItemStyle: {
                        display: usersDisplay
                    }
                }
            } component={UsersScreen}/>

            <Drawer.Screen name="Students" options={
                {
                    title: 'Alunos',
                    drawerItemStyle: {
                        display: studentsDisplay
                    }
                }
            } component={StudentsScreen}/>
        </Drawer.Navigator>
    );
}

const styles = StyleSheet.create({
    postsFilterContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
    },
    postsFilterBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default DrawerNavigator;