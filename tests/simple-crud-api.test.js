import supertest from "supertest";
import {users} from "../src/users.ts";
import {afterAll, beforeAll, describe, it} from "@jest/globals";



const api = supertest(`http://localhost:4000`);

const body = {
  name: 'Zmiter',
  age: 32,
  hobbies: ['guitar', 'codding'],
};

const modifiedBody = {
  name: 'Zmiter',
  age: 33,
  hobbies: ['guitar', 'codding'],
};

let userId;

describe('Script from example', () => {
  beforeAll(async () => {
    users.length = 0;
  });
  afterAll(async () => {

  });
  it('Get must return empty array', async () => {
    users.length = 0;
    await api.get('/user')
      .expect('Content-Type', /json/)
      .expect('[]')
      .expect(200);
  });

  it('Post must return empty new object with id', async () => {
    await api.post('/user')
      .send(body)
      .expect((res) => {
        res.body.id = 'generated UUID';
      })
      .expect(201, {
        id: 'generated UUID',
        ...body,
      });
  });

  it('Get must return last created object', async () => {
    const response = await api.get('/user');
    userId = response.body[0].id;
    await api.get(`/user/${userId}`)
      .expect('Content-Type', /json/)
      .expect({ id: userId, ...body })
      .expect(200);
  });
  it('Put must return edited object with same id', async () => {
    await api.put(`/user/${userId}`)
      .send(modifiedBody)
      .expect('Content-Type', /json/)
      .expect({ id: userId, ...modifiedBody })
      .expect(200);
  });
  it('Delete must return 204 success code', async () => {
    await api.delete(`/user/${userId}`)
      .expect('Content-Type', /json/)
      .expect(204);
  });
  it('Get must return 404 error', async () => {
    await api.get(`/user/${userId}`)
      .expect('Content-Type', /json/)
      .expect({error: "ID not found"})
      .expect(404);
  });
});

describe('Script check errors', () => {
  const invalidId = 'Invalid ID';
  const absent = '61eb8e5e-b734-4296-98f4-40aec1e6606c';

  it('Get with invalid id must return 400 error', async () => {
    await api.get(`/user/${invalidId}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Wrong or empty id parameter!' })
        .expect(400);
  });

  it('Put with invalid id must return 400 error', async () => {
    await api.put(`/user/${invalidId}`)
        .send(modifiedBody)
        .expect('Content-Type', /json/)
        .expect({ error: 'Invalid ID' })
  });

  it('Delete with invalid id must return 400 error', async () => {
    await api.delete(`/user/${invalidId}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'Invalid ID' }) // Обновлено для проверки объекта
        .expect(400);
  });

  it('Delete with absent id must return 404 error', async () => {
    await api.delete(`/user/${absent}`)
        .expect('Content-Type', /json/)
        .expect({ error: 'ID not found' }) // Обновлено для проверки объекта
        .expect(404);
  });
});

describe('Script body validator', () => {
  const noNameBody = {
    age: 32,
    hobbies: ['guitar', 'codding'],
  };
  const noAgeBody = {
    name: 'Zmiter',
    hobbies: ['guitar', 'codding'],
  };
  const noHobbiesBody = {
    name: 'Zmiter',
    age: 32,
  };
  const invalidHobbiesBody = {
    name: 'Zmiter',
    age: 32,
    hobbies: 'String without array',
  };
  const invalidAgeBody = {
    name: 'Zmiter',
    age: 'String without number',
    hobbies: ['guitar', 'codding'],
  };

  it('Post must return 400 without name', async () => {
    await api.post('/user')
      .send(noNameBody)
      .expect({error: "Both name and age are required parameters"})
      .expect(400);
  });
  it('Post must return 400 without age', async () => {
    await api.post('/user')
      .send(noAgeBody)
      .expect({error: "Both name and age are required parameters"})
      .expect(400);
  });
  it('Post must return 400 without hobbies', async () => {
    await api.post('/user')
      .send(noHobbiesBody)
      .expect({error: "Hobbies parameter is empty or invalid"})
      .expect(400);
  });
  it('Post must return 400 with wrong hobbies', async () => {
    await api.post('/user')
      .send(invalidHobbiesBody)
      .expect({error: "Hobbies parameter is empty or invalid"})
      .expect(400);
  });
  it('Post must return 400 with wrong age', async () => {
    await api.post('/user')
      .send(invalidAgeBody)
      .expect({error: "Cannot convert age parameter to number"})
      .expect(400);
  });
});
