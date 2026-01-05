import React from "react";
import {Button, Dialog, Portal, Text} from "react-native-paper";

interface Props {
    visible: boolean,
    onDialogClose: () => void
    onDeletePost: () => void
}

const DeletePostConfirmationDialog: React.FC<Props> = ({visible, onDialogClose, onDeletePost}) => {
    return (<Portal>
        <Dialog visible={visible} onDismiss={onDialogClose} dismissable={true}>
            <Dialog.Title>Apagar Postagem</Dialog.Title>
            <Dialog.Content>
                <Text variant="bodyMedium">Deseja apagar a postagem?</Text>
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={onDeletePost}>Apagar</Button>
                <Button onPress={onDialogClose}>Cancelar</Button>
            </Dialog.Actions>
        </Dialog>
    </Portal>);
}

export default DeletePostConfirmationDialog;