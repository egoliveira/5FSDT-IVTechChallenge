import {configureStore} from "@reduxjs/toolkit";
import {userSlice} from "./slices/UserSlice";
import {scholaBlogApi} from "../services/schola_blog_api";
import {setupListeners} from "@reduxjs/toolkit/query";
import {postSlice} from "./slices/PostSlice";
import {studentSlice} from "./slices/StudentSlice";

const store = configureStore({
    reducer: {
        [scholaBlogApi.reducerPath]: scholaBlogApi.reducer,
        user: userSlice.reducer,
        post: postSlice.reducer,
        student: studentSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredPaths: ["api.queries.posts.originalArgs"]
            }
        }).concat(scholaBlogApi.middleware),
});

setupListeners(store.dispatch)

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch