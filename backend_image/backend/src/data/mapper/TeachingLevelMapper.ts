import {injectable} from "tsyringe";
import {TeachingLevelEntity} from "../entity/TeachingLevelEntity";
import {TeachingLevel} from "../../domain/vo/teachinglevel/TeachingLevel";

@injectable()
export class TeachingLevelMapper {
    fromTeachingLevelEntity(entity: TeachingLevelEntity): TeachingLevel {
        return new TeachingLevel(
            entity.id,
            entity.name,
            entity.order,
            entity.createdAt,
            entity.updatedAt
        )
    }

    toTeachingLevelEntity(teachingLevel: TeachingLevel): TeachingLevelEntity {
        return new TeachingLevelEntity(
            teachingLevel.id,
            teachingLevel.name,
            teachingLevel.order,
            teachingLevel.createdAt,
            teachingLevel.updatedAt
        )
    }

    fromTeachingLevelEntities(entities: TeachingLevelEntity[]): TeachingLevel[] {
        return entities.map((teachingLevel) => this.fromTeachingLevelEntity(teachingLevel));
    }
}