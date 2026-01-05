import "reflect-metadata";
import {describe} from "node:test";
import {
    RetrievePasswordHashUseCase,
    RetrievePasswordHashUseCaseParams
} from "../../../../src/domain/usecase/user/RetrievePasswordHashUseCase";

describe('RetrievePasswordHashUseCase class tests', () => {
    let useCase: RetrievePasswordHashUseCase;

    beforeEach(() => {
        useCase = new RetrievePasswordHashUseCase();
    });

    test('Should return a password hash successfully when use case is executed', async () => {
        // Act

        const params = new RetrievePasswordHashUseCaseParams('teste123', '$2b$10$cLCx2K/n.fifXma00IqTze');

        const hash = await useCase.execute(params);

        // Assert
        
        expect(hash).toEqual('$2b$10$cLCx2K/n.fifXma00IqTzeG3cjK2k6GHAMhFEHvnwX9ag4XFUdY5q');
    });
});