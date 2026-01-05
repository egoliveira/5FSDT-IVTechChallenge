export class UpdatePostRequest {
    readonly postId: number;
    readonly postContent: PostContent;

    constructor(postId: number, postContent: PostContent) {
        this.postId = postId;
        this.postContent = postContent;
    }
}

export class PostContent {
    readonly title: string | undefined;
    readonly content: string | undefined;
    readonly subjectId: number | undefined;
    readonly teachingGradeId: number | undefined;

    constructor(title: string | undefined, content: string | undefined, subjectId: number | undefined,
                teachingGradeId: number | undefined) {
        this.title = title;
        this.content = content;
        this.subjectId = subjectId;
        this.teachingGradeId = teachingGradeId;
    }
}