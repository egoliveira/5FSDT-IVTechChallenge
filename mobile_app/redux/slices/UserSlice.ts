import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserResponse} from "../../types/user/UserResponse";
import {UserRolesResponse} from "../../types/roles/UserRolesResponse";
import {SortOrder} from "../../types/common/SortOrder";
import {FullUserInfo} from "../../types/user/FullUserInfo";

interface FiltersState {
    username: string | undefined,
    name: string | undefined,
    email: string | undefined,
    active: boolean | undefined,
    userRole: string | undefined,
    page: number,
    sortBy: string | undefined,
    sortOrder: string,
    lastUpdated: number;
}

interface UserSliceState {
    token: string | null,
    userId: number | null,
    username: string | null,
    name: string | null,
    email: string | null,
    active: string | null,
    isAdmin: boolean | null,
    isTeacher: boolean | null,
    isStudent: boolean | null,
    showUsersFilters: boolean,
    showUsersSort: boolean,
    currentEditingUser: FullUserInfo | undefined,
    filtersState: FiltersState;
}

const initialState: UserSliceState = {
    token: null,
    userId: null,
    username: null,
    name: null,
    email: null,
    active: null,
    isAdmin: null,
    isTeacher: null,
    isStudent: null,
    showUsersFilters: false,
    showUsersSort: false,
    currentEditingUser: undefined,
    filtersState: {
        username: undefined,
        name: undefined,
        email: undefined,
        active: undefined,
        userRole: undefined,
        page: 0,
        sortBy: undefined,
        sortOrder: SortOrder.ASC,
        lastUpdated: Date.now(),
    }
}

export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setToken: (state: any, action: PayloadAction<string | null>) => {
            state.token = action.payload;
        },

        setCurrentUser: (state: any, action: PayloadAction<UserResponse | null>) => {
            if (action.payload) {
                state.userId = action.payload.id;
                state.username = action.payload.username;
                state.name = action.payload.name;
                state.email = action.payload.email;
                state.active = action.payload.active;
            } else {
                state.userId = null;
                state.username = null;
                state.name = null;
                state.email = null;
                state.active = null;
            }
        },

        setCurrentUserRoles(state: any, action: PayloadAction<UserRolesResponse | null>) {
            if (action.payload) {
                state.isAdmin = action.payload.admin;
                state.isTeacher = action.payload.teacher;
                state.isStudent = action.payload.student;
            } else {
                state.isAdmin = null;
                state.isTeacher = null;
                state.isStudent = null;
            }
        },

        setShowUsersFilters: (state, action) => {
            state.showUsersFilters = action.payload;
        },

        setFilters: (state, action) => {
            state.filtersState.username = action.payload.username;
            state.filtersState.name = action.payload.name;
            state.filtersState.email = action.payload.email;
            state.filtersState.active = action.payload.active;
            state.filtersState.userRole = action.payload.userRole;
            state.filtersState.page = action.payload.page;
            state.filtersState.lastUpdated = Date.now();
        },

        setFilterPage: (state, action) => {
            state.filtersState.page = action.payload;
            state.filtersState.lastUpdated = Date.now();
        },

        setShowUsersSort: (state, action) => {
            state.showUsersSort = action.payload;
        },

        clearFilters: (state, action) => {
            state.filtersState.username = undefined;
            state.filtersState.name = undefined;
            state.filtersState.email = undefined;
            state.filtersState.active = undefined;
            state.filtersState.userRole = undefined;
            state.filtersState.page = 0;
            state.filtersState.sortBy = undefined;
            state.filtersState.sortOrder = SortOrder.ASC;
            state.filtersState.lastUpdated = Date.now();
        },

        setSort: (state, action) => {
            state.filtersState.sortBy = action.payload.sortBy;
            state.filtersState.sortOrder = action.payload.sortOrder;
            state.filtersState.lastUpdated = Date.now();
        },

        setCurrentEditingUser: (state, action) => {
            state.currentEditingUser = action.payload;
        }
    }
})

export const {
    setToken,
    setCurrentUser,
    setCurrentUserRoles,
    setShowUsersFilters,
    setFilters,
    setFilterPage,
    clearFilters,
    setSort,
    setShowUsersSort,
    setCurrentEditingUser
} = userSlice.actions;