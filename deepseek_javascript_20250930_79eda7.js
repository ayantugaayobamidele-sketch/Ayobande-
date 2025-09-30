// Access code generation
const generateAccessCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

// Access code validation middleware
const validateAccessCode = async (req, res, next) => {
    const { accessCode } = req.body;
    const studentId = req.session.userId;
    
    const code = await AccessCode.findOne({
        code: accessCode,
        student_id: studentId,
        expires_at: { $gt: new Date() },
        is_used: false
    });
    
    if (!code) {
        return res.status(400).json({ error: 'Invalid or expired access code' });
    }
    
    req.accessCode = code;
    next();
};