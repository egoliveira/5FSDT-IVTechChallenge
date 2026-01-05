import {injectable} from "tsyringe";
import {Post} from "../../domain/vo/post/Post";
import {objectOutputType, ZodNumber, ZodString, ZodType} from "zod";
import {Subject} from "../../domain/vo/subject/Subject";
import {TeachingGrade} from "../../domain/vo/teachinggrade/TeachingGrade";

@injectable()
export class PostMapper {
    fromZodObject(zodPost: objectOutputType<{
        title: ZodString;
        content: ZodString;
        subjectId: ZodNumber;
        teachingGradeId: ZodNumber
    }, ZodType<any, any, any>, "strip">): Post {
        return new Post(0,
            zodPost.title,
            zodPost.content,
            undefined,
            undefined,
            zodPost.subjectId,
            new Subject(zodPost.subjectId),
            zodPost.teachingGradeId,
            new TeachingGrade(zodPost.teachingGradeId)
        );
    }
}