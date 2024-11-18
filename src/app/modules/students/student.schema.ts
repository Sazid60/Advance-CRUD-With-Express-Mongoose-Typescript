import { Schema, model } from 'mongoose';
import {
  Guardian,
  LocalGuardian,
  Student,
  UserName,
} from './student.interface';

// sub schema
const userNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is Required'],
  },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: {
    type: String,
    required: [true, 'Father Name is Required'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation is Required'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father Contact No is Required'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother Name is Required'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation is Required'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother Contact No is Required'],
  },
});

const localGuardian = new Schema<LocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local Guardian Name is Required'],
  },
  occupation: {
    type: String,
    required: [true, 'Local Guardian Occupation is Required'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian Contact No is Required'],
  },
  address: {
    type: String,
    required: [true, 'Local Guardian Address is Required'],
  },
});

// Main Schema
const studentSchema = new Schema<Student>({
  id: {
    type: String,
    required: true,
    unique: true,
  },

  name: {
    type: userNameSchema,
    required: [true, 'Student Name is Required'],
  },

  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message:
        '{VALUE} is not valid Gender must be either "male", "female", or "other"',
    },
    required: [true, 'Gender is Required'],
  },

  dateOfBirth: {
    type: String,
    required: [true, 'Date of Birth is Required'],
  },

  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: true,
  },

  contactNo: {
    type: String,
    required: [true, 'Contact Number is Required'],
  },

  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency Contact Number is Required'],
  },

  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message:
        'Blood Group must be one of "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"',
    },
    required: [true, 'Blood Group is Required'],
  },

  presentAddress: {
    type: String,
    required: [true, 'Present Address is Required'],
  },

  permanentAddress: {
    type: String,
    required: [true, 'Permanent Address is Required'],
  },

  guardian: {
    type: guardianSchema,
    required: [true, 'Guardian Information is Required'],
  },

  localGuardian: {
    type: localGuardian,
    required: [true, 'Local Guardian Information is Required'],
  },

  profileImg: {
    type: String,
    required: [true, 'Profile Image is Required'],
  },

  isActive: {
    type: String,
    enum: {
      values: ['active', 'blocked'],
      message: 'Account status must be either "active" or "blocked"',
    },
    required: [true, 'Account Status is Required'],
    default: 'active',
  },
});

// create a model
export const StudentModel = model<Student>('Student', studentSchema);
