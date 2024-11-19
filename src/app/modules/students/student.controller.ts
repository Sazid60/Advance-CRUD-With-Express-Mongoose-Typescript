import { Request, Response } from 'express';
import { StudentServices } from './student.services';
import Joi from 'joi';

const createStudent = async (req: Request, res: Response) => {
  try {
    //  creating a student validation using JOI
    const JoiValidationSchema = Joi.object({
      id: Joi.string(),
      name: {
        firstName: Joi.string().max(20).required(),
        middleName: Joi.string().max(20),
        lastName: Joi.string().max(20),
      },
      gender: Joi.string().required().valid(['male', 'female', 'other']),
    });
    const { student: studentData } = req.body;

    // will call service function to send this data
    const result = await StudentServices.createStudentInDB(studentData);

    // send response
    res.status(200).json({
      success: true,
      message: 'Student Is Created Successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};

// for getting all students
const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();
    // send response
    res.status(200).json({
      success: true,
      message: 'Students are retrieved successfully',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

// for getting single students
const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);
    // send response
    res.status(200).json({
      success: true,
      message: 'Students is retrieved successfully',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};
export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
