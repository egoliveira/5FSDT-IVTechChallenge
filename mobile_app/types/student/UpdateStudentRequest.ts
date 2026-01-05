export class UpdateStudentRequest {
    readonly studentId: number;
    readonly studentContent: StudentContent;

    constructor(studentId: number, studentContent: StudentContent) {
        this.studentId = studentId;
        this.studentContent = studentContent;
    }
}

export class StudentContent {
    readonly teachingGradeId: number;

    constructor(teachingGradeId: number) {
        this.teachingGradeId = teachingGradeId;
    }
}