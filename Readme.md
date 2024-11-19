# Advanced CRUD with express, mongoose and typescript

- This module focuses on validation, covering topics such as an introduction to validation, utilizing the Joi package, custom validation, and techniques like instance method validation and Zod integration. A basic understanding of validation, while we explores practical validation using Joi, including instance methods and advanced JOD techniques. By the end, you'll be equipped with the skills to confidently validate data in TypeScript. Let's dive into the exciting world of validation!

## 9-1 Introduction to Validation

- In mongoose we can validate like what should be the data type like string, number or boolean. If we want to validate lie the length of phone number according to different countries, validating right format of email is written or not, we can used different method.

### validations in mongoose

1. builtin validation
2. custom validation
3. third party validation lie (validator/zod/joi)

- In last module we have not write the enums in right way. Now its time to fix.

![alt text](image.png)

[Builtin Validator Of Mongoose](https://mongoosejs.com/docs/validation.html#built-in-validators)

- Inside student.schema.ts

```ts
// student.schema.ts

  // problematic enum
  // gender: ['male', 'female'],
  // fixed enum
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
```

```ts
// student.schema.ts

  // problematic enum
  // bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  // fixed enum
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
```

- Enum fix and default value setting

```ts
// student.schema.ts

  // problematic enum
  // isActive: ['active', 'blocked'],

  // fixed enum
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    // default value setting
    default: 'active',
  },
```

- Bug fix from previous student.schema.ts, since those was not made required

```ts
// student.schema.ts
  name: {
    type: userNameSchema,
    required: true,
  },

    guardian: {
    type: guardianSchema,
    required: true,
  },
  localGuardian: {
    type: localGuardian,
    required: true,
  },
```

- If we ant to send any custom message if anything required has been missed. We can set error message in the required field. The error message will be shown in the command section where are running the server

```ts
// student.schema.ts
  name: {
    type: userNameSchema,
    required: [true, 'First name labei lagbe'],
  },
```

- For setting a custom message in the enum we have to do

```ts
// student.schema.ts
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be either "male", "female", or "other"',
    },
    required: [true, 'Gender is Required'],
  },
```

- If we want to grab the exact value from client and show in the message

```ts
// student.schema.ts
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not valid Gender must be either "male", "female", or "other"',
    },
    required: [true, 'Gender is Required'],
  },
```

- If we want the id to be unique and no repeat

```ts
// student.schema.ts
  id: {
    type: String,
    required: true,
    unique:true
  },

```

## 9-2 How to do custom validation

- we can set max length of a schema types

```ts
// student.schema.ts
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    maxlength: 20,
  },
```

- We set a custom message with the max length

```ts
// student.schema.ts
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    maxlength: [20, 'Name should be less than 20 letter']
  },
```

- We can send the error message to client as well

```ts
//  inside student.controller.ts
const createStudent = async (req: Request, res: Response) => {
  try {
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
```

- If we want to remove the unnecessary spaces between the words we can use trim

```ts
// student.schema.ts
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    trim: true,
    maxlength: [20, 'First Name should not be more than 20 letter'],
  },
```

### Custom Validator

- we will use normal function because dist will not work in arrow function
-

```ts
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    trim: true, // Names often have unwanted whitespace
    maxlength: [20, 'First Name should not be more than 20 letters'],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        // console.log(value);
        // if (value !== firstNameStr) {
        //   return false;
        // }
        // return true;

        // shortcut
        return firstNameStr === value;
      },
      message: '{VALUE} is not capitalized Format',
    },
  },
```

## 9-3 How to validate using validator and Joi package

- Custom made validation will take more time. so that we will use validation library

### Using Npm Validator

- Easiest validator npm package is [Validator Npm](https://www.npmjs.com/package/validator)
- npm i validator
- By default this validator does not support typescript
- We should use npm i -D @types/validator this. [typescript enabled validator system of this npm](https://www.npmjs.com/package/@types/validator)
- Follow the installation process [Validator npm Home page](https://github.com/validatorjs/validator.js)
- Import inside student.schema.ts i mean in the model

  ```ts
  import validator from 'validator';
  ```

  - Validator npm in last name

```ts
    // using npm validator
  lastName: {
    type: String,
    required: [true, 'Last Name is Required'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      // here normal function will work since we are not using custom validator
      message: '{VALUE} is not valid',
    },
  },
```

```ts

  // using npm validator
  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: true, // Email typically doesn't need trimming here
    trim: true, // Trim for ensuring valid input
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not a email type',
    },
  },

```

### Using JOI Validator

- We can use JOI since it support typescript
  [JOI NPM VALIDATOR](https://www.npmjs.com/package/joi)

- install JOI npm i joi
  [JOI DOCS](https://joi.dev/api/?v=17.13.3)

- JOI gives a schema itself so we will use in the student.controller.ts. Since we are getting the data in the controller from client side so that we can check here using JOI

- Import JOI in student.controller.ts

```ts
// student.controller.ts
import { Request, Response } from 'express';
import { StudentServices } from './student.services';
import Joi from 'joi';

const createStudent = async (req: Request, res: Response) => {
  try {
    //  creating a student validation using JOI
    // Sub-schemas
    const userNameSchema = Joi.object({
      firstName: Joi.string()
        .trim()
        .required()
        .max(20)
        .custom((value, helpers) => {
          const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
          if (value !== firstNameStr) {
            return helpers.error('string.capitalized', { value });
          }
          return value;
        })
        .messages({
          'any.required': 'First Name is Required',
          'string.max': 'First Name should not be more than 20 letters',
          'string.capitalized': '{#value} is not capitalized Format',
        }),
      middleName: Joi.string().trim().optional(),
      lastName: Joi.string()
        .trim()
        .required()
        .regex(/^[A-Za-z]+$/)
        .messages({
          'any.required': 'Last Name is Required',
          'string.pattern.base': '{#value} is not valid',
        }),
    });

    const guardianSchema = Joi.object({
      fatherName: Joi.string().trim().required().messages({
        'any.required': 'Father Name is Required',
      }),
      fatherOccupation: Joi.string().trim().required().messages({
        'any.required': 'Father Occupation is Required',
      }),
      fatherContactNo: Joi.string().trim().required().messages({
        'any.required': 'Father Contact No is Required',
      }),
      motherName: Joi.string().trim().required().messages({
        'any.required': 'Mother Name is Required',
      }),
      motherOccupation: Joi.string().trim().required().messages({
        'any.required': 'Mother Occupation is Required',
      }),
      motherContactNo: Joi.string().trim().required().messages({
        'any.required': 'Mother Contact No is Required',
      }),
    });

    const localGuardianSchema = Joi.object({
      name: Joi.string().trim().required().messages({
        'any.required': 'Local Guardian Name is Required',
      }),
      occupation: Joi.string().trim().required().messages({
        'any.required': 'Local Guardian Occupation is Required',
      }),
      contactNo: Joi.string().trim().required().messages({
        'any.required': 'Local Guardian Contact No is Required',
      }),
      address: Joi.string().trim().required().messages({
        'any.required': 'Local Guardian Address is Required',
      }),
    });

    // Main Schema
    const studentValidationSchema = Joi.object({
      id: Joi.string().trim().required().messages({
        'any.required': 'Student ID is Required',
      }),
      name: userNameSchema.required().messages({
        'any.required': 'Student Name is Required',
      }),
      gender: Joi.string()
        .valid('male', 'female', 'other')
        .required()
        .messages({
          'any.required': 'Gender is Required',
          'any.only':
            '{#value} is not valid. Gender must be either "male", "female", or "other"',
        }),
      dateOfBirth: Joi.string().trim().required().messages({
        'any.required': 'Date of Birth is Required',
      }),
      email: Joi.string().email().trim().required().messages({
        'any.required': 'Email is Required',
        'string.email': '{#value} is not a valid email type',
      }),
      contactNo: Joi.string().trim().required().messages({
        'any.required': 'Contact Number is Required',
      }),
      emergencyContactNo: Joi.string().trim().required().messages({
        'any.required': 'Emergency Contact Number is Required',
      }),
      bloodGroup: Joi.string()
        .valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')
        .required()
        .messages({
          'any.required': 'Blood Group is Required',
          'any.only':
            'Blood Group must be one of "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"',
        }),
      presentAddress: Joi.string().trim().required().messages({
        'any.required': 'Present Address is Required',
      }),
      permanentAddress: Joi.string().trim().required().messages({
        'any.required': 'Permanent Address is Required',
      }),
      guardian: guardianSchema.required().messages({
        'any.required': 'Guardian Information is Required',
      }),
      localGuardian: localGuardianSchema.required().messages({
        'any.required': 'Local Guardian Information is Required',
      }),
      profileImg: Joi.string().trim().required().messages({
        'any.required': 'Profile Image is Required',
      }),
      isActive: Joi.string()
        .valid('active', 'blocked')
        .required()
        .default('active')
        .messages({
          'any.required': 'Account Status is Required',
          'any.only': 'Account status must be either "active" or "blocked"',
        }),
    });

    const { student: studentData } = req.body;

    // JOI validation
    const { value, error } = studentValidationSchema.validate(studentData);
    // console.log(value);
    // console.log(error);

    if (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error.details,
      });
    }

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
```

- we can use this validator in separate file to make out code more organized

```ts
// student.validation.ts
//  creating a student validation using JOI

import Joi from 'joi';

const userNameSchema = Joi.object({
  firstName: Joi.string()
    .required()
    .trim()
    .max(20)
    .regex(/^[A-Z][a-z]*$/, { name: 'capitalize' })
    .message('First Name must start with a capital letter'),
  middleName: Joi.string().trim(),
  lastName: Joi.string().required(),
});

const guardianSchema = Joi.object({
  fatherName: Joi.string().required(),
  fatherOccupation: Joi.string().required(),
  fatherContactNo: Joi.string().required(),
  motherName: Joi.string().required(),
  motherOccupation: Joi.string().required(),
  motherContactNo: Joi.string().required(),
});

const localGuardianSchema = Joi.object({
  name: Joi.string().required(),
  occupation: Joi.string().required(),
  contactNo: Joi.string().required(),
  address: Joi.string().required(),
});

export const studentValidationSchema = Joi.object({
  id: Joi.string().required(),
  password: Joi.string().required().max(30),
  name: userNameSchema.required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  dateOfBirth: Joi.string(),
  email: Joi.string().email().required(),
  contactNo: Joi.string().required(),
  emergencyContactNo: Joi.string().required(),
  bloodGroup: Joi.string().valid(
    'A+',
    'A-',
    'B+',
    'B-',
    'AB+',
    'AB-',
    'O+',
    'O-',
  ),
  presentAddress: Joi.string().required(),
  permanentAddress: Joi.string().required(),
  guardian: guardianSchema.required(),
  localGuardian: localGuardianSchema.required(),
  profileImg: Joi.string(),
  isActive: Joi.string().valid('active', 'blocked').default('active'),
});

export default studentValidationSchema;
```

- as we are using JOI we can remove the unnecessary validators from our main schema

```ts
// student.schema.ts
import { Schema, model } from 'mongoose';
// import validator from 'validator';
import {
  Guardian,
  LocalGuardian,
  Student,
  UserName,
} from './student.interface';

// Sub-schema
const userNameSchema = new Schema<UserName>({
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

const guardianSchema = new Schema<Guardian>({
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

const localGuardian = new Schema<LocalGuardian>({
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
const studentSchema = new Schema<Student>({
  id: {
    type: String,
    required: true,
    unique: true, // IDs don't typically require trimming
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
    required: [true, 'Blood Group is Required'],
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
    required: [true, 'Profile Image is Required'],
    trim: true, // Trim for possible URL whitespace
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
});

// Create a model
export const StudentModel = model<Student>('Student', studentSchema);
```

- We will get the validator in student.controller.ts

```ts
import { Request, Response } from 'express';
import { StudentServices } from './student.services';

import studentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    // JOI validation
    const { value, error } = studentValidationSchema.validate(studentData);

    // console.log(value);
    // console.log(error);

    if (error) {
      res.status(500).json({
        success: false,
        message: 'Something went wrong',
        error: error.details,
      });
    }

    // will call service function to send this data
    const result = await StudentServices.createStudentInDB(value);

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
```

## 9-5 How to validate using zod

- For More Organized way we can use ZOD [ZOD Documentation](https://zod.dev/)
