import express, { urlencoded } from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import LocalStrategy from 'passport-local';
import router from './Routes/routes.js';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://127.0.0.1:5501',
    credentials: true
}));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false, 
        httpOnly: false, 
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
        domain: '127.0.0.1'
    }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Local Strategy Setup
const prisma = new PrismaClient();

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        console.log('=== LOGIN ATTEMPT ===');
        console.log('Username:', username);
        console.log('Password provided:', password);
        
        const user = await prisma.user.findUnique({
            where: { username: username }
        });
        
        console.log('User found:', !!user);
        if (user) {
            console.log('Stored password (first 20 chars):', user.password.substring(0, 20));
            console.log('Stored password starts with $2b$ (hashed):', user.password.startsWith('$2b$'));
        }
        
        if (!user) {
            console.log('No user found');
            return done(null, false, { message: 'User not found' });
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password);
        console.log('Password comparison result:', passwordMatch);
       
        if (!passwordMatch) { 
            console.log('Password mismatch');
            return done(null, false, { message: 'Invalid password' });
        }
        
        console.log('Authentication successful!');
        return done(null, user);
    } catch (error) {
        console.log('Authentication error:', error);
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await prisma.user.findUnique({ where: { id } });
        done(null, user);
    } catch (error) {
        done(error);
    }
});

// Routes
app.use("/", router);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
