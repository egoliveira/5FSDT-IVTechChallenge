import React, {useEffect, useState} from "react";
import {ActivityIndicator, Button, Dialog, HelperText, Portal, Snackbar, Text, TextInput} from "react-native-paper";
import {Dropdown} from "react-native-paper-dropdown";
import {
    useLazySubjectQuery,
    useLazyTeacherQuery,
    useLazyTeachingGradeQuery,
    useLazyTeachingLevelQuery
} from "../services/schola_blog_api";
import {StyleSheet, View} from "react-native";
import {SubjectResponse} from "../types/subject/SubjectResponse";
import {TeachingLevelResponse} from "../types/teachinglevel/TeachingLevelResponse";
import {TeachingGradeResponse} from "../types/teachinggrade/TeachingGradeResponse";
import {UserResponse} from "../types/user/UserResponse";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {setFilters} from "../redux/slices/PostSlice";
import {isStringFilterValid} from "../util/filters";

interface Props {
    visible: boolean,
    onDialogClose: () => void
}

const PostsFilterDialog: React.FC<Props> = ({visible, onDialogClose}) => {
    const dispatch = useDispatch();

    const [lastFiltersUpdateTimestamp, setLastFiltersUpdateTimestamp] = useState<number>(0);

    const filtersState = useSelector((state: RootState) => {
        if (lastFiltersUpdateTimestamp != state.post.filtersState.lastUpdated) {
            setLastFiltersUpdateTimestamp(state.post.filtersState.lastUpdated);
        }

        return state.post.filtersState;
    });

    const [titleOrContent, setTitleOrContent] = useState<string | undefined>(undefined);
    const [titleOrContentError, setTitleOrContentError] = useState<boolean>(false);
    const [subject, setSubject] = useState<string | undefined>(undefined);
    const [teachingLevel, setTeachingLevel] = useState<string | undefined>(undefined);
    const [availableTeachingGrades, setAvailableTeachingGrades] = useState<TeachingGradeResponse[]>([]);
    const [teachingGrade, setTeachingGrade] = useState<string | undefined>(undefined);
    const [teacher, setTeacher] = useState<string | undefined>(undefined);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showSnackbar, setShowSnackbar] = useState(false);

    const [subjectTrigger, {
        data: subjectData,
        isLoading: isLoadingSubject,
        isFetching: isFetchingSubject,
        isError: isSubjectError
    }] = useLazySubjectQuery();

    const [teachingLevelTrigger, {
        data: teachingLevelData,
        isLoading: isLoadingTeachingLevel,
        isFetching: isFetchingTeachingLevel,
        isError: isTeachingLevelError
    }] = useLazyTeachingLevelQuery();

    const [teachingGradeTrigger, {
        data: teachingGradeData,
        isError: isTeachingGradeError
    }] = useLazyTeachingGradeQuery();

    const [teacherTrigger, {
        data: teacherData,
        isLoading: isLoadingTeacher,
        isFetching: isFetchingTeacher,
        isError: isTeacherError
    }] = useLazyTeacherQuery();

    const isFirstLoading = isLoadingSubject || isFetchingSubject || isLoadingTeachingLevel ||
        isFetchingTeachingLevel || isLoadingTeacher || isFetchingTeacher;
    const isError = isSubjectError || isTeachingLevelError || isTeacherError;

    useEffect(() => {
        setTitleOrContent(filtersState.fullContent);
        setSubject(filtersState.subject?.id?.toString());
        setTeachingLevel(filtersState.teachingLevel?.id?.toString());
        setTeachingGrade(filtersState.teachingGrade?.id?.toString());
        setTeacher(filtersState.teacher?.id?.toString());
    }, [lastFiltersUpdateTimestamp]);

    useEffect(() => {
        subjectTrigger(undefined);
        teachingLevelTrigger(undefined);

        loadTeachingGrades();

        teacherTrigger(undefined);
    }, [subjectTrigger, teachingLevelTrigger, teacherTrigger]);

    useEffect(() => {
        loadTeachingGrades();
    }, [teachingLevel]);

    const loadTeachingGrades = async () => {
        if (teachingLevel) {
            const teachingGrades = await teachingGradeTrigger(parseInt(teachingLevel), true).unwrap();

            setAvailableTeachingGrades(teachingGrades);
        } else {
            setAvailableTeachingGrades([]);
        }

        if (isTeachingGradeError) {
            setSnackbarMessage("Ocorreu um erro ao carregar os anos do nível de ensino selecionado.");
            setShowSnackbar(true);
        }
    }

    const onTeachingLevelSelected = (teachingLevel: string | undefined) => {
        setTeachingGrade(undefined);
        setTeachingLevel(teachingLevel);
    }

    const clearFilters = () => {
        setTitleOrContent(undefined);
        setSubject(undefined);
        setTeachingLevel(undefined);
        setTeachingGrade(undefined);
        setTeacher(undefined);

        setTitleOrContentError(false);
    }

    const cancel = () => {
        setTitleOrContent(filtersState.fullContent);
        setSubject(filtersState.subject?.id?.toString());
        setTeachingLevel(filtersState.teachingLevel?.id?.toString());
        setTeachingGrade(filtersState.teachingGrade?.id?.toString());
        setTeacher(filtersState.teacher?.id?.toString());

        setTitleOrContentError(false);

        onDialogClose();
    }

    const isFiltersChanged = () => {
        const subjectItem = subjectData?.find((s) => s.id.toString() === subject);
        const teachingLevelItem = teachingLevelData?.find((t) => t.id.toString() === teachingLevel);
        const teachingGradeItem = teachingGradeData?.find((t) => t.id.toString() === teachingGrade);
        const teacherItem = teacherData?.find((t) => t.id.toString() === teacher);

        return (titleOrContent?.trim() != filtersState.fullContent) || (subjectItem != filtersState.subject) ||
            (teachingLevelItem != filtersState.teachingLevel) || (teachingGradeItem != filtersState.teachingGrade) ||
            (teacherItem != filtersState.teacher);
    }

    const applyFilters = () => {
        const isTitleOrContentValid = isStringFilterValid(titleOrContent, 2);

        setTitleOrContentError(!isTitleOrContentValid);

        if (isTitleOrContentValid) {
            if (isFiltersChanged()) {
                const subjectItem = subjectData?.find((s) => s.id.toString() === subject);
                const teachingLevelItem = teachingLevelData?.find((t) => t.id.toString() === teachingLevel);
                const teachingGradeItem = teachingGradeData?.find((t) => t.id.toString() === teachingGrade);
                const teacherItem = teacherData?.find((t) => t.id.toString() === teacher);

                dispatch(setFilters({
                    fullContent: titleOrContent?.trim(),
                    subject: subjectItem,
                    teachingLevel: teachingLevelItem,
                    teachingGrade: teachingGradeItem,
                    teacher: teacherItem
                }));
            }

            onDialogClose();
        }
    }

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={cancel} dismissable={true}>
                <Dialog.Title>Filtrar Postagens</Dialog.Title>
                <Dialog.Content>
                    {!isFirstLoading && !isError && (<View>
                        <TextInput mode="outlined" label="Título ou Conteúdo" maxLength={64} inputMode="text"
                                   numberOfLines={1} value={titleOrContent} onChangeText={setTitleOrContent}/>
                        {titleOrContentError && (
                            <HelperText type="error">O filtro de título ou conteúdo deve ter ao menos 2 caracteres.
                            </HelperText>)}

                        <View style={styles.subject}>
                            <Dropdown mode="outlined" label="Matéria"
                                      options={getSubjects(subjectData)} value={subject}
                                      onSelect={setSubject}/>
                        </View>
                        <View style={styles.teachingLevel}>
                            <Dropdown mode="outlined" label="Nível"
                                      options={getTeachingLevels(teachingLevelData)} value={teachingLevel}
                                      onSelect={onTeachingLevelSelected}/>
                        </View>
                        <View style={styles.teachingGrade}>
                            <Dropdown mode="outlined" label="Ano"
                                      options={getTeachingGrades(availableTeachingGrades)} value={teachingGrade}
                                      onSelect={setTeachingGrade}
                            />
                        </View>
                        <View style={styles.teacher}>
                            <Dropdown mode="outlined" label="Professor"
                                      options={getTeachers(teacherData)} value={teacher}
                                      onSelect={setTeacher}/>
                        </View>
                    </View>)}

                    {!isFirstLoading && isError && (
                        <Text variant="bodyMedium">Ocorreu um erro ao carregar os filtros de postagens.</Text>)}

                    {isFirstLoading && (<ActivityIndicator size="large"/>)}
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={clearFilters} disabled={isError}>Limpar</Button>
                    <Button onPress={applyFilters} disabled={isError || !isFiltersChanged()}>Aplicar</Button>
                    <Button onPress={cancel}>Cancelar</Button>
                </Dialog.Actions>
            </Dialog>

            <Snackbar visible={showSnackbar} onDismiss={() => setShowSnackbar(false)}>
                {snackbarMessage}
            </Snackbar>
        </Portal>
    );
}

const getSubjects = (subjectsResponse: SubjectResponse[] | undefined) => {
    return subjectsResponse?.map((subject: SubjectResponse) => {
        return {value: subject.id.toString(), label: subject.name}
    }) || [];
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

const getTeachers = (teachersResponse: UserResponse[] | undefined) => {
    return teachersResponse?.map((teacher: UserResponse) => {
        return {value: teacher.id.toString(), label: teacher.name}
    }) || [];
}

const styles = StyleSheet.create({
    subject: {
        marginTop: 8,
    },
    teachingLevel: {
        marginTop: 8,
    },
    teachingGrade: {
        marginTop: 8,
    },
    teacher: {
        marginTop: 8,
    },
});

export default PostsFilterDialog;