import {StyleSheet, View} from "react-native";
import {RouteProp, useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../navigation/types";
import {ActivityIndicator, IconButton, Snackbar, Text} from "react-native-paper";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useAppTheme} from "./theme";
import {RootState} from "../redux/store";
import {FullStudentInfo} from "../types/student/FullStudentInfo";
import {setCurrentEditingStudent} from "../redux/slices/StudentSlice";

type ViewStudentScreenRouteProp = RouteProp<RootStackParamList, 'ViewStudent'>;

type Props = {
    route: ViewStudentScreenRouteProp;
};

const ViewStudentScreen = ({route}: Props) => {
    const theme = useAppTheme();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const {student} = route.params;
    const [fullStudentInfo, setFullStudentInfo] = useState<FullStudentInfo | undefined>(undefined);

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showSnackbar, setShowSnackbar] = useState(false);

    useEffect(() => {
        dispatch(setCurrentEditingStudent({
            userInfo: {
                id: student.userId,
                username: student.user.username,
                name: student.user.name,
                email: student.user.email,
                active: student.user.active
            },
            studentInfo: {
                id: student.id,
                teachingLevelId: student.teachingGrade?.teachingLevelId,
                teachingLevelName: student.teachingGrade?.teachingLevel.name,
                teachingGradeId: student.teachingGradeId,
                teachingGradeName: student.teachingGrade?.name
            }
        }));
    }, [student]);

    useSelector((state: RootState) => {
        const currentStudentInfo = state.student.currentEditingStudent;

        if (currentStudentInfo !== fullStudentInfo) {
            setFullStudentInfo(currentStudentInfo);
        }
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (<View style={styles.viewStudentActionsContainer}>
                <IconButton icon="account-edit-outline" size={24} iconColor={theme.colors.onPrimary}
                            onPress={() => navigation.navigate("EditStudentScreen")}
                            disabled={!fullStudentInfo}/>
            </View>)
        })
    });

    return (
        <View style={styles.container}>
            {(fullStudentInfo) && (<View>
                <Text variant="titleMedium">Usuário</Text>
                <Text variant="bodyLarge">{fullStudentInfo.userInfo.username}</Text>

                <Text style={styles.name} variant="titleMedium">Nome</Text>
                <Text variant="bodyLarge">{fullStudentInfo.userInfo.name}</Text>

                <Text style={styles.email} variant="titleMedium">E-mail</Text>
                <Text variant="bodyLarge">{fullStudentInfo.userInfo.email}</Text>

                <Text style={styles.active} variant="titleMedium">Ativo</Text>
                <Text variant="bodyLarge">{fullStudentInfo.userInfo.active ? "Sim" : "Não"}</Text>

                <Text style={styles.teachingLevel} variant="titleMedium">Nível</Text>
                <Text variant="bodyLarge">
                    {fullStudentInfo.studentInfo.teachingLevelName ? fullStudentInfo.studentInfo.teachingLevelName : "Não Definido"}
                </Text>

                <Text style={styles.teachingGrade} variant="titleMedium">Ano</Text>
                <Text variant="bodyLarge">
                    {fullStudentInfo.studentInfo.teachingGradeName ? fullStudentInfo.studentInfo.teachingGradeName : "Não Definido"}
                </Text>
            </View>)}

            {(!fullStudentInfo) && (
                <View style={styles.loadingErrorContainer}>
                    <ActivityIndicator size="large"/>
                </View>
            )}

            <Snackbar visible={showSnackbar} onDismiss={() => setShowSnackbar(false)}>
                {snackbarMessage}
            </Snackbar>
        </View>);
}

const styles = StyleSheet.create({
    viewStudentActionsContainer: {
        flexDirection: "row"
    },
    container: {
        flex: 1,
        padding: 8,
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
        marginTop: 8,
    },
    teachingGrade: {
        marginTop: 8,
    },
});

export default ViewStudentScreen;