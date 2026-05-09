import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma';
import { JWT_SECRET } from '../middleware/auth';

export function createAuthRouter(): Router {
  const router = Router();

  router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Missing Credentials', message: 'Email and password are required.' });
      return;
    }

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(400).json({ error: 'Conflict', message: 'User already exists.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      const token = jwt.sign({ id: user.id.toString(), email }, JWT_SECRET, { expiresIn: '24h' });
      res.status(201).json({ 
        message: 'Registered successfully', 
        token, 
        user: { id: user.id.toString(), email } 
      });
    } catch (error: any) {
      console.error('[Auth] Error:', error);
      res.status(500).json({ error: 'System Error', message: error.message });
    }
  });

  router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials.' });
        return;
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        res.status(401).json({ error: 'Unauthorized', message: 'Invalid credentials.' });
        return;
      }

      const token = jwt.sign({ id: user.id.toString(), email }, JWT_SECRET, { expiresIn: '24h' });
      res.status(200).json({ 
        message: 'Logged in successfully', 
        token, 
        user: { id: user.id.toString(), email } 
      });
    } catch (error: any) {
      res.status(500).json({ error: 'System Error', message: error.message });
    }
  });

  return router;
}
