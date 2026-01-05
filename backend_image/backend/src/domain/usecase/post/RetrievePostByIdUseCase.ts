import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {Post} from "../../vo/post/Post";
import {PostRepository} from "../../repository/PostRepository";

@injectable()
export class RetrievePostByIdUseCase implements UseCase<number, Post | undefined> {
    constructor(
        @inject("PostRepository") private readonly postRepository: PostRepository
    ) {
    }

    async execute(params: number): Promise<Post | undefined> {
        return this.postRepository.getById(params);
    }
}