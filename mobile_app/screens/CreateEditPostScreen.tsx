import {Animated, StyleSheet, View} from "react-native";
import {RouteProp, useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../navigation/types";
import {HelperText, IconButton, Snackbar, Text, TextInput} from "react-native-paper";
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";
import {Dropdown} from "react-native-paper-dropdown";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {TeachingGradeResponse} from "../types/teachinggrade/TeachingGradeResponse";
import {
    useCreatePostMutation,
    useLazySubjectQuery,
    useLazyTeachingGradeQuery,
    useLazyTeachingLevelQuery,
    useUpdatePostMutation
} from "../services/schola_blog_api";
import {SubjectResponse} from "../types/subject/SubjectResponse";
import {TeachingLevelResponse} from "../types/teachinglevel/TeachingLevelResponse";
import {useAppTheme} from "./theme";
import {htmlToText} from "html-to-text";
import {CreatePostRequest} from "../types/post/CreatePostRequest";
import {setCurrentPost, setFilters} from "../redux/slices/PostSlice";
import {useDispatch} from "react-redux";
import {PostContent, UpdatePostRequest} from "../types/post/UpdatePostRequest";
import ScrollView = Animated.ScrollView;

type CreateEditPostScreenRouteProp = RouteProp<RootStackParamList, 'CreateEditPost'>;

type Props = {
    route: CreateEditPostScreenRouteProp;
};

const CreateEditPostScreen = ({route}: Props) => {
    const theme = useAppTheme();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const {post} = route.params;

    const [title, setTitle] = useState<string>(post ? post.title : "");
    const [titleError, setTitleError] = useState(false);
    const [content, setContent] = useState<string>(post ? post.content : "");
    const [contentError, setContentError] = useState(false);
    const [subject, setSubject] = useState<string | undefined>(post ? post.subject.id.toString() : undefined);
    const [subjectError, setSubjectError] = useState(false);
    const [teachingLevel, setTeachingLevel] = useState<string | undefined>(post ? post.teachingGrade.teachingLevel.id.toString() : undefined);
    const [teachingLevelError, setTeachingLevelError] = useState(false);
    const [availableTeachingGrades, setAvailableTeachingGrades] = useState<TeachingGradeResponse[]>([]);
    const [teachingGrade, setTeachingGrade] = useState<string | undefined>(post ? post.teachingGrade.id.toString() : undefined);
    const [teachingGradeError, setTeachingGradeError] = useState(false);

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
        isLoading: isLoadingTeachingGrade,
        isFetching: isFetchingTeachingGrade,
        error: teachingGradeFetchError
    }] = useLazyTeachingGradeQuery();

    const [createPost, {isLoading: isCreatingPost}] = useCreatePostMutation();
    const [updatePost, {isLoading: isUpdatingPost}] = useUpdatePostMutation();

    const isFirstLoading = isLoadingSubject || isFetchingSubject || isLoadingTeachingLevel ||
        isFetchingTeachingLevel;
    const isError = isSubjectError || isTeachingLevelError;

    const richText = React.createRef<RichEditor>();

    useEffect(() => {
        setTitleError(false);
        setContentError(false);
        setSubjectError(false);
        setTeachingLevelError(false);
        setTeachingGradeError(false);

        if (post) {
            setTitle(post.title);
            setContent(post.content);
            setSubject(post.subject.id.toString());
            setTeachingLevel(post.teachingGrade.teachingLevel.id.toString());
            setTeachingGrade(post.teachingGrade.id.toString());
        }
    }, []);

    useEffect(() => {
        subjectTrigger(undefined);
        teachingLevelTrigger(undefined);

        loadTeachingGrades();
    }, [subjectTrigger, teachingLevelTrigger]);

    useEffect(() => {
        loadTeachingGrades();
    }, [teachingLevel]);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => <IconButton icon="content-save-outline" size={24} iconColor={theme.colors.onPrimary}
                                           onPress={savePost} disabled={false}/>
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

    const savePost = async () => {
        let error = false;

        const realTitle = title.trim();

        error = error || (realTitle.length < 3) || (realTitle.length > 512);
        setTitleError((realTitle.length < 3) || (realTitle.length > 512));

        const trimmedContent = content.trim();
        const realContent = htmlToText(trimmedContent);

        error = error || (realContent.length < 3) || (trimmedContent.length > 32767);
        setContentError((realContent.length < 3) || (trimmedContent.length > 32767));

        const realSubject = subjectData?.find((s) => s.id.toString() === subject);

        error = error || (realSubject == undefined);
        setSubjectError(realSubject == undefined);

        const realTeachingLevel = teachingLevelData?.find((t) => t.id.toString() === teachingLevel);

        error = error || (realTeachingLevel == undefined);
        setTeachingLevelError(realTeachingLevel == undefined);

        const realTeachingGrade = teachingGradeData?.find((t) => t.id.toString() === teachingGrade);

        error = error || (realTeachingGrade == undefined);
        setTeachingGradeError(realTeachingGrade == undefined);

        if (!error) {
            if (post) {
                // Updating post
                const postContent = new PostContent(realTitle, trimmedContent, realSubject!.id, realTeachingGrade!.id);
                const updatedPost = new UpdatePostRequest(post.id, postContent);

                try {
                    const newPost = await updatePost(updatedPost).unwrap();

                    dispatch(setCurrentPost(newPost));

                    setSnackbarMessage("Postagem atualizada com sucesso.");
                    setShowSnackbar(true);

                    navigation.goBack();

                    dispatch(setFilters({
                        fullContent: undefined,
                        subject: undefined,
                        teachingLevel: undefined,
                        teachingGrade: undefined,
                        teacher: undefined
                    }));
                } catch (error) {
                    if (error.message) {
                        setSnackbarMessage(error.message);
                    } else {
                        setSnackbarMessage("Ocorreu um erro ao atualizar a postagem. Tente novamente.");
                    }

                    setShowSnackbar(true);
                }
            } else {
                // Creating post
                const newPost = new CreatePostRequest(realTitle, trimmedContent, realSubject!.id, realTeachingGrade!.id);

                try {
                    await createPost(newPost).unwrap();

                    setSnackbarMessage("Postagem criada com sucesso.");
                    setShowSnackbar(true);

                    navigation.goBack();

                    dispatch(setFilters({
                        fullContent: undefined,
                        subject: undefined,
                        teachingLevel: undefined,
                        teachingGrade: undefined,
                        teacher: undefined
                    }));
                } catch (error) {
                    if (error.message) {
                        setSnackbarMessage(error.message);
                    } else {
                        setSnackbarMessage("Ocorreu um erro ao criar a postagem. Tente novamente.");
                    }

                    setShowSnackbar(true);
                }
            }
        }
    };

    const handleHead = ({tintColor}) => <Text style={{color: tintColor}}>H1</Text>

    return (
        <ScrollView style={styles.container}>
            <TextInput mode="outlined" label="Título" value={title} onChangeText={setTitle} maxLength={512}
                       disabled={isCreatingPost}/>
            {titleError && (<HelperText type="error">
                O título da postagem deve ter entre 3 e 512 caracteres.
            </HelperText>)}
            <Text style={styles.contentTitle} variant="bodyMedium">Conteúdo</Text>
            <View style={styles.content}>
                <RichEditor ref={richText} useContainer={false} initialContentHTML={content} onChange={setContent}
                            disabled={isCreatingPost}/>
                <RichToolbar
                    editor={richText}
                    actions={[actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1]}
                    iconMap={{[actions.heading1]: handleHead}}
                    disabled={isCreatingPost}
                />
            </View>
            {contentError && (<HelperText type="error">
                O conteúdo da postagem deve ter entre 3 e 32767 caracteres.
            </HelperText>)}
            <View style={styles.subject}>
                <Dropdown mode="outlined" label="Matéria"
                          options={getSubjects(subjectData)} value={subject}
                          onSelect={setSubject} disabled={isCreatingPost}/>
                {subjectError && (
                    <HelperText type="error">Selecione a matéria a qual a postagem pertence.</HelperText>)}
            </View>
            <View style={styles.teachingLevel}>
                <Dropdown mode="outlined" label="Nível"
                          options={getTeachingLevels(teachingLevelData)} value={teachingLevel}
                          onSelect={onTeachingLevelSelected}
                          disabled={isFetchingTeachingGrade || isLoadingTeachingGrade || isCreatingPost}/>
                {teachingLevelError && (<HelperText type="error">
                    Selecione o nível de ensino para qual a postagem é direcionada.
                </HelperText>)}
            </View>
            <View style={styles.teachingGrade}>
                <Dropdown mode="outlined" label="Ano"
                          options={getTeachingGrades(availableTeachingGrades)} value={teachingGrade}
                          onSelect={setTeachingGrade}
                          disabled={isFetchingTeachingGrade || isLoadingTeachingGrade || isCreatingPost}/>
                {teachingGradeError && (<HelperText type="error">
                    Selecione o ano de ensino para qual a postagem é direcionada.
                </HelperText>)}
            </View>

            <Snackbar visible={showSnackbar} onDismiss={() => setShowSnackbar(false)}>
                {snackbarMessage}
            </Snackbar>
        </ScrollView>);
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        marginBottom: 24,
    },
    contentTitle: {
        marginTop: 8,
    },
    content: {
        borderStyle: "solid",
        borderColor: "#999",
        borderWidth: 1,
        borderRadius: 4,
        height: 400,
    },
    subject: {
        marginTop: 8,
    },
    teachingLevel: {
        marginTop: 8
    },
    teachingGrade: {
        marginTop: 8,
        paddingBottom: 24
    }
});

export default CreateEditPostScreen;