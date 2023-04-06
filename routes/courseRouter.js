import express from "express";
import {
  addLecture,
  deleteCourse,
  deleteLecture,
  getAllCourses,
  getCourseLectures,
} from "../controllers/courseController.js";
import { createCourse } from "../controllers/courseController.js";
import {
  authorizeRoles,
  isAuthenticated,
  authorizeSubscribers,
} from "../middlewares/auth.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

//Get all courses without lectures
router.route("/courses").get(getAllCourses);

// create new course --only admin
router
  .route("/createcourse")
  .post(isAuthenticated, authorizeRoles, singleUpload, createCourse);

// add lectures , delete course , get course detail

router
  .route("/course/:id")
  .get(isAuthenticated, authorizeSubscribers, getCourseLectures)
  .post(isAuthenticated, authorizeRoles, singleUpload, addLecture)
  .delete(isAuthenticated, authorizeRoles, deleteCourse);

// delete lectures

router.route("/lecture").delete(isAuthenticated, authorizeRoles, deleteLecture);

export default router;
