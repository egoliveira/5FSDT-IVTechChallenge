import {inject, injectable} from "tsyringe";
import {TeachingGradeEntity} from "../entity/TeachingGradeEntity";
import {TeachingGrade} from "../../domain/vo/teachinggrade/TeachingGrade";
import {TeachingLevel} from "../../domain/vo/teachinglevel/TeachingLevel";
import {TeachingLevelMapper} from "./TeachingLevelMapper";
import {TeachingLevelEntity} from "../entity/TeachingLevelEntity";

@injectable()
export class TeachingGradeMapper {
    constructor(@inject(TeachingLevelMapper) private readonly teachingLevelMapper: TeachingLevelMapper) {
    }

    fromTeachingGradeEntity(entity: TeachingGradeEntity): TeachingGrade {
        let teachingLevel: TeachingLevel | undefined = undefined;

        if (entity.teachingLevel) {
            teachingLevel = this.teachingLevelMapper.fromTeachingLevelEntity(entity.teachingLevel);
        }

        return new TeachingGrade(
            entity.id,
            entity.teachingLevelId,
            teachingLevel,
            entity.name,
            entity.order,
            entity.createdAt,
            entity.updatedAt
        )
    }

    toTeachingGradeEntity(teachingGrade: TeachingGrade): TeachingGradeEntity {
        let teachingLevelEntity: TeachingLevelEntity | undefined = undefined;

        if (teachingGrade.teachingLevel) {
            teachingLevelEntity = this.teachingLevelMapper.toTeachingLevelEntity(teachingGrade.teachingLevel);
        }

        return new TeachingGradeEntity(
            teachingGrade.id,
            teachingGrade.teachingLevelId,
            teachingLevelEntity,
            teachingGrade.name,
            teachingGrade.order,
            teachingGrade.createdAt,
            teachingGrade.updatedAt
        )
    }

    fromTeachingGradeEntities(entities: TeachingGradeEntity[]): TeachingGrade[] {
        return entities.map((entity) => this.fromTeachingGradeEntity(entity));
    }
}