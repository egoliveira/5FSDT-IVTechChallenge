import express from "express";
import {authorizationHandler} from "../middleware/authorization_handler";
import {roleHandler} from "../middleware/role_handler";
import {
    changeUserPasswordController,
    createUserController,
    findUsersController,
    loginController,
    retrieveCurrentUserController,
    retrieveCurrentUserRolesController,
    retrieveUserController,
    retrieveUserRolesController,
    retrieveUsersWithPostsController,
    updateUserController,
    updateUserRolesController
} from "../controller/UserController";
import {retrieveTeachingLevelsController} from "../controller/TeachingLevelController";
import {retrieveTeachingGradesController} from "../controller/TeachingGradeController";
import {retrieveSubjectsController} from "../controller/SubjectController";
import {
    findStudentsController,
    retrieveStudentController,
    updateStudentController
} from "../controller/StudentController";
import {
    createPostController,
    deletePostController,
    findPostsController,
    retrievePostController,
    updatePostController
} from "../controller/PostController";
import {optionalAuthorizationHandler} from "../middleware/optional_authorization_handler";

const router = express.Router();

// User routes
router.get('/user/withPosts', retrieveUsersWithPostsController);
router.get('/user/current', authorizationHandler, roleHandler, retrieveCurrentUserController);
router.post('/user', authorizationHandler, roleHandler, createUserController);
router.get('/user', authorizationHandler, roleHandler, findUsersController);
router.get('/user/:userId', authorizationHandler, roleHandler, retrieveUserController);
router.patch('/user/:userId', authorizationHandler, roleHandler, updateUserController);
router.patch('/user/password/:userId', authorizationHandler, roleHandler, changeUserPasswordController);
router.post('/user/login', loginController);
router.get('/user/roles/current', authorizationHandler, roleHandler, retrieveCurrentUserRolesController);
router.get('/user/roles/:userId', authorizationHandler, roleHandler, retrieveUserRolesController);
router.put('/user/roles/:userId', authorizationHandler, roleHandler, updateUserRolesController);

// Teaching level routes
router.get('/teachinglevel', retrieveTeachingLevelsController);

// Teaching grade routes
router.get('/teachinggrade/teachinglevel/:teachingLevelId', retrieveTeachingGradesController);

// Subject routes
router.get('/subject', retrieveSubjectsController);

// Student routes
router.get('/student', authorizationHandler, roleHandler, findStudentsController);
router.get('/student/:studentId', authorizationHandler, roleHandler, retrieveStudentController);
router.put('/student/:studentId', authorizationHandler, roleHandler, updateStudentController);

// Post routes
router.get('/post', optionalAuthorizationHandler, findPostsController);
router.get('/post/:postId', retrievePostController);
router.post('/post', authorizationHandler, roleHandler, createPostController);
router.patch('/post/:postId', authorizationHandler, roleHandler, updatePostController);
router.delete('/post/:postId', authorizationHandler, roleHandler, deletePostController);

export default router;