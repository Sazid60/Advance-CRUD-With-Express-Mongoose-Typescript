import { TStudent } from './student.interface';
import { Student } from './student.schema';

const createStudentInDB = async (studentData: TStudent) => {
  // const result = await StudentModel.create(student); // builtin mongoose static method

  // _______________using custom instance method_________________________
  //   const student = new Student(studentData); //create an instance

  //   if (await student.isUserExists(studentData.id)) {
  //     throw new Error('User Already Exists');
  //   }
  //   const result = await student.save(); //builtin instance method
  //   return result;
  // };
  // _________________________________________________________________

  // *************Using Static Instance Method*************************
  if (await Student.isUserExists(studentData.id)) {
    throw new Error('User Already Exists');
  }
  const result = await Student.create(studentData);
  return result;
};

// *******************************************************************
// getting data service
const getAllStudentsFromDB = async () => {
  const result = await Student.find();
  return result;
};

// get single student from db
const getSingleStudentFromDB = async (id: string) => {
  // const result = await Student.findOne({ id });

  // using aggregate
  const result = await Student.aggregate([{ $match: { id: id } }]);
  return result;
};
// delete single student from db
const deleteStudentFromDB = async (id: string) => {
  const result = await Student.updateOne({ id }, { isDeleted: true });
  return result;
};
export const StudentServices = {
  createStudentInDB,
  getAllStudentsFromDB,
  getSingleStudentFromDB,
  deleteStudentFromDB,
};
