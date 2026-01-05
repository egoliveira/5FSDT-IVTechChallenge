import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {Post} from "../../vo/post/Post";
import {PostRepository} from "../../repository/PostRepository";
import {BusinessLogicError} from "../../error/BusimessLogicError";
import {TeachingGradeRepository} from "../../repository/TeachingGradeRepository";
import {SubjectRepository} from "../../repository/SubjectRepository";

@injectable()
export class UpdatePostUseCase implements UseCase<UpdatePostUseCaseParams, Post | undefined> {
    constructor(
        @inject("PostRepository") private readonly postRepository: PostRepository,
        @inject("TeachingGradeRepository") private readonly teachingGradeRepository: TeachingGradeRepository,
        @inject("SubjectRepository") private readonly subjectRepository: SubjectRepository
    ) {
    }

    async execute(params: UpdatePostUseCaseParams): Promise<Post | undefined> {
        if (params.teachingGradeId) {
            const teachingGrade = await this.teachingGradeRepository.getById(params.teachingGradeId);

            if (!teachingGrade) {
                throw new BusinessLogicError('Invalid teaching grade id.');
            }
        }

        if (params.subjectId) {
            const subject = await this.subjectRepository.getById(params.subjectId);

            if (!subject) {
                throw new BusinessLogicError('Invalid subject id.');
            }
        }

        return this.postRepository.update(params.id, params.title, params.content, params.subjectId,
            params.teachingGradeId);
    }
}

export class UpdatePostUseCaseParams {
    constructor(
        readonly id: number,
        readonly title?: string,
        readonly content?: string,
        readonly subjectId?: number,
        readonly teachingGradeId?: number
    ) {
    }
}