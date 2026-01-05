import {UseCase} from "../UseCase";
import {inject, injectable} from "tsyringe";
import {PostRepository} from "../../repository/PostRepository";

@injectable()
export class DeletePostByIdUseCase implements UseCase<number, boolean> {
    constructor(
        @inject("PostRepository") private readonly postRepository: PostRepository
    ) {
    }

    async execute(params: number): Promise<boolean> {
        return this.postRepository.deleteById(params);
    }
}