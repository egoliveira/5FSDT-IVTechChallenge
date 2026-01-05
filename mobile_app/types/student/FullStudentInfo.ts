export interface FullStudentInfo {
    userInfo: UserInfo;
    studentInfo: StudentInfo;
}

export interface UserInfo {
    id: number;
    username: string;
    name: string;
    email: string;
    active: boolean;
}

export interface StudentInfo {
    id: number;
    teachingLevelId: number | undefined;
    teachingLevelName: string | undefined;
    teachingGradeId: number | undefined;
    teachingGradeName: string | undefined;
}