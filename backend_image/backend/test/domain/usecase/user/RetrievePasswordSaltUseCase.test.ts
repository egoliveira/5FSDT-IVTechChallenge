import "reflect-metadata";
import {describe} from "node:test";
import {RetrievePasswordSaltUseCase} from "../../../../src/domain/usecase/user/RetrievePasswordSaltUseCase";

describe('RetrievePasswordSaltUseCase class tests', () => {
    let useCase: RetrievePasswordSaltUseCase;

    beforeEach(() => {
        useCase = new RetrievePasswordSaltUseCase();
    });

    test('Should return a password salt successfully when use case is executed', async () => {
        // Act

        const salt = await useCase.execute();

        // Assert
        
        expect(salt).toBeDefined();
    });
});