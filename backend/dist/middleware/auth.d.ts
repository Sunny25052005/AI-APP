import { Request, Response, NextFunction } from 'express';
export declare const JWT_SECRET: string;
export interface AuthUser {
    id: string;
    email: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: AuthUser;
        }
    }
}
export declare function authMiddleware(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=auth.d.ts.map