import { Request } from 'express';
import mongoose from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: mongoose.Types.ObjectId | string;
                role: 'HR' | 'APPLICANT';
                companyId?: mongoose.Types.ObjectId | string;
            }
        }
    }
}
