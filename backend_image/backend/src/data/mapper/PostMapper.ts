import {inject, injectable} from "tsyringe";
import {Post} from "../../domain/vo/post/Post";
import {PostEntity} from "../entity/PostEntity";
import {UserMapper} from "./UserMapper";
import {SubjectMapper} from "./SubjectMapper";
import {TeachingGradeMapper} from "./TeachingGradeMapper";
import {UserEntity} from "../entity/UserEntity";
import {SubjectEntity} from "../entity/SubjectEntity";
import {User} from "../../domain/vo/user/User";
import {Subject} from "../../domain/vo/subject/Subject";
import {TeachingGrade} from "../../domain/vo/teachinggrade/TeachingGrade";
import {TeachingGradeEntity} from "../entity/TeachingGradeEntity";

@injectable()
export class PostMapper {
    constructor(
        @inject(UserMapper) private readonly userMapper: UserMapper,
        @inject(SubjectMapper) private readonly subjectMapper: SubjectMapper,
        @inject(TeachingGradeMapper) private readonly teachingGradeMapper: TeachingGradeMapper
    ) {
    }

    toPostEntity(post: Post): PostEntity {
        let userEntity: UserEntity | undefined = undefined;
        let subjectEntity: SubjectEntity | undefined = undefined;
        let teachingGradeEntity: TeachingGradeEntity | undefined = undefined;

        if (post.user) {
            userEntity = this.userMapper.toUserEntity(post.user);
        }

        if (post.subject) {
            subjectEntity = this.subjectMapper.toSubjectEntity(post.subject);
        }

        if (post.teachingGrade) {
            teachingGradeEntity = this.teachingGradeMapper.toTeachingGradeEntity(post.teachingGrade);
        }

        return new PostEntity(
            post.id,
            post.title,
            post.content,
            post.userId,
            userEntity,
            post.subjectId,
            subjectEntity,
            post.teachingGradeId,
            teachingGradeEntity,
            post.createdAt,
            post.updatedAt
        );
    }

    fromPostEntity(postEntity: PostEntity): Post {
        let user: User | undefined = undefined;
        let subject: Subject | undefined = undefined;
        let teachingGrade: TeachingGrade | undefined = undefined;

        if (postEntity.user) {
            user = this.userMapper.fromUserEntity(postEntity.user);
        }

        if (postEntity.subject) {
            subject = this.subjectMapper.fromSubjectEntity(postEntity.subject);
        }

        if (postEntity.teachingGrade) {
            teachingGrade = this.teachingGradeMapper.fromTeachingGradeEntity(postEntity.teachingGrade);
        }

        return new Post(
            postEntity.id,
            postEntity.title,
            postEntity.content,
            postEntity.userId,
            user,
            postEntity.subjectId,
            subject,
            postEntity.teachingGradeId,
            teachingGrade,
            postEntity.createdAt,
            postEntity.updatedAt
        );
    }

    fromPostEntities(postEntities: PostEntity[]): Post[] {
        return postEntities.map((postEntity) => {
            return this.fromPostEntity(postEntity);
        });
    }
}