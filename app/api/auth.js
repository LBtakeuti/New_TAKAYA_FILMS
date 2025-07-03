const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../lib/supabase');

// JWT Secret (本番環境では環境変数を使用)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

// Login endpoint
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        // 開発環境用のデフォルト認証
        if (process.env.NODE_ENV !== 'production' && username === 'admin' && password === 'admin123') {
            const token = jwt.sign(
                { id: 1, username: 'admin', role: 'admin' },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            return res.json({
                message: 'Login successful',
                token,
                user: {
                    id: 1,
                    username: 'admin',
                    email: 'admin@takayafilms.com',
                    role: 'admin'
                }
            });
        }

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error || !data) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, data.password_hash);
        
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: data.id, username: data.username, role: data.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: data.id,
                username: data.username,
                email: data.email,
                role: data.role
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Verify token endpoint
exports.verify = (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ valid: true, user: decoded });
    } catch (error) {
        res.status(403).json({ error: 'Invalid token' });
    }
};