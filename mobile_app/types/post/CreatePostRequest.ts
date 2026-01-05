export class CreatePostRequest {
    readonly title: string;
    readonly content: string;
    readonly subjectId: number;
    readonly teachingGradeId: number;

    constructor(title: string, content: string, subjectId: number, teachingGradeId: number) {
        this.title = title;
        this.content = content;
        this.subjectId = subjectId;
        this.teachingGradeId = teachingGradeId;
    }
}