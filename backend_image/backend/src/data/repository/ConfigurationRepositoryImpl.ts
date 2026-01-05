import {ConfigurationRepository} from "../../domain/repository/ConfigurationRepository";
import {Logger} from "tslog";
import {DataSource} from "typeorm";

export class ConfigurationRepositoryImpl implements ConfigurationRepository {
    private readonly logger: Logger<any>;

    constructor(private readonly dataSource: DataSource) {
        this.logger = new Logger({name: 'ConfigurationRepositoryImpl'});
    }

    async connectDatabase(): Promise<void> {
        this.logger.debug(`Connecting database...`);

        if (!this.dataSource.isInitialized) {
            await this.dataSource.initialize();

            this.logger.debug(`Database connected successfully.`);
        } else {
            this.logger.debug(`Database is already connected.`);
        }
    }
}