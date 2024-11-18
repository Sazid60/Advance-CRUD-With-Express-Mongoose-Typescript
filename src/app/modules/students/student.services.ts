import { Student } from './student.interface';
import { StudentModel } from './student.schema';

const createStudentInDB = async (student: Student) => {
  const result = await StudentModel.create(student);
  return result;
};

// getting data service
const getAllStudentsFromDB = async () => {
  const result = await StudentModel.find();
  return result;
};

// get single student from db
const getSingleStudentFromDB = async (id: string) => {
  const result = await StudentModel.findOne({ id });
  return result;
};
export const StudentServices = {
  createStudentInDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
};
