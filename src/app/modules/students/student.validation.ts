//  creating a student validation using JOI

import Joi from 'joi';

// Sub-schemas
const userNameValidationSchema = Joi.object({
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

const guardianValidationSchema = Joi.object({
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

const localGuardianValidationSchema = Joi.object({
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
  name: userNameValidationSchema.required().messages({
    'any.required': 'Student Name is Required',
  }),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
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
  guardian: guardianValidationSchema.required().messages({
    'any.required': 'Guardian Information is Required',
  }),
  localGuardian: localGuardianValidationSchema.required().messages({
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

export default studentValidationSchema;
