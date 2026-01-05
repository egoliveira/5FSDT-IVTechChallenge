import React, {useEffect, useState} from "react";
import {Button, Dialog, Portal, RadioButton, Text} from "react-native-paper";
import {Dropdown} from "react-native-paper-dropdown";
import {StyleSheet, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {SortOrder} from "../types/common/SortOrder";
import {StudentListSortField} from "../types/student/StudentListSortField";
import {setSort} from "../redux/slices/StudentSlice";

interface Props {
    visible: boolean,
    onDialogClose: () => void
}

const StudentsSortDialog: React.FC<Props> = ({visible, onDialogClose}) => {
    const dispatch = useDispatch();

    const [lastFiltersUpdateTimestamp, setLastFiltersUpdateTimestamp] = useState<number>(0);

    const filtersState = useSelector((state: RootState) => {
        if (lastFiltersUpdateTimestamp != state.student.filtersState.lastUpdated) {
            setLastFiltersUpdateTimestamp(state.student.filtersState.lastUpdated);
        }

        return state.student.filtersState;
    });

    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<string>(SortOrder.ASC);

    const availableSortByFields = [
        {
            value: StudentListSortField.NAME,
            label: "Nome"
        },
        {
            value: StudentListSortField.TEACHING_LEVEL,
            label: "Nível"
        },
        {
            value: StudentListSortField.TEACHING_GRADE,
            label: "Ano"
        },
    ];

    useEffect(() => {
        setSortBy(filtersState.sortBy);
        setSortOrder(filtersState.sortOrder);
    }, [lastFiltersUpdateTimestamp]);

    const clearFilters = () => {
        setSortBy(undefined);
        setSortOrder(SortOrder.ASC);
    }

    const cancel = () => {
        setSortBy(filtersState.sortBy);
        setSortOrder(filtersState.sortOrder);

        onDialogClose();
    }

    const isFiltersChanged = () => {
        return (sortBy != filtersState.sortBy) || (sortOrder != filtersState.sortOrder);
    }

    const applyFilters = () => {
        if (isFiltersChanged()) {
            dispatch(setSort({
                sortBy: sortBy,
                sortOrder: sortOrder
            }));
        }

        onDialogClose();
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDialogClose} dismissable={true}>
                <Dialog.Title>Ordenar Alunos</Dialog.Title>
                <Dialog.Content>
                    <View>
                        <Dropdown mode="outlined" label="Ordernar por"
                                  options={availableSortByFields} value={sortBy}
                                  onSelect={setSortBy}/>
                        <View style={styles.sortOrder}>
                            <RadioButton.Group onValueChange={setSortOrder} value={sortOrder}>
                                <View style={styles.sortOrderAsc}>
                                    <RadioButton value={SortOrder.ASC} disabled={sortBy == undefined}/>
                                    <Text variant="bodyLarge" disabled={sortBy == undefined}>Ascendente</Text>
                                </View>
                                <View style={styles.sortOrderDesc}>
                                    <RadioButton value={SortOrder.DESC} disabled={sortBy == undefined}/>
                                    <Text variant="bodyLarge" disabled={sortBy == undefined}>Descendente</Text>
                                </View>
                            </RadioButton.Group>
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
    sortOrder: {
        marginTop: 12,
    },
    sortOrderAsc: {
        flexDirection: "row",
        alignItems: 'center',
    },
    sortOrderDesc: {
        flexDirection: "row",
        alignItems: 'center',
    },
});

export default StudentsSortDialog;