import express from 'express';
import { StudentController } from './student.controller';

const router = express.Router();

// this will call controller function
router.post('/create-student', StudentController.createStudent);

// get all students
router.get('/', StudentController.getAllStudents);
// get single students
router.get('/:studentId', StudentController.getSingleStudent);
// delete student
router.delete('/:studentId', StudentController.deleteStudent);
export const StudentRoutes = router;
