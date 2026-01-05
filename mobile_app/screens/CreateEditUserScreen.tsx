import {StyleSheet, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {HelperText, IconButton, SegmentedButtons, Snackbar, Text, TextInput} from "react-native-paper";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {useCreateUserMutation, useUpdateUserMutation, useUpdateUserRolesMutation} from "../services/schola_blog_api";
import {useAppTheme} from "./theme";
import {useDispatch, useSelector} from "react-redux";
import {
    ADMIN_ROLE_TAG,
    STUDENT_ROLE_NAME,
    STUDENT_ROLE_TAG,
    TEACHER_ROLE_NAME,
    TEACHER_ROLE_TAG
} from "../types/roles/UserRoles";
import {isEmailValid} from "../util/email_validator";
import {CreateUserRequest} from "../types/user/CreateUserRequest";
import {clearFilters, setCurrentEditingUser} from "../redux/slices/UserSlice";
import {UpdateUserRequest, UserContent} from "../types/user/UpdateUserRequest";
import {RootState} from "../redux/store";
import {FullUserInfo, UserRoles} from "../types/user/FullUserInfo";
import {UpdateUserRolesRequest, UserRolesContent} from "../types/user/UpdateUserRolesRequest";

const CreateEditUserScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [userInfo, setUserInfo] = useState<FullUserInfo | undefined>(undefined);
    const [username, setUsername] = useState<string>("");
    const [usernameError, setUsernameError] = useState(false);
    const [name, setName] = useState<string>("");
    const [nameError, setNameError] = useState(false);
    const [email, setEmail] = useState<string>("");
    const [emailError, setEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");
    const [role, setRole] = useState<string>(STUDENT_ROLE_TAG);
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [passwordConfirmationError, setPasswordConfirmationError] = useState(false);
    const [passwordConfirmationErrorMessage, setPasswordConfirmationErrorMessage] = useState("");
    const [active, setActive] = useState<boolean>(true);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showSnackbar, setShowSnackbar] = useState(false);

    const [createUser, {isLoading: isCreatingUser}] = useCreateUserMutation();
    const [updateUser, {isLoading: isUpdatingUser}] = useUpdateUserMutation();
    const [updateUserRoles, {isLoading: isUpdatingUserRoles}] = useUpdateUserRolesMutation();

    const currentUserInfo = useSelector((state: RootState) => {
        const currentUserInfo = state.user.currentEditingUser;

        if (currentUserInfo != userInfo) {
            if (currentUserInfo) {
                setUsername(currentUserInfo.userInfo.username);
                setName(currentUserInfo.userInfo.name);
                setEmail(currentUserInfo.userInfo.email);
                setActive(currentUserInfo.userInfo.active);
                setRole(getUserRoleTag(currentUserInfo.userRoles));
            } else {
                setUsername("");
                setName("");
                setEmail("");
                setActive(true);
                setRole(STUDENT_ROLE_TAG);
            }

            setUserInfo(currentUserInfo);
        }

        return currentUserInfo;
    });

    const currentUserUsername = useSelector((state: RootState) => state.user.username);

    const editingHimself = currentUserUsername == currentUserInfo?.userInfo.username;

    const availableRoles = [
        {
            value: TEACHER_ROLE_TAG,
            label: TEACHER_ROLE_NAME,
            disabled: isCreatingUser || isUpdatingUser || isUpdatingUserRoles || editingHimself,
        },
        {
            value: STUDENT_ROLE_TAG,
            label: STUDENT_ROLE_NAME,
            disabled: isCreatingUser || isUpdatingUser || isUpdatingUserRoles || editingHimself,
        }
    ];

    useEffect(() => {
        setUsernameError(false);
        setNameError(false);
        setEmailError(false);
        setPasswordError(false);
        setPasswordConfirmationError(false)
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <IconButton icon="content-save-outline"
                                           size={24}
                                           iconColor={theme.colors.onPrimary}
                                           onPress={saveUser}
                                           disabled={isCreatingUser || isUpdatingUser || isUpdatingUserRoles}/>
        })
    });

    const saveUser = async () => {
        let error = false;

        const realUsername = username.trim();

        error = error || (realUsername.length < 3) || (realUsername.length > 100);
        setUsernameError((realUsername.length < 3) || (realUsername.length > 100));

        const realName = name.trim();

        error = error || (realName.length < 3) || (realName.length > 255);
        setNameError((realName.length < 3) || (realName.length > 255));

        const realEmail = email.trim();

        error = error || (realEmail.length < 3) || (realEmail.length > 255) || (!isEmailValid(realEmail));
        setEmailError((realEmail.length < 3) || (realEmail.length > 255) || (!isEmailValid(realEmail)));

        if ((realEmail.length < 3) || (realEmail.length > 255)) {
            setEmailErrorMessage("O e-mail do usuário deve ter entre 3 e 255 caracteres.");
        } else if (!isEmailValid(realEmail)) {
            setEmailErrorMessage("E-mail inválido.");
        } else {
            setEmailErrorMessage("");
        }

        const realPassword = password.trim();
        const realPasswordConfirmation = passwordConfirmation.trim();

        if (!currentUserInfo) {
            const passwordError = (realPassword.length < 8) || (realPassword.length > 100);
            error = error || passwordError;

            setPasswordError(passwordError);

            if (passwordError) {
                setPasswordErrorMessage("A senha do usuário deve ter entre 8 e 100 caracteres.");
            } else {
                setPasswordErrorMessage("");
            }

            const passwordConfirmationError = (realPasswordConfirmation.length < 8) || (realPasswordConfirmation.length > 100);
            error = error || passwordConfirmationError;

            setPasswordConfirmationError(passwordConfirmationError);

            if (passwordConfirmationError) {
                setPasswordConfirmationErrorMessage("A confirmação da senha do usuário deve ter entre 8 e 100 caracteres.");
            } else {
                setPasswordConfirmationErrorMessage("");
            }

            if (!passwordError && !passwordConfirmationError) {
                if (realPassword != realPasswordConfirmation) {
                    setPasswordConfirmationError(true);
                    setPasswordConfirmationErrorMessage("A senha e a confirmação da senha são diferentes.");
                    error = true;
                } else {
                    setPasswordConfirmationError(false);
                    setPasswordConfirmationErrorMessage("");
                }
            }
        }

        if (!error) {
            if (currentUserInfo) {
                // Updating user
                const userContent = new UserContent(realName, realEmail, active);
                const updatedUser = new UpdateUserRequest(currentUserInfo.userInfo.id, userContent);

                const userRolesContent = new UserRolesContent(
                    (role == ADMIN_ROLE_TAG) || (role == TEACHER_ROLE_TAG),
                    role == TEACHER_ROLE_TAG,
                    role == STUDENT_ROLE_TAG
                );
                const updatedUserRoles = new UpdateUserRolesRequest(currentUserInfo.userInfo.id, userRolesContent);

                try {
                    const newUser = await updateUser(updatedUser).unwrap();

                    const newRoles = await updateUserRoles(updatedUserRoles).unwrap();

                    dispatch(setCurrentEditingUser({
                        userInfo: {
                            id: newUser.id,
                            username: newUser.username,
                            name: newUser.name,
                            email: newUser.email,
                            active: newUser.active
                        },
                        userRoles: {
                            admin: newRoles.admin,
                            teacher: newRoles.teacher,
                            student: newRoles.student,
                        }
                    }));

                    setSnackbarMessage("Usuário atualizado com sucesso.");
                    setShowSnackbar(true);

                    navigation.goBack();

                    dispatch(clearFilters({}));
                } catch (error) {
                    if (error.message) {
                        setSnackbarMessage(error.message);
                    } else {
                        setSnackbarMessage("Ocorreu um erro ao atualizar o usuário. Tente novamente.");
                    }

                    setShowSnackbar(true);
                }
            } else {
                // Creating user
                const isAdmin = (role == ADMIN_ROLE_TAG) || (role == TEACHER_ROLE_TAG);
                const isTeacher = (role == TEACHER_ROLE_TAG);
                const isStudent = (role == STUDENT_ROLE_TAG);

                const newUser = new CreateUserRequest(realUsername, realName, realPassword, realEmail, isAdmin,
                    isTeacher, isStudent);

                try {
                    await createUser(newUser).unwrap();

                    setSnackbarMessage("Usuário criado com sucesso.");
                    setShowSnackbar(true);

                    navigation.goBack();

                    dispatch(clearFilters({}));
                } catch (error) {
                    if (error.message) {
                        setSnackbarMessage(error.message);
                    } else {
                        setSnackbarMessage("Ocorreu um erro ao criar o usuário. Tente novamente.");
                    }

                    setShowSnackbar(true);
                }
            }
        }
    };

    return (
        <View style={styles.container}>
            <TextInput mode="outlined"
                       label="Usuário"
                       inputMode="text"
                       numberOfLines={1}
                       value={username}
                       onChangeText={setUsername}
                       maxLength={100}
                       disabled={isCreatingUser || (currentUserInfo != undefined)}/>
            {usernameError && (<HelperText type="error">
                O nome de usuário deve ter entre 3 e 100 caracteres.
            </HelperText>)}

            <TextInput style={styles.name}
                       mode="outlined"
                       label="Nome"
                       inputMode="text"
                       numberOfLines={1}
                       value={name}
                       onChangeText={setName}
                       maxLength={255}
                       disabled={isCreatingUser || isUpdatingUser || isUpdatingUserRoles}/>
            {nameError && (<HelperText type="error">O nome deve ter entre 3 e 255 caracteres.</HelperText>)}

            <TextInput style={styles.email}
                       mode="outlined"
                       label="E-mail"
                       inputMode="text"
                       numberOfLines={1}
                       value={email}
                       onChangeText={setEmail}
                       maxLength={255}
                       disabled={isCreatingUser || isUpdatingUser || isUpdatingUserRoles}/>
            {emailError && (<HelperText type="error">{emailErrorMessage}</HelperText>)}

            {(!currentUserInfo) && (<TextInput style={styles.password}
                                               mode="outlined"
                                               label="Senha"
                                               inputMode="text"
                                               numberOfLines={1}
                                               value={password}
                                               onChangeText={setPassword}
                                               maxLength={100}
                                               secureTextEntry={!showPassword}
                                               disabled={isCreatingUser}
                                               right={<TextInput.Icon
                                                   icon={!showPassword ? "eye-outline" : "eye-off-outline"}
                                                   onPress={() => setShowPassword(!showPassword)}/>}/>)}
            {passwordError && (<HelperText type="error">{passwordErrorMessage}</HelperText>)}

            {(!currentUserInfo) && (<TextInput style={styles.passwordConfirmation}
                                               mode="outlined"
                                               label="Confirmação da Senha"
                                               inputMode="text"
                                               numberOfLines={1}
                                               value={passwordConfirmation}
                                               onChangeText={setPasswordConfirmation}
                                               maxLength={100}
                                               secureTextEntry={!showPasswordConfirmation}
                                               disabled={isCreatingUser}
                                               right={<TextInput.Icon
                                                   icon={!showPasswordConfirmation ? "eye-outline" : "eye-off-outline"}
                                                   onPress={() => setShowPasswordConfirmation(!showPasswordConfirmation)}/>}/>)}
            {passwordConfirmationError && (<HelperText type="error">{passwordConfirmationErrorMessage}</HelperText>)}

            <Text style={styles.rolesLabel} variant="titleSmall">Papel</Text>

            <SegmentedButtons style={styles.roles} buttons={availableRoles} value={role} multiSelect={false}
                              onValueChange={setRole}/>

            <Snackbar visible={showSnackbar} onDismiss={() => setShowSnackbar(false)}>
                {snackbarMessage}
            </Snackbar>
        </View>);
}

function getUserRoleTag(userRoles: UserRoles | undefined): string {
    let roleTag = STUDENT_ROLE_TAG;

    if (userRoles) {
        if (userRoles.admin || userRoles.teacher) {
            roleTag = TEACHER_ROLE_TAG;
        } else if (userRoles.student) {
            roleTag = STUDENT_ROLE_TAG;
        }
    }

    return roleTag;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    name: {
        marginTop: 8,
    },
    email: {
        marginTop: 8,
    },
    password: {
        marginTop: 8,
    },
    passwordConfirmation: {
        marginTop: 8,
    },
    rolesLabel: {
        marginTop: 12,
    },
    roles: {
        marginTop: 4,
    }
});

export default CreateEditUserScreen;