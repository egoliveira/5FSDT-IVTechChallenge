import {StyleSheet, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {useNavigation} from "@react-navigation/native";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {ActivityIndicator, Badge, Button, DataTable, Icon, IconButton, MD3Colors, Text} from "react-native-paper";
import {setFilterPage} from "../redux/slices/UserSlice";
import {useAppTheme} from "./theme";
import {SortOrder, stringToSortOrderField} from "../types/common/SortOrder";
import {StudentListRequestParams} from "../types/student/StudentListRequestParams";
import {useLazyStudentsQuery} from "../services/schola_blog_api";
import {StudentListResponse} from "../types/student/StudentListResponse";
import {stringToStudentListSortField, StudentListSortField} from "../types/student/StudentListSortField";
import {setShowStudentsFilters, setShowStudentsSort} from "../redux/slices/StudentSlice";
import {StudentResponse} from "../types/student/StudentResponse";
import StudentsFilterDialog from "../components/StudentsFilterDialog";
import StudentsSortDialog from "../components/StudentsSortDialog";

const StudentsScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const theme = useAppTheme();

    const initialParams: StudentListRequestParams = {
        name: undefined,
        email: undefined,
        teachingLevelId: undefined,
        teachingGradeId: undefined,
        sortBy: undefined,
        sortOrder: undefined,
        page: 0,
        pageSize: 10
    };

    const [requestParams, setRequestParams] = useState<StudentListRequestParams>(initialParams);

    const [trigger, {data, isLoading, isFetching, error}] = useLazyStudentsQuery();

    const showStudentsFilters = useSelector((state: RootState) => state.student.showStudentsFilters);
    const showStudentsSort = useSelector((state: RootState) => state.student.showStudentsSort);
    const [studentsFiltersCount, setStudentsFiltersCount] = useState(0);
    const [sortOrderEnabled, setSortOrderEnabled] = useState(false);
    const [lastFiltersUpdateTimestamp, setLastFiltersUpdateTimestamp] = useState<number>(0);

    const students = data || new StudentListResponse([], 0, 10, 0);
    const numberOfPages = Math.ceil(students.total / students.pageSize);
    const displayCurrentPage = students.page + 1;

    const reloadStudents = () => {
        trigger(requestParams);
    }

    useEffect(() => {
        reloadStudents();
    }, [trigger]);

    useEffect(() => {
        if (!isLoading && !isFetching) {
            trigger(requestParams, false);
        }
    }, [lastFiltersUpdateTimestamp]);

    useSelector((state: RootState) => {
        const filtersState = state.student.filtersState;
        const lastUpdated = filtersState.lastUpdated;

        if (lastFiltersUpdateTimestamp != lastUpdated) {
            let name = undefined;
            let email = undefined;

            let count = 0;

            if (filtersState.name && (filtersState.name.trim().length > 1)) {
                name = filtersState.name.trim();
                count++;
            }

            if (filtersState.teachingLevelId !== undefined) {
                count++;
            }

            if (filtersState.teachingGradeId !== undefined) {
                count++;
            }

            let sortBy: StudentListSortField | undefined = undefined;
            let sortOrder: SortOrder | undefined = undefined;

            if (filtersState.sortBy != undefined) {
                sortBy = stringToStudentListSortField(filtersState.sortBy);
                sortOrder = stringToSortOrderField(filtersState.sortOrder);
            }

            const params: StudentListRequestParams = {
                name: name,
                email: email,
                teachingLevelId: filtersState.teachingLevelId,
                teachingGradeId: filtersState.teachingGradeId,
                sortBy: sortBy,
                sortOrder: sortOrder,
                page: filtersState.page,
                pageSize: 10
            };

            setRequestParams(params);

            if (count != studentsFiltersCount) {
                setStudentsFiltersCount(count);
            }

            setSortOrderEnabled(filtersState.sortBy != undefined);

            setLastFiltersUpdateTimestamp(lastUpdated);
        }
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (<View style={styles.studentsActionsContainer}>
                <View style={styles.studentsSortContainer}>
                    <IconButton icon="sort-variant" iconColor={theme.colors.onPrimary} size={24}
                                onPress={() => dispatch(setShowStudentsSort(true))}
                                disabled={(isLoading || isFetching)}/>
                    {(sortOrderEnabled) && (
                        <Badge
                            style={[styles.studentsSortBadge, {backgroundColor: theme.colors.error}]}
                            size={15}>!</Badge>
                    )}
                </View>
                <View style={styles.studentsFilterContainer}>
                    <IconButton icon="filter-outline" iconColor={theme.colors.onPrimary} size={24}
                                onPress={() => dispatch(setShowStudentsFilters(true))}
                                disabled={(isLoading || isFetching)}/>
                    {(studentsFiltersCount > 0) && (
                        <Badge
                            style={[styles.studentsFilterBadge, {backgroundColor: theme.colors.error}]}
                            size={15}>{studentsFiltersCount}</Badge>
                    )}
                </View>
            </View>)
        })
    });

    useSelector((state: RootState) => {
        if (!state.user.isTeacher) {
            navigation.navigate("Posts");
        }
    });

    const openStudentDetails = (student: StudentResponse) => {
        navigation.navigate("ViewStudentScreen", {student: student});
    }

    return (<View style={styles.container}>
        {(!isLoading && !isFetching && !error) && (students.total > 0) && (<DataTable>
            <DataTable.Header>
                <DataTable.Title style={styles.nameColumn}>Nome</DataTable.Title>
                <DataTable.Title style={styles.teachingLevelColumn}>Nível</DataTable.Title>
                <DataTable.Title style={styles.teachingGradeColumn}>Ano</DataTable.Title>
            </DataTable.Header>

            {students.data.map((student, index) => {
                const rowStyle: Array<any> = [styles.row];

                if (index % 2 == 0) {
                    rowStyle.push(styles.evenRow);
                }

                return (
                    <DataTable.Row style={rowStyle} key={student.id} onPress={() => openStudentDetails(student)}>
                        <DataTable.Cell style={styles.nameColumn}>
                            <Text variant="bodyMedium" lineBreakMode="tail">
                                {student.user.name}
                            </Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.teachingLevelColumn}>
                            <Text variant="bodyMedium" lineBreakMode="tail">
                                {student.teachingGrade?.teachingLevel.name ? student.teachingGrade?.teachingLevel.name : "-"}
                            </Text>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.teachingGradeColumn}>
                            <Text variant="bodyMedium" lineBreakMode="tail">
                                {student.teachingGrade?.name ? student.teachingGrade?.name : "-"}
                            </Text>
                        </DataTable.Cell>
                    </DataTable.Row>
                )
            })}

            <DataTable.Pagination page={students.page}
                                  numberOfPages={numberOfPages}
                                  onPageChange={page => dispatch(setFilterPage(page))}
                                  label={`Pagina ${displayCurrentPage} de ${numberOfPages}  (Usuários: ${students.total})`}/>
        </DataTable>)}

        {(!isLoading && !isFetching && !error) && (students.total == 0) && (<View style={styles.emptyArea}>
            <Icon source="alert-circle-outline" size={64}/>
            <Text variant="bodyLarge" style={styles.emptyStudentListText}>
                Nenhum aluno encontrado para os filtros selecionados.
            </Text>
        </View>)}

        {(!isLoading && !isFetching && error) && (<View style={styles.errorArea}>
            <Icon source="alert-circle-outline" size={64}/>
            <Text variant="bodyLarge" style={styles.errorText}>
                Ocorreu um erro ao carregar a lista de alunos. Tente novamente.
            </Text>
            <Button style={styles.reloadButton} mode="contained" onPress={reloadStudents}>Tentar Novamente</Button>
        </View>)}

        {(isLoading || isFetching) && (<View style={styles.loadingArea}>
            <ActivityIndicator size="large"/>
        </View>)}

        <StudentsFilterDialog visible={showStudentsFilters}
                              onDialogClose={() => dispatch(setShowStudentsFilters(false))}/>

        <StudentsSortDialog visible={showStudentsSort} onDialogClose={() => dispatch(setShowStudentsSort(false))}/>
    </View>);
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        flex: 1,
    },
    nameColumn: {
        flex: 1,
    },
    teachingLevelColumn: {
        flex: 1,
    },
    teachingGradeColumn: {
        flex: 1,
    },
    row: {
        height: 60,
    },
    evenRow: {
        backgroundColor: MD3Colors.neutral95
    },
    emptyArea: {
        height: '100%',
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyStudentListText: {
        marginTop: 8,
        textAlign: "center",
        width: '100%',
        marginHorizontal: 16
    },
    errorArea: {
        height: '100%',
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        marginTop: 8,
        textAlign: "center",
        width: '100%',
        marginHorizontal: 16
    },
    reloadButton: {
        marginTop: 16,
    },
    loadingArea: {
        height: '100%',
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    studentsActionsContainer: {
        flexDirection: 'row',
    },
    studentsFilterContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        marginEnd: 4
    },
    studentsFilterBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    studentsSortContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        marginEnd: 4
    },
    studentsSortBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        marginEnd: 16,
        marginBottom: 32,
        right: 0,
        bottom: 0
    },
});

export default StudentsScreen;