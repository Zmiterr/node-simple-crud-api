const supertest = require('supertest');
const users = require('../src/users');

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
      .expect('"ID not found"')
      .expect(404);
  });
});

describe('Script check errors', () => {
  const invalidId = 'Invalid ID';
  const absent = '61eb8e5e-b734-4296-98f4-40aec1e6606c';
  it('Get with invalid id must return 400 error', async () => {
    await api.get(`/user/${invalidId}`)
      .expect('Content-Type', /json/)
      .expect('"invalid ID"')
      .expect(400);
  });

  it('Put with invalid id must return 400 error', async () => {
    await api.put(`/user/${invalidId}`)
      .send(modifiedBody)
      .expect('Content-Type', /json/)
      .expect('"wrong or empty id parameter!"')
      .expect(400);
  });

  it('Delete with invalid id must return 400 error', async () => {
    await api.delete(`/user/${invalidId}`)

      .expect('Content-Type', /json/)
      .expect('"invalid ID"')
      .expect(400);
  });
  it('Delete with absent id must return 400 error', async () => {
    await api.delete(`/user/${absent}`)
      .expect('Content-Type', /json/)
      .expect('"ID not found"')
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

  // beforeAll(async () => {
  //   await api.post('/user')
  //     .send(body);
  //   const response = await api.get('/user');
  //   userId = response.body[0].id;
  // });

  it('Post must return 400 without name', async () => {
    await api.post('/user')
      .send(noNameBody)
      .expect('"absent is required params"')
      .expect(400);
  });
  it('Post must return 400 without age', async () => {
    await api.post('/user')
      .send(noAgeBody)
      .expect('"absent is required params"')
      .expect(400);
  });
  it('Post must return 400 without hobbies', async () => {
    await api.post('/user')
      .send(noHobbiesBody)
      .expect('"empty or invalid hobbies parameter"')
      .expect(400);
  });
  it('Post must return 400 with wrong hobbies', async () => {
    await api.post('/user')
      .send(invalidHobbiesBody)
      .expect('"empty or invalid hobbies parameter"')
      .expect(400);
  });
  it('Post must return 400 with wrong age', async () => {
    await api.post('/user')
      .send(invalidAgeBody)
      .expect('"can\'t convert age parameter to string"')
      .expect(400);
  });
});

// let app;
//
// beforeAll(() => {
//   app = require("../src/server"); // или альтернативно тут же app.listen
// });
//
// afterAll(() => {
//   app.close();
// });
