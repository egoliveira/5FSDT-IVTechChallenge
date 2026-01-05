import React from "react";
import {Button, Dialog, Portal, Text} from "react-native-paper";
import {View} from "react-native";
import {useSelector} from "react-redux";
import {RootState} from "../redux/store";

interface Props {
    visible: boolean,
    onActivateOrDeactivateUser: () => void,
    onDialogClose: () => void
}

const ActivateDeactivateUserDialog: React.FC<Props> = ({visible, onActivateOrDeactivateUser, onDialogClose}) => {
    const currentUser = useSelector((state: RootState) => state.user.currentEditingUser);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDialogClose} dismissable={true}>
                <Dialog.Title>{currentUser?.userInfo.active ? "Desativar Usuário" : "Ativar Usuário"}</Dialog.Title>
                <Dialog.Content>
                    <View>
                        <Text variant="bodyMedium">
                            {currentUser?.userInfo.active ? "Deseja desativar o usuário?" : "Deseja ativar o usuário?"}
                        </Text>
                    </View>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onActivateOrDeactivateUser}>
                        {currentUser?.userInfo.active ? "Desativar" : "Ativar"}
                    </Button>
                    <Button onPress={onDialogClose}>Cancelar</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

export default ActivateDeactivateUserDialog;