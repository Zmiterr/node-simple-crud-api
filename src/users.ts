export interface User {
    id: string;
    name?: string;
    age?: number;
    hobbies?: string[];
}

export const users: User[] = [];

// users.push({
//   id: '61eb8e5e-b734-4296-98f4-40aec1e6606c',
//   name: 'Ivan',
//   age: 18,
//   hobbies: ['guitar', 'coding'],
// });
