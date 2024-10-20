import http, { IncomingMessage, ServerResponse } from "http";
import { config } from "dotenv";
import { v4 as uuidv4, validate as validateUUID } from "uuid";
import { validateParams, ValidationResult } from "./validate-params.ts";
import { User, users } from "./users.ts";

config();
const PORT = process.env.PORT || 4000;

const userIdPattern = /\/user\/\w+/;

const sendResponse = (res: ServerResponse, code: number, data: any = null): void => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(data ? JSON.stringify(data, null, 2) : '');
};

const sendError = (res: ServerResponse, code: number, message: string): void => {
  sendResponse(res, code, { error: message });
};

const getRequestData = (req: IncomingMessage): Promise<any> => {
  return new Promise((resolve, reject) => {
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
};

const handleGetAllUsers = (res: ServerResponse): void => {
  sendResponse(res, 200, users);
};

const handleGetUserById = (res: ServerResponse, userId: string): void => {
  if (!validateUUID(userId)) {
    return sendError(res, 400, 'Wrong or empty id parameter!');
  }

  const user = users.find((p) => p.id === userId);
  if (user) {
    sendResponse(res, 200, user);
  } else {
    sendError(res, 404, 'ID not found');
  }
};

const handleCreateUser = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
  try {
    const { name, age, hobbies } = await getRequestData(req);
    const validatedUser: ValidationResult = validateParams(name, age, hobbies);

    if (!validatedUser.valid) {
      const message = validatedUser.message || 'Invalid parameters';

      return sendError(res, 400, message);
    }

    const newUser: User = { id: uuidv4(), ...validatedUser.userObject };
    users.push(newUser);
    sendResponse(res, 201, newUser);
  } catch (error) {
    sendError(res, 400, 'Invalid request body');
  }
};

const handleUpdateUser = async (req: IncomingMessage, res: ServerResponse, userId: string): Promise<void> => {
  if (!validateUUID(userId)) {
    return sendError(res, 400, 'Invalid ID');
  }

  const userIndex = users.findIndex((p) => p.id === userId);
  if (userIndex === -1) {
    return sendError(res, 404, 'ID not found');
  }

  try {
    const { name, age, hobbies } = await getRequestData(req);
    const validatedUser: ValidationResult = validateParams(name, age, hobbies);

    if (!validatedUser.valid) {
      const message = validatedUser.message || 'Invalid parameters';
      return sendError(res, 400, message);
    }

    users[userIndex] = { id: userId, ...validatedUser.userObject };
    sendResponse(res, 200, users[userIndex]);
  } catch (error) {
    sendError(res, 400, 'Invalid request body');
  }
};

const handleDeleteUser = (res: ServerResponse, userId: string): void => {
  if (!validateUUID(userId)) {
    return sendError(res, 400, 'Invalid ID');
  }

  const userIndex = users.findIndex((p) => p.id === userId);
  if (userIndex === -1) {
    return sendError(res, 404, 'ID not found');
  }

  users.splice(userIndex, 1);
  sendResponse(res, 204);
};

const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
  const pathSegments = req.url?.split('/');
  const userId = pathSegments ? pathSegments[2] : '';

  if (req.method === 'GET' && (req.url === '/user' || req.url === '/user/')) {
    handleGetAllUsers(res);
  } else if (req.method === 'GET' && userIdPattern.test(req.url!)) {
    handleGetUserById(res, userId);
  } else if (req.method === 'POST' && (req.url === '/user' || req.url === '/user/')) {
    await handleCreateUser(req, res);
  } else if (req.method === 'PUT' && userIdPattern.test(req.url!)) {
    await handleUpdateUser(req, res, userId);
  } else if (req.method === 'DELETE' && userIdPattern.test(req.url!)) {
    handleDeleteUser(res, userId);
  } else {
    sendError(res, 404, `Error 404: ${req.url} not found`);
  }
});

// eslint-disable-next-line no-console
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));
