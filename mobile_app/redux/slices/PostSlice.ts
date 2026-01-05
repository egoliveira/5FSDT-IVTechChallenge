import {createSlice} from "@reduxjs/toolkit";
import {SubjectResponse} from "../../types/subject/SubjectResponse";
import {TeachingLevelResponse} from "../../types/teachinglevel/TeachingLevelResponse";
import {TeachingGradeResponse} from "../../types/teachinggrade/TeachingGradeResponse";
import {UserResponse} from "../../types/user/UserResponse";
import {PostResponse} from "../../types/post/PostResponse";

interface PostSliceState {
    showPostsFilters: boolean;
    currentPost: PostResponse | undefined;
    filtersState: FiltersState;
}

interface FiltersState {
    fullContent: string | undefined,
    subject: SubjectResponse | undefined,
    teachingLevel: TeachingLevelResponse | undefined,
    teachingGrade: TeachingGradeResponse | undefined,
    teacher: UserResponse | undefined,
    lastUpdated: number;
}

const initialState: PostSliceState = {
    showPostsFilters: false,
    currentPost: undefined,
    filtersState: {
        fullContent: undefined,
        subject: undefined,
        teachingLevel: undefined,
        teachingGrade: undefined,
        teacher: undefined,
        lastUpdated: Date.now()
    }
}

export const postSlice = createSlice({
    name: "post",
    initialState: initialState,
    reducers: {
        setShowPostsFilters: (state, action) => {
            state.showPostsFilters = action.payload;
        },

        setFilters: (state, action) => {
            state.filtersState.fullContent = action.payload.fullContent;
            state.filtersState.subject = action.payload.subject;
            state.filtersState.teachingLevel = action.payload.teachingLevel;
            state.filtersState.teachingGrade = action.payload.teachingGrade;
            state.filtersState.teacher = action.payload.teacher;
            state.filtersState.lastUpdated = Date.now();
        },

        clearFilters: (state, action) => {
            state.filtersState.fullContent = undefined;
            state.filtersState.subject = undefined;
            state.filtersState.teachingLevel = undefined;
            state.filtersState.teachingGrade = undefined;
            state.filtersState.teacher = undefined;
            state.filtersState.lastUpdated = Date.now();
        },

        setCurrentPost: (state, action) => {
            state.currentPost = action.payload;
        }
    }
});

export const {setShowPostsFilters, setFilters, clearFilters, setCurrentPost} = postSlice.actions;