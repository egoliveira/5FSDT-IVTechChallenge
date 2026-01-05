import React, {useEffect, useState} from "react";
import {Button, Dialog, HelperText, Portal, TextInput} from "react-native-paper";
import {Dropdown} from "react-native-paper-dropdown";
import {StyleSheet, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {setFilters} from "../redux/slices/UserSlice";
import {USER_ROLES} from "../types/roles/UserRoles";
import {isStringFilterValid} from "../util/filters";

interface Props {
    visible: boolean,
    onDialogClose: () => void
}

const UsersFilterDialog: React.FC<Props> = ({visible, onDialogClose}) => {
    const dispatch = useDispatch();

    const [lastFiltersUpdateTimestamp, setLastFiltersUpdateTimestamp] = useState<number>(0);

    const filtersState = useSelector((state: RootState) => {
        if (lastFiltersUpdateTimestamp != state.user.filtersState.lastUpdated) {
            setLastFiltersUpdateTimestamp(state.user.filtersState.lastUpdated);
        }

        return state.user.filtersState;
    });

    const [username, setUsername] = useState<string | undefined>(undefined);
    const [usernameError, setUsernameError] = useState<boolean>(false);
    const [name, setName] = useState<string | undefined>(undefined);
    const [nameError, setNameError] = useState<boolean>(false);
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [emailError, setEmailError] = useState<boolean>(false);
    const [active, setActive] = useState<string | undefined>(undefined);
    const [userRole, setUserRole] = useState<string | undefined>(undefined);

    const availableActiveFlags = [
        {value: "true", label: "Sim"},
        {value: "false", label: "Não"},
    ]

    const availableUserRoles = USER_ROLES.map((userRole) => {
            return {
                value: userRole.tag,
                label: userRole.name
            }
        }
    );

    useEffect(() => {
        setUsername(filtersState.username);
        setName(filtersState.name);
        setEmail(filtersState.email);
        setActive(filtersState.active?.toString());
        setUserRole(filtersState.userRole);

        setUsernameError(false);
        setNameError(false);
        setEmailError(false);
    }, [lastFiltersUpdateTimestamp]);

    const clearFilters = () => {
        setUsername(undefined);
        setName(undefined);
        setEmail(undefined);
        setActive(undefined);
        setUserRole(undefined);

        setUsernameError(false);
        setNameError(false);
        setEmailError(false);
    }

    const cancel = () => {
        setUsername(filtersState.username);
        setName(filtersState.name);
        setEmail(filtersState.email);
        setActive(filtersState.active?.toString());
        setUserRole(filtersState.userRole);

        setUsernameError(false);
        setNameError(false);
        setEmailError(false);

        onDialogClose();
    }

    const isFiltersChanged = () => {
        return (username?.trim() != filtersState.username) || (name?.trim() != filtersState.name) ||
            (email?.trim() != filtersState.email) || (active != filtersState.active?.toString()) ||
            (userRole != filtersState.userRole);
    }

    const applyFilters = () => {
        const isUsernameValid = isStringFilterValid(username, 2);
        const isNameValid = isStringFilterValid(name, 2);
        const isEmailValid = isStringFilterValid(email, 2);

        setUsernameError(!isUsernameValid);
        setNameError(!isNameValid);
        setEmailError(!isEmailValid);

        if (isUsernameValid && isNameValid && isEmailValid) {
            if (isFiltersChanged()) {
                dispatch(setFilters({
                    username: username?.trim(),
                    name: name?.trim(),
                    email: email?.trim(),
                    active: active,
                    userRole: userRole
                }));
            }

            onDialogClose();
        }
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={cancel} dismissable={true}>
                <Dialog.Title>Filtrar Usuários</Dialog.Title>
                <Dialog.Content>
                    <View>
                        <TextInput mode="outlined" label="Usuário" maxLength={100} inputMode="text"
                                   numberOfLines={1} value={username} onChangeText={setUsername}/>
                        {usernameError && (
                            <HelperText type="error">O filtro de usuário deve ter ao menos 2 caracteres.</HelperText>)}

                        <View style={styles.name}>
                            <TextInput mode="outlined" label="Nome" maxLength={255} inputMode="text"
                                       numberOfLines={1} value={name} onChangeText={setName}/>
                            {nameError && (
                                <HelperText type="error">O filtro de nome deve ter ao menos 2 caracteres.</HelperText>)}
                        </View>
                        <View style={styles.email}>
                            <TextInput mode="outlined" label="E-mail" maxLength={255} inputMode="text"
                                       numberOfLines={1} value={email} onChangeText={setEmail}/>
                            {emailError && (
                                <HelperText type="error">O filtro de e-mail deve ter ao menos 2
                                    caracteres.</HelperText>)}
                        </View>
                        <View style={styles.active}>
                            <Dropdown mode="outlined" label="Ativo"
                                      options={availableActiveFlags} value={active}
                                      onSelect={setActive}
                            />
                        </View>
                        <View style={styles.userRole}>
                            <Dropdown mode="outlined" label="Papel"
                                      options={availableUserRoles} value={userRole}
                                      onSelect={setUserRole}/>
                        </View>
                    </View>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={clearFilters}>Limpar</Button>
                    <Button onPress={applyFilters} disabled={!isFiltersChanged()}>Aplicar</Button>
                    <Button onPress={cancel}>Cancelar</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    name: {
        marginTop: 8,
    },
    email: {
        marginTop: 8,
    },
    active: {
        marginTop: 8,
    },
    userRole: {
        marginTop: 8,
    },
});

export default UsersFilterDialog;