import React, {useEffect, useState} from "react";
import {ActivityIndicator, Button, Dialog, HelperText, Portal, Snackbar, Text, TextInput} from "react-native-paper";
import {Dropdown} from "react-native-paper-dropdown";
import {StyleSheet, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {TeachingLevelResponse} from "../types/teachinglevel/TeachingLevelResponse";
import {TeachingGradeResponse} from "../types/teachinggrade/TeachingGradeResponse";
import {useLazyTeachingGradeQuery, useLazyTeachingLevelQuery} from "../services/schola_blog_api";
import {setFilters} from "../redux/slices/StudentSlice";
import {isStringFilterValid} from "../util/filters";

interface Props {
    visible: boolean,
    onDialogClose: () => void
}

const StudentsFilterDialog: React.FC<Props> = ({visible, onDialogClose}) => {
    const dispatch = useDispatch();

    const [lastFiltersUpdateTimestamp, setLastFiltersUpdateTimestamp] = useState<number>(0);

    const filtersState = useSelector((state: RootState) => {
        if (lastFiltersUpdateTimestamp != state.student.filtersState.lastUpdated) {
            setLastFiltersUpdateTimestamp(state.student.filtersState.lastUpdated);
        }

        return state.student.filtersState;
    });

    const [name, setName] = useState<string | undefined>(undefined);
    const [nameError, setNameError] = useState<boolean>(false);
    const [teachingLevelId, setTeachingLevelId] = useState<string | undefined>(undefined);
    const [availableTeachingGrades, setAvailableTeachingGrades] = useState<TeachingGradeResponse[]>([]);
    const [teachingGradeId, setTeachingGradeId] = useState<string | undefined>(undefined);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showSnackbar, setShowSnackbar] = useState(false);

    const [teachingLevelTrigger, {
        data: teachingLevelData,
        isLoading: isLoadingTeachingLevel,
        isFetching: isFetchingTeachingLevel,
        error: teachingLevelError
    }] = useLazyTeachingLevelQuery();

    const [teachingGradeTrigger, {
        error: teachingGradeError
    }] = useLazyTeachingGradeQuery();

    useEffect(() => {
        setName(filtersState.name);
        setTeachingLevelId(filtersState.teachingLevelId?.toString());
        setTeachingGradeId(filtersState.teachingGradeId?.toString());

        setNameError(false);
    }, [lastFiltersUpdateTimestamp]);

    const clearFilters = () => {
        setName(undefined);
        setTeachingLevelId(undefined);
        setTeachingGradeId(undefined);

        setNameError(false);
    }

    const cancel = () => {
        setName(filtersState.name);
        setTeachingLevelId(filtersState.teachingLevelId?.toString());
        setTeachingGradeId(filtersState.teachingGradeId?.toString());

        setNameError(false);

        onDialogClose();
    }

    const isFiltersChanged = () => {
        return (name?.trim() != filtersState.name) ||
            (teachingLevelId != filtersState.teachingLevelId?.toString()) ||
            (teachingGradeId != filtersState.teachingGradeId?.toString());
    }

    const applyFilters = () => {
        const isNameValid = isStringFilterValid(name, 2);

        setNameError(!isNameValid);

        if (isNameValid) {
            if (isFiltersChanged()) {
                dispatch(setFilters({
                    name: name?.trim(),
                    teachingLevelId: teachingLevelId ? parseInt(teachingLevelId) : undefined,
                    teachingGradeId: teachingGradeId ? parseInt(teachingGradeId) : undefined
                }));
            }

            onDialogClose();
        }
    }

    const onTeachingLevelSelected = (teachingLevel: string | undefined) => {
        setTeachingGradeId(undefined);
        setTeachingLevelId(teachingLevel);
    }

    const loadTeachingGrades = async () => {
        if (teachingLevelId) {
            const teachingGrades = await teachingGradeTrigger(parseInt(teachingLevelId), true).unwrap();

            setAvailableTeachingGrades(teachingGrades);
        } else {
            setAvailableTeachingGrades([]);
        }

        if (teachingGradeError) {
            setSnackbarMessage("Ocorreu um erro ao carregar os anos do nível de ensino selecionado.");
            setShowSnackbar(true);
        }
    }

    useEffect(() => {
        teachingLevelTrigger(undefined);

        loadTeachingGrades();

    }, [teachingLevelTrigger]);

    useEffect(() => {
        loadTeachingGrades();
    }, [teachingLevelId]);

    const dataLoaded = (!isLoadingTeachingLevel) && (!isFetchingTeachingLevel) && (!teachingLevelError);

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={cancel} dismissable={true}>
                <Dialog.Title>Filtrar Alunos</Dialog.Title>
                <Dialog.Content>
                    {(dataLoaded) && (<View>
                        <TextInput mode="outlined" label="Nome" maxLength={255} inputMode="text"
                                   numberOfLines={1} value={name} onChangeText={setName}/>
                        {nameError && (
                            <HelperText type="error">O filtro de nome deve ter ao menos 2 caracteres.</HelperText>)}
                        <View style={styles.teachingLevel}>
                            <Dropdown mode="outlined" label="Nível"
                                      options={getTeachingLevels(teachingLevelData)} value={teachingLevelId}
                                      onSelect={onTeachingLevelSelected}/>
                        </View>
                        <View style={styles.teachingGrade}>
                            <Dropdown mode="outlined" label="Ano"
                                      options={getTeachingGrades(availableTeachingGrades)} value={teachingGradeId}
                                      onSelect={setTeachingGradeId}
                            />
                        </View>
                    </View>)}

                    {teachingLevelError && (
                        <Text variant="bodyMedium">Ocorreu um erro ao carregar os filtros de alunos.</Text>)}

                    {(isLoadingTeachingLevel || isFetchingTeachingLevel) && (<ActivityIndicator size="large"/>)}
                </Dialog.Content>
                <Dialog.Actions>
                    {(dataLoaded) && (<Button onPress={clearFilters}>Limpar</Button>)}
                    {(dataLoaded) && (<Button onPress={applyFilters} disabled={!isFiltersChanged()}>Aplicar</Button>)}
                    <Button onPress={cancel}>Cancelar</Button>
                </Dialog.Actions>
            </Dialog>

            <Snackbar visible={showSnackbar} onDismiss={() => setShowSnackbar(false)}>
                {snackbarMessage}
            </Snackbar>
        </Portal>
    );
}

const getTeachingLevels = (teachingLevelsResponse: TeachingLevelResponse[] | undefined) => {
    return teachingLevelsResponse?.map((teachingLevel: TeachingLevelResponse) => {
        return {value: teachingLevel.id.toString(), label: teachingLevel.name}
    }) || [];
}

const getTeachingGrades = (teachingGradesResponse: TeachingGradeResponse[] | undefined) => {
    return teachingGradesResponse?.map((teachingGrade: TeachingGradeResponse) => {
        return {value: teachingGrade.id.toString(), label: teachingGrade.name}
    }) || [];
}

const styles = StyleSheet.create({
    teachingLevel: {
        marginTop: 8,
    },
    teachingGrade: {
        marginTop: 8,
    },
});

export default StudentsFilterDialog;