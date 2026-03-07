import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads/resumes');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('📁 Created uploads directory:', uploadsDir);
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (_req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const ext = path.extname(file.originalname);
        const filename = `resume-${uniqueSuffix}${ext}`;
        console.log('📎 Saving file as:', filename);
        cb(null, filename);
    }
});

// File filter for resumes (PDF, DOC, DOCX)
const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    console.log('🔍 Checking file type:', file.mimetype);
    const allowedMimes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
        console.log('✅ File type accepted');
        cb(null, true);
    } else {
        console.log('❌ File type rejected:', file.mimetype);
        cb(new Error('Only PDF, DOC, and DOCX files are allowed'));
    }
};

// Create multer instance
export const uploadResume = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    }
});

// Error handler for multer
export const handleMulterError = (err: any, req: any, res: any, next: any) => {
    if (err instanceof multer.MulterError) {
        console.error('❌ Multer error:', err);
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({ success: false, message: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
        console.error('❌ Upload error:', err);
        return res.status(400).json({ success: false, message: err.message });
    }
    next();
};
