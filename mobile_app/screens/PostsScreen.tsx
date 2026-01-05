import {FlatList, StyleSheet, View} from "react-native";
import {ActivityIndicator, FAB, Icon, Snackbar, Text} from "react-native-paper";
import PostCard from "../components/PostCard";
import ListSeparator from "../components/ListSeparator";
import {useLazyPostsQuery} from "../services/schola_blog_api";
import React, {useEffect, useState} from "react";
import {PostListRequestParams} from "../types/post/PostListRequestParams";
import {PostResponse} from "../types/post/PostResponse";
import {currentUserRoles} from "../redux/slices/current_user_roles";
import PostsFilterDialog from "../components/PostsFilterDialog";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {setCurrentPost, setShowPostsFilters} from "../redux/slices/PostSlice";
import {useNavigation} from "@react-navigation/native";

const PostsScreen = () => {
    const initialParams: PostListRequestParams = {
        fullContent: undefined,
        subjectId: undefined,
        teachingLevelId: undefined,
        teachingGradeId: undefined,
        userId: undefined,
        sortBy: undefined,
        sortOrder: undefined,
        page: 0,
        pageSize: 10
    };

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [requestParams, setRequestParams] = useState<PostListRequestParams>(initialParams);

    const [trigger, {data, isLoading, isFetching, isError}] = useLazyPostsQuery();

    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [showSnackbar, setShowSnackbar] = useState(false);
    const showPostsFilters = useSelector((state: RootState) => state.post.showPostsFilters);
    const [lastFiltersUpdateTimestamp, setLastFiltersUpdateTimestamp] = useState<number>(0);

    const posts = data?.data || [];

    useEffect(() => {
        trigger(requestParams);
    }, [trigger]);

    useEffect(() => {
        if (isError && (posts.length > 0)) {
            setSnackbarMessage("Ocorreu um erro ao carregar as postagens seguintes.");
            setShowSnackbar(true);
        } else {
            setSnackbarMessage("");
            setShowSnackbar(false);
        }
    }, [isError]);

    useEffect(() => {
        if (!isLoading && !isFetching) {
            trigger(requestParams, false);
        }
    }, [lastFiltersUpdateTimestamp]);

    useSelector((state: RootState) => {
        const filtersState = state.post.filtersState;
        const lastUpdated = filtersState.lastUpdated;

        if (lastFiltersUpdateTimestamp != lastUpdated) {
            let fullContent = undefined;

            if (filtersState.fullContent && (filtersState.fullContent.trim().length >= 2)) {
                fullContent = filtersState.fullContent;
            }

            const params: PostListRequestParams = {
                fullContent: fullContent,
                subjectId: filtersState.subject?.id,
                teachingLevelId: filtersState.teachingLevel?.id,
                teachingGradeId: filtersState.teachingGrade?.id,
                userId: filtersState.teacher?.id,
                sortBy: undefined,
                sortOrder: undefined,
                page: 0,
                pageSize: 10
            };

            setRequestParams(params);

            setLastFiltersUpdateTimestamp(lastUpdated);
        }
    });

    const loadMorePosts = () => {
        if (!isFetching && !isLoading) {
            const fetchMore = (posts.length < (data?.total || 0));

            if (fetchMore) {
                const page = (posts.length > 0) ? requestParams.page + 1 : 0;
                const newRequestParams = {...requestParams};

                newRequestParams.page = page;

                setRequestParams(newRequestParams);

                trigger(newRequestParams, true);
            }
        }
    };

    const openPost = (post: PostResponse) => {
        dispatch(setCurrentPost(post));
        navigation.navigate("ViewPostScreen", {post: post});
    }

    return (
        <View style={styles.container}>
            {((!isLoading && !isFetching) || (posts.length > 0)) &&
                (<FlatList style={styles.postList}
                           contentContainerStyle={styles.postListContent}
                           data={posts}
                           renderItem={({item}) => <PostCard post={item}
                                                             style={styles.postCard}
                                                             onPress={(post) => openPost(post)}/>}
                           keyExtractor={(item) => item.id.toString()}
                           ItemSeparatorComponent={ListSeparator}
                           ListEmptyComponent={EmptyPostListView(true, isError)}
                           onEndReached={loadMorePosts}
                           onEndReachedThreshold={0.5}
                           ListFooterComponent={LoadingMorePostsView(posts, isLoading)}
                />)}

            <FAB icon="plus" style={styles.fab} visible={currentUserRoles()?.teacher === true}
                 onPress={() => navigation.navigate("CreatePostScreen", {})}/>

            {isFetching && (posts.length == 0) && (<ActivityIndicator size="large"/>)}

            <Snackbar visible={showSnackbar} onDismiss={() => setShowSnackbar(false)}>
                {snackbarMessage}
            </Snackbar>

            <PostsFilterDialog visible={showPostsFilters} onDialogClose={() => dispatch(setShowPostsFilters(false))}/>
        </View>
    );
};

const EmptyPostListView = (filtersEnabled: boolean, errorFetchingPosts: boolean) => {
    let message: string;

    if (errorFetchingPosts) {
        message = "Erro ao carregar as postagens";
    } else if (filtersEnabled) {
        message = "Nenhuma postagem encontrada para os filtros selecionados";
    } else {
        message = "Nenhuma postagem encontrada";
    }

    return (
        <View style={styles.emptyPostList}>
            <Icon source="alert-circle-outline" size={64}/>
            <Text variant="bodyLarge" style={styles.emptyPostListText}>{message}</Text>
        </View>
    );
};

const LoadingMorePostsView = (posts: Array<PostResponse>, isLoading: boolean) => {
    let view: React.JSX.Element;

    if ((posts.length > 0) && isLoading) {
        view = (<View>
            <ActivityIndicator size="small"/>
        </View>)
    } else {
        view = (<></>);
    }

    return view;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    postList: {
        width: '100%',
    },
    postListContent: {
        flexGrow: 1
    },
    postCard: {
        marginStart: 8,
        marginEnd: 8,
    },
    fab: {
        position: 'absolute',
        marginEnd: 16,
        marginBottom: 32,
        right: 0,
        bottom: 0
    },
    emptyPostList: {
        height: '100%',
        width: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyPostListText: {
        marginTop: 8,
        textAlign: "center",
        width: '100%',
        marginHorizontal: 16
    }
});

export default PostsScreen;