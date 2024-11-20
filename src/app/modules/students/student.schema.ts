import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
// import validator from 'validator';
import {
  TGuardian,
  TLocalGuardian,
  TStudent,
  StudentMethods,
  StudentModel,
  TUserName,
} from './student.interface';
import config from '../../config';

// Sub-schema
const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    trim: true, // Names often have unwanted whitespace
    maxlength: [20, 'First Name should not be more than 20 letters'],
    // validate: {
    //   validator: function (value: string) {
    //     const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
    //     // console.log(value);
    //     // if (value !== firstNameStr) {
    //     //   return false;
    //     // }
    //     // return true;

    //     // shortcut
    //     return firstNameStr === value;
    //   },
    //   message: '{VALUE} is not capitalized Format',
    // },
  },
  middleName: {
    type: String,
    trim: true, // Middle names may also require trimming
  },
  // using npm validator
  lastName: {
    type: String,
    required: [true, 'Last Name is Required'],
    // validate: {
    //   validator: (value: string) => validator.isAlpha(value),
    //   // here normal function will work since we are not using custom validator
    //   message: '{VALUE} is not valid',
    // },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father Name is Required'],
    trim: true, // Trim for names
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation is Required'],
    trim: true, // Occupations may have whitespace
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father Contact No is Required'],
    trim: true, // Contact numbers may accidentally include whitespace
  },
  motherName: {
    type: String,
    required: [true, 'Mother Name is Required'],
    trim: true, // Trim for names
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation is Required'],
    trim: true, // Occupations may have whitespace
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother Contact No is Required'],
    trim: true, // Contact numbers may accidentally include whitespace
  },
});

const localGuardian = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local Guardian Name is Required'],
    trim: true, // Names often need trimming
  },
  occupation: {
    type: String,
    required: [true, 'Local Guardian Occupation is Required'],
    trim: true, // Occupations may have whitespace
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian Contact No is Required'],
    trim: true, // Contact numbers may accidentally include whitespace
  },
  address: {
    type: String,
    required: [true, 'Local Guardian Address is Required'],
    trim: true, // Addresses often need trimming
  },
});

// Main Schema

// if we use custom instance model
// const studentSchema = new Schema<TStudent, StudentModel, StudentMethods>
// if we use custom static instance model
const studentSchema = new Schema<TStudent, StudentModel>(
  {
    id: {
      type: String,
      required: [true, 'Id Is Required'],
      unique: true, // IDs don't typically require trimming
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
      maxlength: [20, 'Password can not be more than 20 characters'],
    },

    name: {
      type: userNameSchema,
      required: [true, 'Student Name is Required'],
    },

    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'], // No need for trimming in enum values
        message:
          '{VALUE} is not valid. Gender must be either "male", "female", or "other"',
      },
      required: [true, 'Gender is Required'],
    },

    dateOfBirth: {
      type: String,
      required: [true, 'Date of Birth is Required'],
    },

    // using npm validator
    email: {
      type: String,
      required: [true, 'Email is Required'],
      unique: true, // Email typically doesn't need trimming here
      trim: true, // Trim for ensuring valid input
      // validate: {
      //   validator: (value: string) => validator.isEmail(value),
      //   message: '{VALUE} is not a email type',
      // },
    },

    contactNo: {
      type: String,
      required: [true, 'Contact Number is Required'],
      trim: true, // Trim is essential for contact numbers
    },

    emergencyContactNo: {
      type: String,
      required: [true, 'Emergency Contact Number is Required'],
      trim: true, // Trim is essential for contact numbers
    },

    bloodGroup: {
      type: String,
      enum: {
        values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
        message:
          'Blood Group must be one of "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"',
      },
    },

    presentAddress: {
      type: String,
      required: [true, 'Present Address is Required'],
      trim: true, // Addresses often need trimming
    },

    permanentAddress: {
      type: String,
      required: [true, 'Permanent Address is Required'],
      trim: true, // Addresses often need trimming
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
    },

    isActive: {
      type: String,
      enum: {
        values: ['active', 'blocked'], // No need for trimming in enum values
        message: 'Account status must be either "active" or "blocked"',
      },
      required: [true, 'Account Status is Required'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    // this is used to enable mongoose virtuals
    toJSON: {
      virtuals: true,
    },
  },
);

// ------------------------------Virtuals-------------------
studentSchema.virtual('fullName').get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
});

// ---------------------------------------------------------------

// ############################### Document Middleware ##############
//Pre Save Hook/Middleware : will work on create() or save()
studentSchema.pre('save', async function (next) {
  // console.log(this, 'pre hoo : will save the data');

  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this; //this refers to the current document
  // hashing password and saving into db
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

//Post Save Hook/Middleware
studentSchema.post('save', function (doc, next) {
  doc.password = '';
  // console.log(this, 'post hook : we saved our the data');
  next();
});
// ##############################################################

// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ Query Middleware $$$$$$$$$$$$$$$$
studentSchema.pre('find', function (next) {
  // console.log(this);
  this.find({ isDeleted: { $ne: true } });
  next();
});
studentSchema.pre('findOne', function (next) {
  // console.log(this);
  this.find({ isDeleted: { $ne: true } });
  next();
});
// securing aggregate
// --- this should be structure
// [{$match {isDeleted :{$ne :true}}}, { $match: { id:'saziii' }}]
studentSchema.pre('aggregate', function (next) {
  // console.log(this.pipeline()); //outcome :  { $match: { id:'saziii' }};

  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
//_________________________This is for custom Instance method___________
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };
// ______________________________________________________________________

//*************Creating an static method***********
studentSchema.statics.isUserExists = async function (id: string) {
  const existingUser = await Student.findOne({ id });
  return existingUser;
};

//*************************************************
// Create a model
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
