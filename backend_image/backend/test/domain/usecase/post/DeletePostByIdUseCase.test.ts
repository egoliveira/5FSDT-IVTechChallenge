import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {PostRepository} from "../../../../src/domain/repository/PostRepository";
import {DeletePostByIdUseCase} from "../../../../src/domain/usecase/post/DeletePostByIdUseCase";

describe('DeletePostByIdUseCase class tests', () => {
    let postRepository: MockProxy<PostRepository>;

    let useCase: DeletePostByIdUseCase;

    beforeEach(() => {
        postRepository = mock<PostRepository>();

        useCase = new DeletePostByIdUseCase(postRepository);
    });

    afterEach(() => {
        mockReset(postRepository);

        jest.restoreAllMocks();
    })

    test('Should delete a post by its id successfully when use case is executed', async () => {
        // Prepare

        postRepository.deleteById.calledWith(1).mockReturnValue(Promise.resolve(true));

        // Act

        const result = await useCase.execute(1);

        // Assert

        expect(result).toBeTruthy();

        expect(postRepository.deleteById).toHaveBeenCalledWith(1);
    });

    test('Should not delete a post by its id successfully due to invalid post id when use case is executed', async () => {
        // Prepare

        postRepository.deleteById.calledWith(2).mockReturnValue(Promise.resolve(false));

        // Act

        const result = await useCase.execute(2);

        // Assert

        expect(result).toBeFalsy();

        expect(postRepository.deleteById).toHaveBeenCalledWith(2);
    });
});