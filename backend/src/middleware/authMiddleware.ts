import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        // Fallback to checking Authorization header if we still want to support it
        const authHeader = req.headers['authorization'];
        const tokenHeader = authHeader && authHeader.split(' ')[1];
        if (tokenHeader) {
             jwt.verify(tokenHeader, process.env.JWT_SECRET || 'secret_key', (err: any, user: any) => {
                if (err) return res.sendStatus(403);
                req.user = user;
                next();
            });
            return;
        }
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.JWT_SECRET || 'secret_key', (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

export const requireAdminOrOrganizer = (req: AuthRequest, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (role !== 'admin' && role !== 'organizer') {
        return res.status(403).json({ message: 'Admin or organizer access required' });
    }
    next();
};

export const requireAdminKey = (req: Request, res: Response, next: NextFunction) => {
    const expectedKey = process.env.ADMIN_KEY || 'dev-admin-key';
    const headerKey = req.headers['x-admin-key'];
    const queryKey = req.query?.adminKey;
    const bodyKey = (req as any).body?.adminKey;
    const providedKey = (headerKey || queryKey || bodyKey) as string | undefined;

    if (!providedKey || providedKey !== expectedKey) {
        return res.status(403).json({ message: 'Invalid admin key' });
    }
    next();
};
