"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
exports.authMiddleware = authMiddleware;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.JWT_SECRET = process.env.JWT_SECRET || 'super-secret-dev-key';
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Unauthorized', message: 'Missing or invalid Bearer token.' });
        return;
    }
    const token = authHeader.substring(7);
    try {
        const payload = jsonwebtoken_1.default.verify(token, exports.JWT_SECRET);
        req.user = payload;
        next();
    }
    catch (err) {
        res.status(403).json({ error: 'Forbidden', message: 'Token is invalid or expired.' });
    }
}
//# sourceMappingURL=auth.js.map