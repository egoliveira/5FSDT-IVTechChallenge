import {StyleSheet, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {ActivityIndicator, HelperText, Icon, IconButton, Snackbar, Text, TextInput} from "react-native-paper";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {TeachingGradeResponse} from "../types/teachinggrade/TeachingGradeResponse";
import {
    useLazyTeachingGradeQuery,
    useLazyTeachingLevelQuery,
    useUpdateStudentMutation
} from "../services/schola_blog_api";
import {TeachingLevelResponse} from "../types/teachinglevel/TeachingLevelResponse";
import {useAppTheme} from "./theme";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {FullStudentInfo} from "../types/student/FullStudentInfo";
import {StudentContent, UpdateStudentRequest} from "../types/student/UpdateStudentRequest";
import {clearFilters, setCurrentEditingStudent} from "../redux/slices/StudentSlice";
import {Dropdown} from "react-native-paper-dropdown";

const EditStudentScreen = () => {
    const theme = useAppTheme();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [studentInfo, setStudentInfo] = useState<FullStudentInfo | undefined>(undefined);
    const [teachingLevel, setTeachingLevel] = useState<string | undefined>(undefined);
    const [teachingLevelError, setTeachingLevelError] = useState(false);
    const [availableTeachingGrades, setAvailableTeachingGrades] = useState<TeachingGradeResponse[]>([]);
    const [teachingGrade, setTeachingGrade] = useState<string | undefined>(undefined);
    const [teachingGradeError, setTeachingGradeError] = useState(false);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showSnackbar, setShowSnackbar] = useState(false);

    const [teachingLevelTrigger, {
        data: teachingLevelData,
        isLoading: isLoadingTeachingLevel,
        isFetching: isFetchingTeachingLevel,
        isError: isTeachingLevelError
    }] = useLazyTeachingLevelQuery();

    const [teachingGradeTrigger, {
        data: teachingGradeData,
        isLoading: isLoadingTeachingGrade,
        isFetching: isFetchingTeachingGrade,
        error: teachingGradeFetchError
    }] = useLazyTeachingGradeQuery();

    const [updateStudent, {isLoading: isUpdatingStudent}] = useUpdateStudentMutation();

    const isFirstLoading = isLoadingTeachingLevel || isFetchingTeachingLevel;

    useEffect(() => {
        teachingLevelTrigger(undefined);

        loadTeachingGrades();
    }, [teachingLevelTrigger]);

    useEffect(() => {
        loadTeachingGrades();
    }, [teachingLevel]);

    useSelector((state: RootState) => {
        const currentStudentInfo = state.student.currentEditingStudent;

        if (currentStudentInfo != studentInfo) {
            if (currentStudentInfo) {
                setTeachingLevel(currentStudentInfo.studentInfo.teachingLevelId?.toString());
                setTeachingGrade(currentStudentInfo.studentInfo.teachingGradeId?.toString());
            } else {
                setTeachingLevel(undefined);
                setTeachingGrade(undefined);
            }

            setStudentInfo(currentStudentInfo);
        }
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <IconButton icon="content-save-outline" size={24} iconColor={theme.colors.onPrimary}
                                           onPress={saveStudent}
                                           disabled={isUpdatingStudent || !studentInfo || isLoadingTeachingLevel || isFetchingTeachingLevel || isLoadingTeachingGrade || isFetchingTeachingGrade}/>
        })
    });

    const loadTeachingGrades = async () => {
        if (teachingLevel) {
            try {
                const teachingGrades = await teachingGradeTrigger(parseInt(teachingLevel), true).unwrap();

                setAvailableTeachingGrades(teachingGrades);
            } catch (error) {
                console.log(error);
            }
        } else {
            setAvailableTeachingGrades([]);
        }

        if (teachingGradeFetchError) {
            setSnackbarMessage("Ocorreu um erro ao carregar os anos do nível de ensino selecionado.");
            setShowSnackbar(true);
        }
    }

    const onTeachingLevelSelected = (teachingLevel: string | undefined) => {
        setTeachingGrade(undefined);
        setTeachingLevel(teachingLevel);
    }

    const saveStudent = async () => {
        const realTeachingLevel = teachingLevelData?.find((t) => t.id.toString() === teachingLevel);

        let error = (realTeachingLevel == undefined);
        setTeachingLevelError(realTeachingLevel == undefined);

        const realTeachingGrade = teachingGradeData?.find((t) => t.id.toString() === teachingGrade);

        error = error || (realTeachingGrade == undefined);
        setTeachingGradeError(realTeachingGrade == undefined);

        if (studentInfo && !error) {
            const studentContent = new StudentContent(realTeachingGrade!.id);
            const updatedStudent = new UpdateStudentRequest(studentInfo?.studentInfo.id, studentContent);

            try {
                const newStudent = await updateStudent(updatedStudent).unwrap();

                dispatch(setCurrentEditingStudent({
                    userInfo: {
                        id: newStudent.userId,
                        username: newStudent.user.username,
                        name: newStudent.user.name,
                        email: newStudent.user.email,
                        active: newStudent.user.active
                    },
                    studentInfo: {
                        id: newStudent.id,
                        teachingLevelId: newStudent.teachingGrade?.teachingLevelId,
                        teachingLevelName: newStudent.teachingGrade?.teachingLevel.name,
                        teachingGradeId: newStudent.teachingGradeId,
                        teachingGradeName: newStudent.teachingGrade?.name
                    }
                }));

                setSnackbarMessage("Aluno atualizado com sucesso.");
                setShowSnackbar(true);

                navigation.goBack();

                dispatch(clearFilters({}));
            } catch (error) {
                if (error.message) {
                    setSnackbarMessage(error.message);
                } else {
                    setSnackbarMessage("Ocorreu um erro ao atualizar o aluno. Tente novamente.");
                }
                ;
                setShowSnackbar(true);
            }
        }
    };

    return (
        <View style={styles.container}>
            {((studentInfo) && (!isFirstLoading)) ? (<View>
                <TextInput mode="outlined"
                           label="Usuário"
                           inputMode="text"
                           numberOfLines={1}
                           value={studentInfo.userInfo.username}
                           onChangeText={() => {
                           }}
                           disabled={true}/>

                <View style={styles.name}>
                    <TextInput mode="outlined"
                               label="Nome"
                               inputMode="text"
                               numberOfLines={1}
                               value={studentInfo.userInfo.name}
                               onChangeText={() => {
                               }}
                               disabled={true}/>
                </View>

                <View style={styles.email}>
                    <TextInput mode="outlined"
                               label="E-mail"
                               inputMode="text"
                               numberOfLines={1}
                               value={studentInfo.userInfo.email}
                               onChangeText={() => {
                               }}
                               disabled={true}/>
                </View>

                <View style={styles.active}>
                    <TextInput mode="outlined"
                               label="Ativo"
                               inputMode="text"
                               numberOfLines={1}
                               value={studentInfo.userInfo.active ? "Sim" : "Não"}
                               onChangeText={() => {
                               }}
                               disabled={true}/>
                </View>

                <View style={styles.teachingLevel}>
                    <Dropdown mode="outlined" label="Nível"
                              options={getTeachingLevels(teachingLevelData)} value={teachingLevel}
                              onSelect={onTeachingLevelSelected}
                              disabled={isFetchingTeachingGrade || isLoadingTeachingGrade || isUpdatingStudent}/>
                    {teachingLevelError && (<HelperText type="error">
                        Selecione o nível de ensino ao qual o aluno pertence.
                    </HelperText>)}
                </View>

                <View style={styles.teachingGrade}>
                    <Dropdown mode="outlined" label="Ano"
                              options={getTeachingGrades(availableTeachingGrades)} value={teachingGrade}
                              onSelect={setTeachingGrade}
                              disabled={isFetchingTeachingGrade || isLoadingTeachingGrade || isUpdatingStudent}/>
                    {teachingGradeError && (<HelperText type="error">
                        Selecione o ano de ensino ao qual o aluno pertence.
                    </HelperText>)}
                </View>
            </View>) : null}

            {(!studentInfo) || (isFirstLoading) || (teachingLevelError) ? (
                <View style={styles.loadingErrorContainer}>
                    {(!isFirstLoading && teachingLevelError) ? (<View>
                        <Icon source="alert-circle-outline" size={64}/>
                        <Text variant="bodyLarge" style={styles.errorText}>
                            Ocorreu um erro ao carregar as informações do aluno.
                        </Text>
                    </View>) : null}

                    {((!studentInfo) || (isFirstLoading)) ? (<ActivityIndicator size="large"/>) : null}
                </View>
            ) : null}

            <Snackbar visible={showSnackbar} onDismiss={() => setShowSnackbar(false)}>
                {snackbarMessage}
            </Snackbar>
        </View>);
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
    container: {
        flex: 1,
        padding: 16,
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
    teachingLevel: {
        marginTop: 8
    },
    teachingGrade: {
        marginTop: 8,
        paddingBottom: 24
    },
    errorText: {
        marginTop: 8,
        textAlign: "center",
        width: '100%',
        marginHorizontal: 16
    },
});

export default EditStudentScreen;