import {useSelector} from "react-redux";
import {RootState} from "../store";
import {UserRolesResponse} from "../../types/roles/UserRolesResponse";

export function currentUserRoles() {
    return useSelector((state: RootState) => {
        const userId = state.user.userId;
        const admin = state.user.isAdmin;
        const teacher = state.user.isTeacher;
        const student = state.user.isStudent;

        let userRoles: UserRolesResponse | null = null;

        if ((userId != null) && (admin != null) && (teacher != null) && (student != null)) {
            userRoles = new UserRolesResponse(userId, admin, teacher, student);
        }

        return userRoles;
    });
}