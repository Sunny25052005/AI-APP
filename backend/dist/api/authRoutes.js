"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAuthRouter = createAuthRouter;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("../middleware/auth");
// Pseudo-schema for users within the Auth system
// Bypassing the config to maintain internal robust auth state
const USER_ENTITY = {
    name: '_users', // Prefix to avoid clashing with user configs
    fields: [] // We don't run this through the normal validator
};
function createAuthRouter(store) {
    const router = (0, express_1.Router)();
    router.post('/register', async (req, res) => {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Missing Credentials', message: 'Email and password are required.' });
            return;
        }
        // Check if user already exists
        const usersReq = store.findAll(USER_ENTITY);
        const users = usersReq.ok ? usersReq.data : [];
        if (users.find(u => u.email === email)) {
            res.status(400).json({ error: 'Conflict', message: 'User already exists.' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const newUserPayload = { email, passwordHash: hashedPassword };
        // Force inclusion of our fields via a fake schema
        const schemaWithFields = { name: '_users', fields: [{ name: 'email', type: 'string', required: true }, { name: 'passwordHash', type: 'string', required: true }] };
        const result = store.create(schemaWithFields, newUserPayload);
        if (!result.ok) {
            res.status(500).json({ error: 'System Error', message: result.error });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: result.data.id, email }, auth_1.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ message: 'Registered successfully', token, user: { id: result.data.id, email } });
    });
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;
        const usersReq = store.findAll(USER_ENTITY);
        const users = usersReq.ok ? usersReq.data : [];
        const user = users.find(u => u.email === email);
        if (!user) {
            res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials.' });
            return;
        }
        const valid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!valid) {
            res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials.' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email }, auth_1.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({ message: 'Logged in successfully', token, user: { id: user.id, email } });
    });
    return router;
}
//# sourceMappingURL=authRoutes.js.map