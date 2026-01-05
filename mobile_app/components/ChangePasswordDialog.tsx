import React, {useState} from "react";
import {Button, Dialog, HelperText, Portal, TextInput} from "react-native-paper";
import {StyleSheet, View} from "react-native";

interface Props {
    visible: boolean,
    onPasswordChange: (password: string) => void,
    onDialogClose: () => void
}

const ChangePasswordDialog: React.FC<Props> = ({visible, onPasswordChange, onDialogClose}) => {
    const [password, setPassword] = useState<string>("");
    const [showPassword, setShowPassword] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [passwordConfirmationError, setPasswordConfirmationError] = useState(false);
    const [passwordConfirmationErrorMessage, setPasswordConfirmationErrorMessage] = useState("");

    const reset = () => {
        setPassword("");
        setShowPassword(false);
        setPasswordError(false);
        setPasswordErrorMessage("");
        setPasswordConfirmation("");
        setShowPasswordConfirmation(false);
        setPasswordConfirmationError(false);
        setPasswordConfirmationErrorMessage("");
    };

    const changePassword = () => {
        const realPassword = password.trim();
        const realPasswordConfirmation = passwordConfirmation.trim();

        const passwordError = (realPassword.length < 8) || (realPassword.length > 100);

        setPasswordError(passwordError);

        if (passwordError) {
            setPasswordErrorMessage("A senha do usuário deve ter entre 8 e 100 caracteres.");
        } else {
            setPasswordErrorMessage("");
        }

        const passwordConfirmationError = (realPasswordConfirmation.length < 8) || (realPasswordConfirmation.length > 100);

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
            } else {
                setPasswordConfirmationError(false);
                setPasswordConfirmationErrorMessage("");

                reset();
                onPasswordChange(realPassword);
            }
        }
    };

    const cancel = () => {
        reset();
        onDialogClose();
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={cancel} dismissable={true}>
                <Dialog.Title>Alterar Senha</Dialog.Title>
                <Dialog.Content>
                    <View>
                        <TextInput mode="outlined"
                                   label="Senha"
                                   inputMode="text"
                                   numberOfLines={1}
                                   value={password}
                                   onChangeText={setPassword}
                                   maxLength={100}
                                   secureTextEntry={!showPassword}
                                   right={<TextInput.Icon
                                       icon={!showPassword ? "eye-outline" : "eye-off-outline"}
                                       onPress={() => setShowPassword(!showPassword)}/>}/>
                        {passwordError && (<HelperText type="error">{passwordErrorMessage}</HelperText>)}

                        <TextInput style={styles.passwordConfirmation}
                                   mode="outlined"
                                   label="Confirmação da Senha"
                                   inputMode="text"
                                   numberOfLines={1}
                                   value={passwordConfirmation}
                                   onChangeText={setPasswordConfirmation}
                                   maxLength={100}
                                   secureTextEntry={!showPasswordConfirmation}
                                   right={<TextInput.Icon
                                       icon={!showPasswordConfirmation ? "eye-outline" : "eye-off-outline"}
                                       onPress={() => setShowPasswordConfirmation(!showPasswordConfirmation)}/>}/>
                        {passwordConfirmationError && (
                            <HelperText type="error">{passwordConfirmationErrorMessage}</HelperText>)}
                    </View>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={changePassword}>Alterar</Button>
                    <Button onPress={cancel}>Cancelar</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    passwordConfirmation: {
        marginTop: 8,
    },
});

export default ChangePasswordDialog;