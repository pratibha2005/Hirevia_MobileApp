import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Company from '../models/Company';

const SALT_ROUNDS = 10;

function signToken(userId: string, role: string, companyId?: string) {
    return jwt.sign(
        { userId, role, companyId },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );
}

// POST /api/auth/register/applicant
export const registerApplicant = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, password } = req.body;
        if (!name || !email || !password)
            return res.status(400).json({ success: false, message: 'Name, email and password are required' });

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing)
            return res.status(409).json({ success: false, message: 'Email already registered' });

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            phone: phone || undefined,
            passwordHash,
            role: 'APPLICANT',
        });

        const token = signToken(String(user._id), user.role);
        return res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/auth/register/hr
export const registerHR = async (req: Request, res: Response) => {
    try {
        const { name, email, password, companyName, companyEmailDomain } = req.body;
        if (!name || !email || !password || !companyName || !companyEmailDomain)
            return res.status(400).json({ success: false, message: 'All fields are required' });

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing)
            return res.status(409).json({ success: false, message: 'Email already registered' });

        let company = await Company.findOne({ emailDomain: companyEmailDomain.toLowerCase() });
        if (!company) {
            company = await Company.create({
                name: companyName,
                emailDomain: companyEmailDomain.toLowerCase(),
            });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            passwordHash,
            role: 'HR',
            companyId: company._id,
        });

        const token = signToken(String(user._id), user.role, String(company._id));
        return res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, companyId: company._id },
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: 'Email and password are required' });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user)
            return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid)
            return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = signToken(String(user._id), user.role, user.companyId ? String(user.companyId) : undefined);
        return res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, companyId: user.companyId },
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
