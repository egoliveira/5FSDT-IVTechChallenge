export const ADMIN_ROLE_ID = 1;

export const TEACHER_ROLE_ID = 2;

export const STUDENT_ROLE_ID = 4;

export const ADMIN_ROLE_TAG = 'admin';

export const ADMIN_ROLE_NAME = "Administrador";

export const TEACHER_ROLE_TAG = 'teacher';

export const TEACHER_ROLE_NAME = "Professor";

export const STUDENT_ROLE_TAG = 'student';

export const STUDENT_ROLE_NAME = "Aluno";

export class UserRole {
    readonly id: number;
    readonly name: string;
    readonly tag: string;

    constructor(id: number, name: string, tag: string) {
        this.id = id;
        this.name = name;
        this.tag = tag;
    }
}

export const ADMIN_USER_ROLE = new UserRole(ADMIN_ROLE_ID, ADMIN_ROLE_NAME, ADMIN_ROLE_TAG);

export const TEACHER_USER_ROLE = new UserRole(TEACHER_ROLE_ID, TEACHER_ROLE_NAME, TEACHER_ROLE_TAG);

export const STUDENT_USER_ROLE = new UserRole(STUDENT_ROLE_ID, STUDENT_ROLE_NAME, STUDENT_ROLE_TAG);

export const USER_ROLES = [
    ADMIN_USER_ROLE,
    TEACHER_USER_ROLE,
    STUDENT_USER_ROLE
]