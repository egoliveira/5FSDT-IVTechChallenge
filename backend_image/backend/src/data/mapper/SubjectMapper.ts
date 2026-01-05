import {injectable} from "tsyringe";
import {SubjectEntity} from "../entity/SubjectEntity";
import {Subject} from "../../domain/vo/subject/Subject";

@injectable()
export class SubjectMapper {
    fromSubjectEntity(entity: SubjectEntity): Subject {
        return new Subject(
            entity.id,
            entity.name,
            entity.createdAt,
            entity.updatedAt
        )
    }

    toSubjectEntity(subject: Subject): SubjectEntity {
        return new SubjectEntity(
            subject.id,
            subject.name,
            subject.createdAt,
            subject.updatedAt
        )
    }

    fromSubjectEntities(entities: SubjectEntity[]): Subject[] {
        return entities.map((subject) => this.fromSubjectEntity(subject));
    }
}