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
