import { Request, Response, NextFunction } from 'express';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const timestamp = new Date().toISOString();
    
    // Log incoming request
    console.log(`\n🌐 [${timestamp}] ${req.method} ${req.path}`);
    if (req.method !== 'GET' && Object.keys(req.body || {}).length > 0) {
        // Don't log passwords
        const sanitizedBody = { ...req.body };
        if (sanitizedBody.password) sanitizedBody.password = '***';
        if (sanitizedBody.passwordHash) sanitizedBody.passwordHash = '***';
        console.log('   Body:', JSON.stringify(sanitizedBody).substring(0, 200));
    }
    
    // Log response
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusEmoji = res.statusCode < 400 ? '✅' : '❌';
        console.log(`${statusEmoji} [${res.statusCode}] ${req.method} ${req.path} - ${duration}ms\n`);
    });
    
    next();
};
