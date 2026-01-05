import {TeachingLevel} from "../vo/teachinglevel/TeachingLevel";

export interface TeachingLevelRepository {
    getAll(): Promise<TeachingLevel[]>;
}