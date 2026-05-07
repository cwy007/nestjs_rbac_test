import 'express';
import { Role } from 'src/user/entities/role.entity';

declare global {
  namespace Express {
    export interface Request {
      user: {
        username: string;
        roles: Role[];
      }
    }
  }
}