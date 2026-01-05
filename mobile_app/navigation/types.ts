import {PostResponse} from "../types/post/PostResponse";
import {UserResponse} from "../types/user/UserResponse";
import {StudentResponse} from "../types/student/StudentResponse";

export type RootStackParamList = {
    ViewPost: { post: PostResponse; };
    CreateEditPost: { post?: PostResponse; };
    ViewUser: { user: UserResponse; };
    ViewStudent: { student: StudentResponse; };
};