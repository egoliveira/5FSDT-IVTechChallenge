import {StyleSheet, View} from "react-native";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {useNavigation} from "@react-navigation/native";
import {UserListRequestParams} from "../types/user/UserListRequestParams";
import React, {useEffect, useLayoutEffect, useState} from "react";
import {useLazyUsersQuery} from "../services/schola_blog_api";
import {ActivityIndicator, Badge, Button, DataTable, FAB, Icon, IconButton, MD3Colors, Text} from "react-native-paper";
import {UserListResponse} from "../types/user/UserListResponse";
import {setCurrentEditingUser, setFilterPage, setShowUsersFilters, setShowUsersSort} from "../redux/slices/UserSlice";
import UsersFilterDialog from "../components/UsersFilterDialog";
import {useAppTheme} from "./theme";
import UsersSortDialog from "../components/UsersSortDialog";
import {SortOrder, stringToSortOrderField} from "../types/common/SortOrder";
import {stringToUserListSortField, UserListSortField} from "../types/user/UserListSortField";
import {UserResponse} from "../types/user/UserResponse";

const UsersScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const theme = useAppTheme();

    const initialParams: UserListRequestParams = {
        username: undefined,
        name: undefined,
        email: undefined,
        active: undefined,
        userRole: undefined,
        sortBy: undefined,
        sortOrder: undefined,
        page: 0,
        pageSize: 10
    };

    const [requestParams, setRequestParams] = useState<UserListRequestParams>(initialParams);

    const [trigger, {data, isLoading, isFetching, error}] = useLazyUsersQuery();

    const showUsersFilters = useSelector((state: RootState) => state.user.showUsersFilters);
    const showUsersSort = useSelector((state: RootState) => state.user.showUsersSort);
    const [usersFiltersCount, setUsersFiltersCount] = useState(0);
    const [sortOrderEnabled, setSortOrderEnabled] = useState(false);
    const [lastFiltersUpdateTimestamp, setLastFiltersUpdateTimestamp] = useState<number>(0);

    const users = data || new UserListResponse([], 0, 10, 0);
    const numberOfPages = Math.ceil(users.total / users.pageSize);
    const displayCurrentPage = users.page + 1;

    const reloadUsers = () => {
        trigger(requestParams);
    }

    useEffect(() => {
        reloadUsers();
    }, [trigger]);

    useEffect(() => {
        if (!isLoading && !isFetching) {
            trigger(requestParams, false);
        }
    }, [lastFiltersUpdateTimestamp]);

    useSelector((state: RootState) => {
        const filtersState = state.user.filtersState;
        const lastUpdated = filtersState.lastUpdated;

        if (lastFiltersUpdateTimestamp != lastUpdated) {
            let username = undefined;
            let name = undefined;
            let email = undefined;

            let count = 0;

            if (filtersState.username && (filtersState.username.trim().length > 1)) {
                username = filtersState.username.trim();
                count++;
            }

            if (filtersState.name && (filtersState.name.trim().length > 1)) {
                name = filtersState.name.trim();
                count++;
            }

            if (filtersState.email && (filtersState.email.trim().length > 1)) {
                email = filtersState.email.trim();
                count++;
            }

            if (filtersState.active !== undefined) {
                count++;
            }

            let sortBy: UserListSortField | undefined = undefined;
            let sortOrder: SortOrder | undefined = undefined;

            if (filtersState.sortBy != undefined) {
                sortBy = stringToUserListSortField(filtersState.sortBy);
                sortOrder = stringToSortOrderField(filtersState.sortOrder);
            }

            const params: UserListRequestParams = {
                username: username,
                name: name,
                email: email,
                active: filtersState.active,
                userRole: filtersState.userRole,
                sortBy: sortBy,
                sortOrder: sortOrder,
                page: filtersState.page,
                pageSize: 10
            };

            setRequestParams(params);

            if (count != usersFiltersCount) {
                setUsersFiltersCount(count);
            }

            setSortOrderEnabled(filtersState.sortBy != undefined);

            setLastFiltersUpdateTimestamp(lastUpdated);
        }
    });

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (<View style={styles.usersActionsContainer}>
                <View style={styles.usersSortContainer}>
                    <IconButton icon="sort-variant" iconColor={theme.colors.onPrimary} size={24}
                                onPress={() => dispatch(setShowUsersSort(true))}
                                disabled={(isLoading || isFetching)}/>
                    {(sortOrderEnabled) && (
                        <Badge
                            style={[styles.usersSortBadge, {backgroundColor: theme.colors.error}]}
                            size={15}>!</Badge>
                    )}
                </View>
                <View style={styles.usersFilterContainer}>
                    <IconButton icon="filter-outline" iconColor={theme.colors.onPrimary} size={24}
                                onPress={() => dispatch(setShowUsersFilters(true))}
                                disabled={(isLoading || isFetching)}/>
                    {(usersFiltersCount > 0) && (
                        <Badge
                            style={[styles.usersFilterBadge, {backgroundColor: theme.colors.error}]}
                            size={15}>{usersFiltersCount}</Badge>
                    )}
                </View>
            </View>)
        })
    });

    useSelector((state: RootState) => {
        if (!state.user.isAdmin) {
            navigation.navigate("Posts");
        }
    });

    const openUserDetails = (user: UserResponse) => {
        navigation.navigate("ViewUserScreen", {user: user});
    }

    const openCreateUserScreen = () => {
        dispatch(setCurrentEditingUser(undefined));
        navigation.navigate("CreateUserScreen", {});
    }

    return (<View style={styles.container}>
        {(!isLoading && !isFetching && !error) && (users.total > 0) && (<DataTable>
            <DataTable.Header>
                <DataTable.Title style={styles.userColumn}>Usuário</DataTable.Title>
                <DataTable.Title style={styles.emailColumn}>E-mail</DataTable.Title>
                <DataTable.Title style={styles.activeColumn}>Ativo</DataTable.Title>
            </DataTable.Header>

            {users.data.map((user, index) => {
                const rowStyle: Array<any> = [styles.row];

                if (index % 2 == 0) {
                    rowStyle.push(styles.evenRow);
                }

                return (
                    <DataTable.Row style={rowStyle} key={user.id} onPress={() => openUserDetails(user)}>
                        <DataTable.Cell style={styles.userColumn}>
                            <View>
                                <Text variant="titleSmall" numberOfLines={1}>{user.username}</Text>
                                <Text variant="bodyMedium" numberOfLines={2}>{user.name}</Text>
                            </View>
                        </DataTable.Cell>
                        <DataTable.Cell style={styles.emailColumn}>{user.email}</DataTable.Cell>
                        <DataTable.Cell style={styles.activeColumn}>{user.active ? "Sim" : "Não"}</DataTable.Cell>
                    </DataTable.Row>
                )
            })}

            <DataTable.Pagination page={users.page}
                                  numberOfPages={numberOfPages}
                                  onPageChange={page => dispatch(setFilterPage(page))}
                                  label={`Pagina ${displayCurrentPage} de ${numberOfPages}  (Usuários: ${users.total})`}/>
        </DataTable>)}

        {(!isLoading && !isFetching && !error) && (users.total == 0) && (<View style={styles.emptyArea}>
            <Icon source="alert-circle-outline" size={64}/>
            <Text variant="bodyLarge" style={styles.emptyUserListText}>
                Nenhum usuário encontrado para os filtros selecionados.
            </Text>
        </View>)}

        {(!isLoading && !isFetching && error) && (<View style={styles.errorArea}>
            <Icon source="alert-circle-outline" size={64}/>
            <Text variant="bodyLarge" style={styles.errorText}>
                Ocorreu um erro ao carregar a lista de usuários. Tente novamente.
            </Text>
            <Button style={styles.reloadButton} mode="contained" onPress={reloadUsers}>Tentar Novamente</Button>
        </View>)}

        {(isLoading || isFetching) && (<View style={styles.loadingArea}>
            <ActivityIndicator size="large"/>
        </View>)}

        <UsersFilterDialog visible={showUsersFilters} onDialogClose={() => dispatch(setShowUsersFilters(false))}/>

        <UsersSortDialog visible={showUsersSort} onDialogClose={() => dispatch(setShowUsersSort(false))}/>

        <FAB icon="plus" style={styles.fab} onPress={openCreateUserScreen}/>
    </View>);
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        width: '100%',
        flex: 1,
    },
    userColumn: {
        flex: 3,
    },
    emailColumn: {
        flex: 3,
    },
    activeColumn: {
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
    emptyUserListText: {
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
    usersActionsContainer: {
        flexDirection: 'row',
    },
    usersFilterContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        marginEnd: 4
    },
    usersFilterBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    usersSortContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        marginEnd: 4
    },
    usersSortBadge: {
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

export default UsersScreen;