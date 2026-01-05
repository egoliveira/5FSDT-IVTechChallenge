import {StyleSheet, View} from "react-native";
import {RouteProp, useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../navigation/types";
import {ActivityIndicator, Icon, IconButton, Snackbar, Text} from "react-native-paper";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useAppTheme} from "./theme";
import {clearFilters, setCurrentEditingUser} from "../redux/slices/UserSlice";
import {useChangeUserPasswordMutation, useLazyUserRolesQuery, useUpdateUserMutation} from "../services/schola_blog_api";
import {FullUserInfo} from "../types/user/FullUserInfo";
import {RootState} from "../redux/store";
import ActivateDeactivateUserDialog from "../components/ActivateDeactivateUserDialog";
import {UpdateUserRequest, UserContent} from "../types/user/UpdateUserRequest";
import ChangePasswordDialog from "../components/ChangePasswordDialog";
import {ChangePasswordContent, ChangePasswordRequest} from "../types/user/ChangePasswordRequest";

type ViewUserScreenRouteProp = RouteProp<RootStackParamList, 'ViewUser'>;

type Props = {
    route: ViewUserScreenRouteProp;
};

const ViewUserScreen = ({route}: Props) => {
    const theme = useAppTheme();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const {user} = route.params;
    const [fullUserInfo, setFullUserInfo] = useState<FullUserInfo | undefined>(undefined);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showSnackbar, setShowSnackbar] = useState(false);

    const [showActivateDeactivateUserDialog, setShowActivateDeactivateUserDialog] = useState(false);
    const [showPasswordChangeDialog, setShowPasswordChangeDialog] = useState(false);

    const [rolesTrigger, {
        data: roles,
        isLoading: isLoadingRoles,
        isFetching: isFetchingRoles,
        error: rolesError
    }] = useLazyUserRolesQuery();

    const [updateUser, {isLoading: isUpdatingUser}] = useUpdateUserMutation();

    const [changePassword, {isLoading: isChangingPassword}] = useChangeUserPasswordMutation();

    const loading = isLoadingRoles || isFetchingRoles || isUpdatingUser || isChangingPassword || !fullUserInfo;

    useEffect(() => {
        rolesTrigger(user.id);
    }, [rolesTrigger]);

    useEffect(() => {
        if (roles) {
            dispatch(setCurrentEditingUser({
                userInfo: {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    email: user.email,
                    active: user.active
                },
                userRoles: {
                    admin: roles.admin,
                    teacher: roles.teacher,
                    student: roles.student,
                }
            }));
        }
    }, [roles]);

    useSelector((state: RootState) => {
        const currentUserInfo = state.user.currentEditingUser;

        if (currentUserInfo !== fullUserInfo) {
            setFullUserInfo(currentUserInfo);
        }
    });

    const currentUserUsername = useSelector((state: RootState) => state.user.username);

    const viewingHimself = currentUserUsername == fullUserInfo?.userInfo.username;

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (<View style={styles.viewUserActionsContainer}>
                <IconButton
                    icon={fullUserInfo?.userInfo.active ? "account-remove-outline" : "account-reactivate-outline"}
                    size={24}
                    iconColor={theme.colors.onPrimary}
                    onPress={() => setShowActivateDeactivateUserDialog(true)} disabled={loading || viewingHimself}/>
                <IconButton icon="account-edit-outline" size={24} iconColor={theme.colors.onPrimary}
                            onPress={() => navigation.navigate("EditUserScreen", {user: user})}
                            disabled={loading}/>
                <IconButton icon="form-textbox-password" size={24} iconColor={theme.colors.onPrimary}
                            onPress={() => setShowPasswordChangeDialog(true)}
                            disabled={loading}/>
            </View>)
        })
    });

    const activateOrDeactivateUser = async () => {
        setShowActivateDeactivateUserDialog(false);

        if (fullUserInfo) {
            const userContent = new UserContent(
                fullUserInfo.userInfo.name,
                fullUserInfo.userInfo.email,
                !fullUserInfo.userInfo.active
            );

            const request = new UpdateUserRequest(fullUserInfo?.userInfo.id, userContent);

            try {
                const updatedUser = await updateUser(request).unwrap();

                const newFullUserInfo = {
                    userInfo: {
                        id: updatedUser.id,
                        username: updatedUser.username,
                        name: updatedUser.name,
                        email: updatedUser.email,
                        active: updatedUser.active
                    },
                    userRoles: {
                        admin: fullUserInfo.userRoles.admin,
                        teacher: fullUserInfo.userRoles.teacher,
                        student: fullUserInfo.userRoles.student,
                    }
                };

                dispatch(setCurrentEditingUser(newFullUserInfo));
                dispatch(clearFilters({}));
            } catch (error) {
                if (error.message) {
                    setSnackbarMessage(error.message);
                } else {
                    setSnackbarMessage("Ocorreu um erro ao atualizar as informações do usuário. Tente novamente.")
                }

                setShowSnackbar(true);
            }
        }
    };

    const changeUserPassword = async (password: string) => {
        setShowPasswordChangeDialog(false);

        if (fullUserInfo) {
            const passwordContent = new ChangePasswordContent(password);
            const request = new ChangePasswordRequest(fullUserInfo.userInfo.id, passwordContent);

            try {
                await changePassword(request).unwrap();

                setSnackbarMessage("Senha alterada com sucesso.");
            } catch (error) {
                if (error.message) {
                    setSnackbarMessage(error.message);
                } else {
                    setSnackbarMessage("Ocorreu um erro ao alterar a senha do usuário. Tente novamente.")
                }
            }

            setShowSnackbar(true);
        }
    };

    return (
        <View style={styles.container}>
            {(!isLoadingRoles && !isFetchingRoles && fullUserInfo) && (<View>
                <Text variant="titleMedium">Usuário</Text>
                <Text variant="bodyLarge">{fullUserInfo.userInfo.username}</Text>

                <Text style={styles.name} variant="titleMedium">Nome</Text>
                <Text variant="bodyLarge">{fullUserInfo.userInfo.name}</Text>

                <Text style={styles.email} variant="titleMedium">E-mail</Text>
                <Text variant="bodyLarge">{fullUserInfo.userInfo.email}</Text>

                <Text style={styles.active} variant="titleMedium">Ativo</Text>
                <Text variant="bodyLarge">{fullUserInfo.userInfo.active ? "Sim" : "Não"}</Text>

                <Text style={styles.role} variant="titleMedium">Papel</Text>
                <Text
                    variant="bodyLarge">{fullUserInfo.userRoles.admin || fullUserInfo.userRoles.teacher ? "Professor" : "Aluno"}</Text>
            </View>)}

            {(isLoadingRoles || isFetchingRoles || (rolesError)) && (
                <View style={styles.loadingErrorContainer}>
                    {(!isLoadingRoles && !isFetchingRoles && rolesError) && (<View>
                        <Icon source="alert-circle-outline" size={64}/>
                        <Text variant="bodyLarge" style={styles.errorText}>
                            Ocorreu um erro ao carregar as informações do usuário.
                        </Text>
                    </View>)}

                    {(isLoadingRoles || isFetchingRoles || !fullUserInfo) && (<ActivityIndicator size="large"/>)}
                </View>)}

            <Snackbar visible={showSnackbar} onDismiss={() => setShowSnackbar(false)}>
                {snackbarMessage}
            </Snackbar>

            <ActivateDeactivateUserDialog onActivateOrDeactivateUser={activateOrDeactivateUser}
                                          onDialogClose={() => setShowActivateDeactivateUserDialog(false)}
                                          visible={showActivateDeactivateUserDialog}/>

            <ChangePasswordDialog visible={showPasswordChangeDialog}
                                  onPasswordChange={(password) => changeUserPassword(password)}
                                  onDialogClose={() => setShowPasswordChangeDialog(false)}/>
        </View>);
}

const styles = StyleSheet.create({
    viewUserActionsContainer: {
        flexDirection: "row"
    },
    container: {
        flex: 1,
        padding: 8,
    },
    loadingErrorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    name: {
        marginTop: 8,
    },
    email: {
        marginTop: 8,
    },
    active: {
        marginTop: 8,
    },
    role: {
        marginTop: 8,
    },
    errorText: {
        marginTop: 8,
        textAlign: "center",
        width: '100%',
        marginHorizontal: 16
    },
});

export default ViewUserScreen;