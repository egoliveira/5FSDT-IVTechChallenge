export class CreateUserRequest {
    readonly user: UserInfo;
    readonly userRoles: RolesInfo;

    constructor(username: string, name: string, password: string, email: string,
                admin: boolean, teacher: boolean, student: boolean) {
        this.user = new UserInfo(username, name, password, email);
        this.userRoles = new RolesInfo(admin, teacher, student);
    }
}

class UserInfo {
    readonly username: string;
    readonly name: string;
    readonly password: string;
    readonly email: string;

    constructor(username: string, name: string, password: string, email: string) {
        this.username = username;
        this.name = name;
        this.password = password;
        this.email = email;
    }
}

class RolesInfo {
    readonly admin: boolean;
    readonly teacher: boolean;
    readonly student: boolean;

    constructor(admin: boolean, teacher: boolean, student: boolean) {
        this.admin = admin;
        this.teacher = teacher;
        this.student = student;
    }
}