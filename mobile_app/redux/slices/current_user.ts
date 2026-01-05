import {useSelector} from "react-redux";
import {RootState} from "../store";
import {UserResponse} from "../../types/user/UserResponse";

export function currentUser() {
    return useSelector((state: RootState) => {
        const userId = state.user.userId;
        const username = state.user.username;
        const name = state.user.name;
        const email = state.user.email;
        const active = state.user.active;

        let user: UserResponse | null = null;

        if ((userId != null) && (username != null) && (name != null) && (email != null) && (active != null)) {
            user = new UserResponse(userId, username, name, email, Boolean((JSON.parse(active))));
        }

        return user;
    });
}