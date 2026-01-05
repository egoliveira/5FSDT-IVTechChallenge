import "reflect-metadata";
import {describe} from "node:test";
import {mock, mockReset} from "jest-mock-extended";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {ConnectDatabaseUseCase} from "../../../../src/domain/usecase/config/ConnectDatabaseUseCase";
import {ConfigurationRepository} from "../../../../src/domain/repository/ConfigurationRepository";

describe('ConnectDatabaseUseCase class tests', () => {
    let configurationRepository: MockProxy<ConfigurationRepository>;

    let useCase: ConnectDatabaseUseCase;

    beforeEach(() => {
        configurationRepository = mock<ConfigurationRepository>();

        useCase = new ConnectDatabaseUseCase(configurationRepository);
    });

    afterEach(() => {
        mockReset(configurationRepository);

        jest.restoreAllMocks();
    })

    test('Should connect database successfully when use case is executed', async () => {
        // Prepare

        configurationRepository.connectDatabase.mockReturnValue();

        // Act

        const result = await useCase.execute();

        // Assert

        expect(configurationRepository.connectDatabase).toHaveBeenCalled();
    });
});