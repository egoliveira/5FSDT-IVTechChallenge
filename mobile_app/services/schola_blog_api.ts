import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {LoginResponse} from "../types/user/LoginResponse";
import {LoginRequest} from "../types/user/LoginRequest";
import {RootState} from "../redux/store";
import {UserResponse} from "../types/user/UserResponse";
import {UserRolesResponse} from "../types/roles/UserRolesResponse";
import {PostListResponse} from "../types/post/PostListResponse";
import {PostListRequestParams} from "../types/post/PostListRequestParams";
import {SubjectResponse} from "../types/subject/SubjectResponse";
import {TeachingLevelResponse} from "../types/teachinglevel/TeachingLevelResponse";
import {TeachingGradeResponse} from "../types/teachinggrade/TeachingGradeResponse";
import {CreatePostRequest} from "../types/post/CreatePostRequest";
import {UpdatePostRequest} from "../types/post/UpdatePostRequest";
import {UserListResponse} from "../types/user/UserListResponse";
import {UserListRequestParams} from "../types/user/UserListRequestParams";
import {CreateUserRequest} from "../types/user/CreateUserRequest";
import {UpdateUserRequest} from "../types/user/UpdateUserRequest";
import {UpdateUserRolesRequest} from "../types/user/UpdateUserRolesRequest";
import {ChangePasswordRequest} from "../types/user/ChangePasswordRequest";
import {StudentListResponse} from "../types/student/StudentListResponse";
import {StudentListRequestParams} from "../types/student/StudentListRequestParams";
import {StudentResponse} from "../types/student/StudentResponse";
import {UpdateStudentRequest} from "../types/student/UpdateStudentRequest";
import {SERVER_ADDRESS, SERVER_PORT, SERVER_PROTOCOL} from "../env";

const transformErrorResponse = (response: { status: string | number }) => {
    return {
        message: response.data?.message,
        status: response.status
    }
}

export const scholaBlogApi = createApi({
    reducerPath: "api",
    tagTypes: ['Post', 'User', 'Student'],
    baseQuery: fetchBaseQuery({
        baseUrl: `${SERVER_PROTOCOL}://${SERVER_ADDRESS}:${SERVER_PORT}`,
        timeout: 10000,
        prepareHeaders: (headers, {getState}) => {
            if (!headers.has('Content-Type')) {
                headers.set('Content-Type', 'application/json');
            }

            const token = (getState() as RootState).user.token;

            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }

            return headers;
        }
    }),

    endpoints: (builder) => ({
        login: builder.mutation<LoginResponse, LoginRequest>({
            query: (request) => ({
                url: "user/login",
                method: "POST",
                body: JSON.stringify(request)
            }),
            transformResponse: (response: LoginResponse, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
            invalidatesTags: ["Post", "User", "Student"],
        }),
        currentUser: builder.mutation<UserResponse, undefined>({
            query: () => ({
                url: "user/current",
                method: "GET"
            }),
            transformResponse: (response: UserResponse, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),
        currentUserRoles: builder.mutation<UserRolesResponse, undefined>({
            query: () => ({
                url: "user/roles/current",
                method: "GET"
            }),
            transformResponse: (response: UserRolesResponse, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),
        users: builder.query<UserListResponse, UserListRequestParams>({
            query: (params: UserListRequestParams) => {
                const searchParams = new URLSearchParams();

                if (params) {
                    if (params.username) {
                        searchParams.set("username", params.username);
                    }

                    if (params.name) {
                        searchParams.set("name", params.name);
                    }

                    if (params.email) {
                        searchParams.set("email", params.email);
                    }

                    if (params.active !== undefined) {
                        searchParams.set("active", params.active.toString());
                    }

                    if (params.userRole) {
                        searchParams.set("userRole", params.userRole);
                    }

                    if (params.sortBy && params.sortOrder) {
                        searchParams.set("sortBy", params.sortBy);
                        searchParams.set("sortOrder", params.sortOrder);
                    }

                    if (params.page != undefined) {
                        searchParams.set("page", params.page.toString());
                    }

                    if (params.pageSize != undefined) {
                        searchParams.set("pageSize", params.pageSize.toString());
                    }
                }

                return `user?${searchParams.toString()}`;
            },
            providesTags: (result, error, arg) => {
                return result
                    ? [
                        ...result.data.map(({id}) => ({type: 'User' as const, id})),
                        {type: 'User', id: 'LIST'},
                    ]
                    : [{type: 'User', id: 'LIST'}]
            },
            serializeQueryArgs: ({endpointName}) => {
                return endpointName;
            },
            forceRefetch({currentArg, previousArg}): boolean {
                return currentArg?.page !== previousArg?.page;
            },
            transformResponse: (response: UserListResponse, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),
        createUser: builder.mutation<void, CreateUserRequest>({
            query: (request: CreateUserRequest) => ({
                url: `user`,
                method: "POST",
                body: JSON.stringify(request)
            }),
            transformResponse: (response: void, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),
        updateUser: builder.mutation<UserResponse, UpdateUserRequest>({
            query: (request: UpdateUserRequest) => ({
                url: `user/${request.userId}`,
                method: "PATCH",
                body: JSON.stringify(request.userContent)
            }),
            transformResponse: (response: UserResponse, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),
        changeUserPassword: builder.mutation<UserResponse, ChangePasswordRequest>({
            query: (request: ChangePasswordRequest) => ({
                url: `user/password/${request.userId}`,
                method: "PATCH",
                body: JSON.stringify(request.content)
            }),
            transformResponse: (response: UserResponse, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),
        userRoles: builder.query<UserRolesResponse, number>({
            query: (userId: number) => ({
                url: `user/roles/${userId}`,
                method: "GET"
            }),
            transformResponse: (response: UserRolesResponse, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),
        updateUserRoles: builder.mutation<UserRolesResponse, UpdateUserRolesRequest>({
            query: (request: UpdateUserRolesRequest) => ({
                url: `user/roles/${request.userId}`,
                method: "PUT",
                body: JSON.stringify(request.content)
            }),
            transformResponse: (response: UserRolesResponse, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),

        subject: builder.query<SubjectResponse[], undefined>({
            query: () => ({
                url: "subject",
                method: "GET"
            }),
            transformResponse: (response: SubjectResponse[], meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),

        teachingLevel: builder.query<TeachingLevelResponse[], undefined>({
            query: () => ({
                url: "teachinglevel",
                method: "GET"
            }),
            transformResponse: (response: TeachingLevelResponse[], meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),

        teachingGrade: builder.query<TeachingGradeResponse[], number>({
            query: (teachingLevel) => ({
                url: `teachinggrade/teachinglevel/${teachingLevel}`,
                method: "GET"
            }),
            transformResponse: (response: TeachingGradeResponse[], meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),

        teacher: builder.query<UserResponse[], undefined>({
            query: () => ({
                url: `user/withPosts`,
                method: "GET"
            }),
            transformResponse: (response: UserResponse[], meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),

        posts: builder.query<PostListResponse, PostListRequestParams>({
            query: (params: PostListRequestParams) => {
                const searchParams = new URLSearchParams();

                if (params) {
                    if (params.fullContent) {
                        searchParams.set("fullContent", params.fullContent);
                    }

                    if (params.subjectId != undefined) {
                        searchParams.set("subjectId", params.subjectId.toString());
                    }

                    if (params.teachingLevelId != undefined) {
                        searchParams.set("teachingLevelId", params.teachingLevelId.toString());
                    }

                    if (params.teachingGradeId != undefined) {
                        searchParams.set("teachingGradeId", params.teachingGradeId.toString());
                    }

                    if (params.userId != undefined) {
                        searchParams.set("userId", params.userId.toString());
                    }

                    if (params.sortBy) {
                        searchParams.set("sortBy", params.sortBy);
                    }

                    if (params.sortOrder) {
                        searchParams.set("sortOrder", params.sortOrder);
                    }

                    if (params.page != undefined) {
                        searchParams.set("page", params.page.toString());
                    }

                    if (params.pageSize != undefined) {
                        searchParams.set("pageSize", params.pageSize.toString());
                    }
                }

                return `post?${searchParams.toString()}`;
            },
            providesTags: (result, error, arg) => {
                return result
                    ? [
                        ...result.data.map(({id}) => ({type: 'Post' as const, id})),
                        {type: 'Post', id: 'LIST'},
                    ]
                    : [{type: 'Post', id: 'LIST'}]
            },
            serializeQueryArgs: ({endpointName}) => {
                return endpointName;
            },
            merge(currentCacheData: PostListResponse, responseData: PostListResponse, {arg}): void | PostListResponse {
                if (arg.page == 0) {
                    currentCacheData.data = responseData.data;
                } else {
                    const existingIds = new Set(currentCacheData.data.map((post) => post.id));
                    const newItems = responseData.data.filter((post) => !existingIds.has(post.id));

                    currentCacheData.data.push(...newItems)
                }

                currentCacheData.page = responseData.page;
                currentCacheData.total = responseData.total;
                currentCacheData.pageSize = responseData.pageSize;
            },
            forceRefetch({currentArg, previousArg}): boolean {
                return currentArg?.page !== previousArg?.page;
            },
            transformResponse: (response: PostListResponse, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),

        deletePost: builder.mutation<void, number>({
            query: (postId: number) => ({
                url: `post/${postId}`,
                method: "DELETE"
            }),
            transformResponse: (response: void, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),

        createPost: builder.mutation<void, CreatePostRequest>({
            query: (request: CreatePostRequest) => ({
                url: `post`,
                method: "POST",
                body: JSON.stringify(request)
            }),
            transformResponse: (response: void, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),

        updatePost: builder.mutation<void, UpdatePostRequest>({
            query: (request: UpdatePostRequest) => ({
                url: `post/${request.postId}`,
                method: "PATCH",
                body: JSON.stringify(request.postContent)
            }),
            transformResponse: (response: void, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),

        students: builder.query<StudentListResponse, StudentListRequestParams>({
            query: (params: StudentListRequestParams) => {
                const searchParams = new URLSearchParams();

                if (params) {
                    if (params.name) {
                        searchParams.set("name", params.name);
                    }

                    if (params.email) {
                        searchParams.set("email", params.email);
                    }

                    if (params.teachingLevelId !== undefined) {
                        searchParams.set("teachingLevelId", params.teachingLevelId.toString());
                    }

                    if (params.teachingGradeId !== undefined) {
                        searchParams.set("teachingGradeId", params.teachingGradeId.toString());
                    }

                    if (params.sortBy && params.sortOrder) {
                        searchParams.set("sortBy", params.sortBy);
                        searchParams.set("sortOrder", params.sortOrder);
                    }

                    if (params.page != undefined) {
                        searchParams.set("page", params.page.toString());
                    }

                    if (params.pageSize != undefined) {
                        searchParams.set("pageSize", params.pageSize.toString());
                    }
                }

                return `student?${searchParams.toString()}`;
            },
            providesTags: (result, error, arg) => {
                return result
                    ? [
                        ...result.data.map(({id}) => ({type: 'Student' as const, id})),
                        {type: 'Student', id: 'LIST'},
                    ]
                    : [{type: 'Student', id: 'LIST'}]
            },
            serializeQueryArgs: ({endpointName}) => {
                return endpointName;
            },
            forceRefetch({currentArg, previousArg}): boolean {
                return currentArg?.page !== previousArg?.page;
            },
            transformResponse: (response: StudentListResponse, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),
        updateStudent: builder.mutation<StudentResponse, UpdateStudentRequest>({
            query: (request: UpdateStudentRequest) => ({
                url: `student/${request.studentId}`,
                method: "PUT",
                body: JSON.stringify(request.studentContent)
            }),
            transformResponse: (response: StudentResponse, meta, arg) => response,
            transformErrorResponse: transformErrorResponse,
        }),
    }),
});

export const {
    useLoginMutation,
    useCurrentUserMutation,
    useCurrentUserRolesMutation,
    useLazySubjectQuery,
    useLazyTeachingLevelQuery,
    useLazyTeachingGradeQuery,
    useLazyTeacherQuery,
    useLazyPostsQuery,
    useDeletePostMutation,
    useCreatePostMutation,
    useUpdatePostMutation,
    useLazyUsersQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useLazyUserRolesQuery,
    useUpdateUserRolesMutation,
    useChangeUserPasswordMutation,
    useLazyStudentsQuery,
    useUpdateStudentMutation
} = scholaBlogApi;