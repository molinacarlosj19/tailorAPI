const userService = require('../services/UserService');

class AuthController {
    async register(req, res) {
        try {
            const { username, email, password, role } = req.body;
            const user = await userService.register(username, email, password, role);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body; // Notice the change to use username
            const { token } = await userService.login(username, password);
            res.json({ token });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getProfile(req, res) {
        try {
            const userId = req.user.userId;
            const user = await userService.getUserById(userId);
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();
