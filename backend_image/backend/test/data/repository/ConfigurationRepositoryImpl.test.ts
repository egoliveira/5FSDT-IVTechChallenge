import {describe} from "node:test";
import {MockProxy} from "jest-mock-extended/lib/Mock";
import {mock, mockReset} from "jest-mock-extended";
import {DataSource} from "typeorm";
import {ConfigurationRepositoryImpl} from "../../../src/data/repository/ConfigurationRepositoryImpl";

describe('ConfigurationRepositoryImpl class tests', () => {
    let dataSources: MockProxy<DataSource>;

    let repository: ConfigurationRepositoryImpl;

    beforeEach(() => {
        dataSources = mock<DataSource>();

        repository = new ConfigurationRepositoryImpl(dataSources);
    });

    afterEach(() => {
        mockReset(dataSources);

        jest.restoreAllMocks();
    });

    test('Should connect to database successfully when connectDatabase method is executed', async () => {
        // Arrange

        Object.defineProperty(dataSources, 'isInitialized', {value: false});

        // Act

        await repository.connectDatabase()

        // Assert

        expect(dataSources.initialize).toHaveBeenCalled();
    });

    test('Should not connect to database successfully due to database is already connected when connectDatabase method is executed', async () => {
        // Arrange

        Object.defineProperty(dataSources, 'isInitialized', {value: true});

        // Act

        await repository.connectDatabase()
    });
});