import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {Post} from "../../vo/post/Post";
import {PostRepository} from "../../repository/PostRepository";
import {TeachingGradeRepository} from "../../repository/TeachingGradeRepository";
import {BusinessLogicError} from "../../error/BusimessLogicError";
import {SubjectRepository} from "../../repository/SubjectRepository";

@injectable()
export class CreatePostUseCase implements UseCase<Post, Post> {
    constructor(
        @inject("PostRepository") private readonly postRepository: PostRepository,
        @inject("TeachingGradeRepository") private readonly teachingGradeRepository: TeachingGradeRepository,
        @inject("SubjectRepository") private readonly subjectRepository: SubjectRepository
    ) {
    }

    async execute(params: Post): Promise<Post> {
        const teachingGrade = await this.teachingGradeRepository.getById(params.teachingGradeId);

        if (!teachingGrade) {
            throw new BusinessLogicError('Invalid teaching grade id.');
        }

        const subject = await this.subjectRepository.getById(params.subjectId);

        if (!subject) {
            throw new BusinessLogicError('Invalid subject id.');
        }

        const post = await this.postRepository.create(params);

        return await this.postRepository.getById(post.id) || post;
    }
}