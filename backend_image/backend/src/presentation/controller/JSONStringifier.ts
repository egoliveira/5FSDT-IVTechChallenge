import {jsonIgnoreReplacer} from "json-ignore";

export function jsonStringifier(data: any): string {
    return JSON.stringify(data, jsonIgnoreReplacer);
}