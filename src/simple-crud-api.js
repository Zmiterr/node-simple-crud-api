const http = require('http');
require('dotenv').config();
const { validate, v4: uuidv4 } = require('uuid');
let users = require('./users');
const validateParams = require('./validate-params');

const PORT = process.env.PORT || 4000;

// Регулярное выражение для идентификаторов персон
const userIdPattern = /\/user\/\w+/;

const sendResponse = (res, code, data = null) => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(data ? JSON.stringify(data, null, 2) : '');
};

const sendError = (res, code, message) => {
  sendResponse(res, code, { error: message });
};

const getRequestData = (req) =>
    new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          reject('Invalid JSON format');
        }
      });
    });

const handleGetAllUsers = (res) => {
  // Return all users, even if the list is empty
  sendResponse(res, 200, users);
};

const handleGetUserById = (res, userId) => {
  if (!validate(userId)) {
    return sendError(res, 400, 'Invalid ID');
  }

  const user = users.find((p) => p.id === userId);
  if (user) {
    sendResponse(res, 200, user);
  } else {
    sendError(res, 404, 'ID not found');
  }
};

const handleCreateuser = async (req, res) => {
  try {
    const { name, age, hobbies } = await getRequestData(req);
    const validatedUser = validateParams(name, age, hobbies);

    if (!validatedUser.valid) {
      return sendError(res, 400, validatedUser.message);
    }

    const newuser = { id: uuidv4(), ...validatedUser.userObject };
    users.push(newuser);
    sendResponse(res, 201, newuser);
  } catch (error) {
    sendError(res, 400, error);
  }
};

const handleUpdateuser = async (req, res, userId) => {
  if (!validate(userId)) {
    return sendError(res, 400, 'Invalid ID');
  }

  const userIndex = users.findIndex((p) => p.id === userId);
  if (userIndex === -1) {
    return sendError(res, 404, 'ID not found');
  }

  try {
    const { name, age, hobbies } = await getRequestData(req);
    const validatedUser = validateParams(name, age, hobbies);

    if (!validatedUser.valid) {
      return sendError(res, 400, validatedUser.message);
    }

    users[userIndex] = { id: userId, ...validatedUser.userObject };
    sendResponse(res, 200, users[userIndex]);
  } catch (error) {
    sendError(res, 400, 'Invalid request body');
  }
};

const handleDeleteUser = (res, userId) => {
  if (!validate(userId)) {
    return sendError(res, 400, 'Invalid ID');
  }

  const userIndex = users.findIndex((p) => p.id === userId);
  if (userIndex === -1) {
    return sendError(res, 404, 'ID not found');
  }

  users.splice(userIndex, 1);
  sendResponse(res, 204);
};

const server = http.createServer(async (req, res) => {
  const pathSegments = req.url.split('/');
  const userId = pathSegments[2];

  if (req.method === 'GET' && (req.url === '/user' || req.url === '/user/')) {
    handleGetAllUsers(res);
  } else if (req.method === 'GET' && userIdPattern.test(req.url)) {
    handleGetUserById(res, userId);
  } else if (req.method === 'POST' && (req.url === '/user' || req.url === '/user/')) {
    await handleCreateuser(req, res);
  } else if (req.method === 'PUT' && userIdPattern.test(req.url)) {
    await handleUpdateuser(req, res, userId);
  } else if (req.method === 'DELETE' && userIdPattern.test(req.url)) {
    handleDeleteUser(res, userId);
  } else {
    sendError(res, 404, `Error 404: ${req.url} not found`);
  }
});

// eslint-disable-next-line no-console
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
