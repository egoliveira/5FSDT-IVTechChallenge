import {RequestHandler} from "express";
import {AppRequest} from "./AppRequest";
import {AuthorizationError} from "../../domain/error/AuthorizationError";

export const roleHandler: RequestHandler = async (req: AppRequest, res, next) => {
    const params = Object.keys(req.params);

    const accessInfo = allAccessInfo.find((value) => {
        let paramsAreEqual = false;

        if (params.length == value.params.length) {
            paramsAreEqual = params.every((param, index) => param === value.params[index]);
        }

        return (paramsAreEqual) && (value.url === req.originalUrl) && (value.method === req.method)
    });

    if (accessInfo) {
        if ((accessInfo.admin && (accessInfo.admin === req.userRoles?.admin)) ||
            (accessInfo.teacher && (accessInfo.teacher === req.userRoles?.teacher)) ||
            (accessInfo.student && (accessInfo.student === req.userRoles?.student))) {
            next()
        } else {
            throw new AuthorizationError()
        }
    } else {
        next()
    }
}

class AccessInfo {
    constructor(
        readonly url: string,
        readonly method: string,
        readonly params: Array<string>,
        readonly admin: boolean,
        readonly teacher: boolean,
        readonly student: boolean) {
    }
}

const allAccessInfo = [
    new AccessInfo('/user', 'POST', [], true, false, false),
    new AccessInfo('/user', 'GET', [], true, false, false),
    new AccessInfo('/user/current', 'GET', [], true, true, true),
    new AccessInfo('/user', 'GET', ['userId'], true, false, false),
    new AccessInfo('/user', 'PATCH', ['userId'], true, false, false),
    new AccessInfo('/user/password', 'PATCH', ['userId'], true, false, false),
    new AccessInfo('/user/roles', 'GET', ['userId'], true, false, false),
    new AccessInfo('/user/roles', 'PUT', ['userId'], true, false, false),
    new AccessInfo('/user/roles/current', 'GET', ['userId'], true, true, true),
    new AccessInfo('/student', 'GET', [], false, true, false),
    new AccessInfo('/student', 'GET', ['studentId'], false, true, false),
    new AccessInfo('/student', 'PUT', ['studentId'], false, true, false),
    new AccessInfo('/post', 'POST', [], false, true, false),
    new AccessInfo('/post', 'PATCH', [], false, true, false),
    new AccessInfo('/post', 'DELETE', [], false, true, false),
];