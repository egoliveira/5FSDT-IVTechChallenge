import {StyleSheet, View} from "react-native";
import {RouteProp, useNavigation} from "@react-navigation/native";
import {RootStackParamList} from "../navigation/types";
import {IconButton, Snackbar, Text} from "react-native-paper";
import WebView from "react-native-webview";
import React, {useLayoutEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {useAppTheme} from "./theme";
import DeletePostConfirmationDialog from "../components/DeletePostConfirmationDialog";
import {useDeletePostMutation} from "../services/schola_blog_api";
import {setFilters} from "../redux/slices/PostSlice";
import {PostResponse} from "../types/post/PostResponse";
import {format} from "date-fns";

type ViewPostScreenRouteProp = RouteProp<RootStackParamList, 'ViewPost'>;

type Props = {
    route: ViewPostScreenRouteProp;
};

const ViewPostScreen = ({route}: Props) => {
    const theme = useAppTheme();
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const [post, setPost] = useState<PostResponse>(route.params.post);
    const isTeacher = useSelector((state: RootState) => state.user.isTeacher);

    const [showDeletePostDialog, setShowDeletePostDialog] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showSnackbar, setShowSnackbar] = useState(false);

    const [deletePostService, {
        isLoading: isDeletingPost,
        error: deleteError
    }] = useDeletePostMutation();

    const deletePost = async () => {
        setShowDeletePostDialog(false);

        await deletePostService(post.id).unwrap();

        if (!deleteError) {
            navigation.goBack();

            dispatch(setFilters({
                fullContent: undefined,
                subject: undefined,
                teachingLevel: undefined,
                teachingGrade: undefined,
                teacher: undefined
            }));
            // TODO: exibir toast
        } else {
            setSnackbarMessage("Ocorreu um erro ao apagar a postagem. Tente novamente.");
            setShowSnackbar(true);
        }
    }

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => isTeacher && (<View style={styles.viewPostActionsContainer}>
                <IconButton icon="delete" size={24} iconColor={theme.colors.onPrimary}
                            onPress={() => setShowDeletePostDialog(true)} disabled={isDeletingPost}/>
                <IconButton icon="file-edit-outline" size={24} iconColor={theme.colors.onPrimary}
                            onPress={() => navigation.navigate("EditPostScreen", {post: post})}
                            disabled={isDeletingPost}/>
            </View>)
        })
    });

    useSelector((state: RootState) => {
        const currentPost = state.post.currentPost;

        if ((currentPost != undefined) && (currentPost !== post)) {
            setPost(currentPost);
        }
    });

    return (
        <View style={styles.container}>
            <Text variant="displaySmall">{post.title}</Text>
            <Text style={styles.postAudience}
                  variant="titleSmall">{post.subject.name} - {post.teachingGrade.name} - {post.teachingGrade.teachingLevel.name}</Text>
            <Text style={styles.teacher} variant="bodyMedium">Professor {post.user.name}</Text>
            <WebView style={post.content} source={{html: post.content}} textZoom={400}/>
            <Text style={styles.createdAt} variant="bodyMedium">
                Criado em {format(post.createdAt, "dd/MM/yyyy HH:mm")}
            </Text>
            {(post.createdAt != post.updatedAt) && (
                <Text style={styles.updatedAt} variant="bodyMedium">
                    Atualizado em {format(post.updatedAt, "dd/MM/yyyy HH:mm")}
                </Text>)}

            <DeletePostConfirmationDialog
                visible={showDeletePostDialog}
                onDialogClose={() => setShowDeletePostDialog(false)}
                onDeletePost={deletePost}
            />

            <Snackbar visible={showSnackbar} onDismiss={() => setShowSnackbar(false)}>
                {snackbarMessage}
            </Snackbar>
        </View>);
}

const styles = StyleSheet.create({
    viewPostActionsContainer: {
        flexDirection: "row"
    },
    container: {
        flex: 1,
        padding: 4,
        paddingBottom: 24,
    },
    postAudience: {
        marginTop: 4,
        textAlign: 'right'
    },
    teacher: {
        marginTop: 2,
        marginBottom: 8,
        textAlign: 'right'
    },
    content: {
        flex: 1,
        marginTop: 2
    },
    createdAt: {
        textAlign: 'right',
        marginRight: 8,
        marginTop: 8,
    },
    updatedAt: {
        textAlign: 'right',
        marginRight: 8
    }
});

export default ViewPostScreen;