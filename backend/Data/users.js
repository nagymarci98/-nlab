import bcrypt from 'bcryptjs'

const users = [
    {
        name: 'Admin User',
        email: 'admin@example.com',
        password: bcrypt.hashSync('admin', 10),
        isAdmin: true
    },
    {
        name: 'John Doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('john', 10)
    },
    {
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: bcrypt.hashSync('jane', 10)
    },
    {
        name: 'Nagy Márton',
        email: 'marci@marci.com',
        password: bcrypt.hashSync('marci', 10)
    },
];

export default users;