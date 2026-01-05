import {createSlice} from "@reduxjs/toolkit";
import {SortOrder} from "../../types/common/SortOrder";
import {FullStudentInfo} from "../../types/student/FullStudentInfo";

interface FiltersState {
    name: string | undefined,
    teachingLevelId: number | undefined,
    teachingGradeId: number | undefined,
    page: number,
    sortBy: string | undefined,
    sortOrder: string,
    lastUpdated: number;
}

interface StudentSliceState {
    showStudentsFilters: boolean,
    showStudentsSort: boolean,
    currentEditingStudent: FullStudentInfo | undefined,
    filtersState: FiltersState;
}

const initialState: StudentSliceState = {
    showStudentsFilters: false,
    showStudentsSort: false,
    currentEditingStudent: undefined,
    filtersState: {
        name: undefined,
        teachingLevelId: undefined,
        teachingGradeId: undefined,
        page: 0,
        sortBy: undefined,
        sortOrder: SortOrder.ASC,
        lastUpdated: Date.now(),
    }
}

export const studentSlice = createSlice({
    name: "student",
    initialState: initialState,
    reducers: {
        setShowStudentsFilters: (state, action) => {
            state.showStudentsFilters = action.payload;
        },

        setFilters: (state, action) => {
            state.filtersState.name = action.payload.name;
            state.filtersState.teachingLevelId = action.payload.teachingLevelId;
            state.filtersState.teachingGradeId = action.payload.teachingGradeId;
            state.filtersState.page = action.payload.page;
            state.filtersState.lastUpdated = Date.now();
        },

        setFilterPage: (state, action) => {
            state.filtersState.page = action.payload;
            state.filtersState.lastUpdated = Date.now();
        },

        setShowStudentsSort: (state, action) => {
            state.showStudentsSort = action.payload;
        },

        clearFilters: (state, action) => {
            state.filtersState.name = undefined;
            state.filtersState.teachingLevelId = undefined;
            state.filtersState.teachingGradeId = undefined;
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

        setCurrentEditingStudent: (state, action) => {
            state.currentEditingStudent = action.payload;
        }
    }
})

export const {
    setShowStudentsFilters,
    setFilters,
    setFilterPage,
    setShowStudentsSort,
    clearFilters,
    setSort,
    setCurrentEditingStudent
} = studentSlice.actions;