const validateParams = (name, age, hobbies) => {
  if (!name || !age) {
    const message = 'absent is required params';
    return { valid: false, message };
  }
  if (Number.isNaN(Number(age))) {
    const message = 'can\'t convert age parameter to string';
    return { valid: false, message };
  }
  if (!hobbies || !(Array.isArray(hobbies))) {
    const message = 'empty or invalid hobbies parameter';
    return { valid: false, message };
  }
  const userObject = {
    name: name.toString(),
    age: Number(age),
    hobbies: hobbies.map((hobby) => String(hobby)),
  };
  return { valid: true, userObject };
};

module.exports = validateParams;
