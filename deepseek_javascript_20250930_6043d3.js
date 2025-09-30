// Backend authentication middleware (Node.js/Express)
const session = require('express-session');
const bcrypt = require('bcryptjs');

// Admin login validation
const validateAdminLogin = (username, password) => {
    return username === 'Admin' && password === 'Property';
};

// Student registration
app.post('/api/student/register', async (req, res) => {
    const { username, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
    }
    
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        email,
        password_hash: hashedPassword,
        role: 'student'
    });
    
    await user.save();
    req.session.userId = user.id;
    res.json({ message: 'Registration successful' });
});