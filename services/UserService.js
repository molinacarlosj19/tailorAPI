const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../entities/User');
const Role = require('../entities/Role');

class UserService {
    async register(username, email, password, roleName) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const role = await Role.findOne({ where: { name: roleName } });

        if (!role) {
            throw new Error('Role not found');
        }

        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            role_id: role.id
        });

        return user;
    }

    async login(username, password) {
        const user = await User.findOne({ where: { username } });

        if (!user) {
            throw new Error('User not found');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ userId: user.id, role: user.role_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return { token };
    }

    async getUserById(userId) {
        const user = await User.findByPk(userId);
        return user;
    }
}

module.exports = new UserService();
