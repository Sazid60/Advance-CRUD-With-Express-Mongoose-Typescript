import { TStudent } from './student.interface';
import { Student } from './student.schema';

const createStudentInDB = async (studentData: TStudent) => {
  // const result = await StudentModel.create(student); // builtin mongoose static method

  //  using instance method
  const student = new Student(studentData); //create an instance

  if (await student.isUserExists(studentData.id)) {
    throw new Error('User Already Exists');
  }
  const result = await student.save(); //builtin instance method
  return result;
};

// getting data service
const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};

// get single student from db
const getSingleStudentFromDB = async (id: string) => {
  const result = await Student.findOne({ id });
  return result;
};
export const StudentServices = {
  createStudentInDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
};
