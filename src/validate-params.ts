interface UserObject {
  name: string;
  age: number;
  hobbies: string[];
}

export interface ValidationResult {
  valid: boolean;
  message?: string;
  userObject?: UserObject;
}

export const validateParams = (name: string, age: number | string, hobbies: any[]): ValidationResult => {
  if (!name || !age) {
    const message = 'Both name and age are required parameters';
    return { valid: false, message };
  }

  const ageNumber = Number(age);
  if (Number.isNaN(ageNumber)) {
    const message = 'Cannot convert age parameter to number';
    return { valid: false, message };
  }

  if (!hobbies || !Array.isArray(hobbies)) {
    const message = 'Hobbies parameter is empty or invalid';
    return { valid: false, message };
  }

  const userObject: UserObject = {
    name: name.toString(),
    age: ageNumber,
    hobbies: hobbies.map((hobby) => String(hobby)),
  };

  return { valid: true, userObject };
};
