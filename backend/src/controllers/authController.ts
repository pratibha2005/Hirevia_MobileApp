import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Company from '../models/Company';
import ApplicantProfile from '../models/ApplicantProfile';
import { sendOtpEmail } from '../services/emailService';

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
        console.log('📝 Registration request received');
        console.log('📦 Request body:', req.body);
        console.log('📄 File uploaded:', req.file ? req.file.filename : 'No file');

        const { name, email, phone, password } = req.body;

        if (!name || !email || !password) {
            console.log('❌ Missing required fields', { name: !!name, email: !!email, password: !!password });
            return res.status(400).json({ success: false, message: 'Name, email and password are required' });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser && existingUser.isEmailVerified) {
            console.log('❌ Email already registered:', email);
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

        // Generate a 6 digit numeric OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Set OTP expiry to 10 minutes from now
        const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        let user;
        if (existingUser && !existingUser.isEmailVerified) {
            // Update the existing unverified record
            existingUser.name = name;
            existingUser.phone = phone || undefined;
            existingUser.passwordHash = passwordHash;
            existingUser.verificationOtp = otp;
            existingUser.otpExpiresAt = otpExpiresAt;
            await existingUser.save();
            user = existingUser;
            console.log('🔄 Updated unverified user:', user._id);
        } else {
            // Create a new unverified record
            user = await User.create({
                name,
                email: email.toLowerCase(),
                phone: phone || undefined,
                passwordHash,
                role: 'APPLICANT',
                isEmailVerified: false,
                verificationOtp: otp,
                otpExpiresAt: otpExpiresAt
            });
            console.log('✅ Unverified user created:', user._id);
        }

        // Handle resume upload if file is provided
        const resumeUrl = req.file ? `/uploads/resumes/${req.file.filename}` : undefined;
        console.log('📎 Resume URL:', resumeUrl || 'None');

        // Create or update applicant profile with resume (if provided now)
        let profile = await ApplicantProfile.findOne({ userId: user._id });
        if (!profile) {
            await ApplicantProfile.create({
                userId: user._id,
                resumeUrl,
            });
            console.log('✅ Applicant profile created');
        } else if (resumeUrl) {
            profile.resumeUrl = resumeUrl;
            await profile.save();
            console.log('✅ Applicant profile updated');
        }

        // Send OTP email (non-blocking)
        sendOtpEmail(email, otp).catch(emailErr => {
            console.error('❌ Background OTP email failure:', emailErr);
        });
        console.log('✉️ OTP email broadcasted to:', email);

        console.log('✅ Initial registration successful for:', email);
        return res.status(200).json({
            success: true,
            message: 'OTP sent to email. Please verify to complete registration.',
            userId: user._id // Returning userId is helpful for the verification step
        });
    } catch (err: any) {
        console.error('❌ Registration error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/auth/register/verify-otp
export const verifyOtpAndRegister = async (req: Request, res: Response) => {
    try {
        console.log('📝 OTP verification request received');
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ success: false, message: 'Email and OTP are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ success: false, message: 'Email is already verified' });
        }

        if (!user.verificationOtp || user.verificationOtp !== otp) {
            return res.status(400).json({ success: false, message: 'Invalid OTP' });
        }

        if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) {
            return res.status(400).json({ success: false, message: 'OTP has expired' });
        }

        // OTP is valid!
        user.isEmailVerified = true;
        user.verificationOtp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        const token = signToken(String(user._id), user.role);
        console.log('✅ Verification successful. Registration complete for:', email);

        return res.status(200).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
        });

    } catch (err: any) {
        console.error('❌ Verification error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/auth/register/hr
export const registerHR = async (req: Request, res: Response) => {
    try {
        console.log('📝 HR registration request received');
        const { name, email, password, companyName, companyEmailDomain } = req.body;

        if (!name || !email || !password || !companyName || !companyEmailDomain) {
            console.log('❌ Missing required fields for HR registration');
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) {
            console.log('❌ Email already registered:', email);
            return res.status(409).json({ success: false, message: 'Email already registered' });
        }

        let company = await Company.findOne({ emailDomain: companyEmailDomain.toLowerCase() });
        if (!company) {
            company = await Company.create({
                name: companyName,
                emailDomain: companyEmailDomain.toLowerCase(),
            });
            console.log('✅ Company created:', company.name);
        } else {
            console.log('📌 Using existing company:', company.name);
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            passwordHash,
            role: 'HR',
            companyId: company._id,
        });
        console.log('✅ HR user created:', user._id);

        const token = signToken(String(user._id), user.role, String(company._id));
        console.log('✅ HR registration successful for:', email);
        return res.status(201).json({
            success: true,
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, companyId: company._id },
        });
    } catch (err: any) {
        console.error('❌ HR registration error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response) => {
    try {
        console.log('🔐 Login attempt for:', req.body?.email);
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('❌ Missing credentials');
            return res.status(400).json({ success: false, message: 'Email and password are required' });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Don't allow login if email is not verified
        if (user.role === 'APPLICANT' && !user.isEmailVerified) {
            console.log('❌ Email not verified for:', email);
            return res.status(401).json({ success: false, message: 'Please verify your email to login' });
        }

        const valid = await bcrypt.compare(password, user.passwordHash || '');
        if (!valid) {
            console.log('❌ Invalid password for:', email);
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const token = signToken(String(user._id), user.role, user.companyId ? String(user.companyId) : undefined);
        console.log('✅ Login successful for:', email);
        return res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
                profileImage: user.profileImage,
            },
        });
    } catch (err: any) {
        console.error('❌ Login error:', err);
        return res.status(500).json({ success: false, message: err.message });
    }
};

// GET /api/auth/profile
export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const user = await User.findById(userId).populate('companyId', 'name');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const companyName =
            user.role === 'HR' && user.companyId && typeof user.companyId === 'object' && 'name' in user.companyId
                ? (user.companyId as any).name
                : undefined;

        // Get applicant profile if user is an applicant
        let applicantProfile = null;
        if (user.role === 'APPLICANT') {
            applicantProfile = await ApplicantProfile.findOne({ userId });
        }

        return res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
                companyName,
                profileImage: user.profileImage,
                resumeUrl: applicantProfile?.resumeUrl,
            },
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

// PUT /api/auth/profile
export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }

        const { name, profileImage } = req.body;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ success: false, message: 'Name is required' });
        }

        if (profileImage && typeof profileImage !== 'string') {
            return res.status(400).json({ success: false, message: 'Invalid profile image format' });
        }

        const user = await User.findById(userId).populate('companyId', 'name');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.name = name.trim();
        if (typeof profileImage === 'string') {
            user.profileImage = profileImage;
        }

        await user.save();

        const companyName =
            user.role === 'HR' && user.companyId && typeof user.companyId === 'object' && 'name' in user.companyId
                ? (user.companyId as any).name
                : undefined;

        return res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId,
                companyName,
                profileImage: user.profileImage,
            },
        });
    } catch (err: any) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
