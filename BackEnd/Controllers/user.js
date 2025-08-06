import passport from "passport";
import { PrismaClient } from "@prisma/client";  // Use default import

const prisma = new PrismaClient();

async function SignIn(req, res) {
    try {
        // Provide default values for required fields
        const userData = {
            name: req.body.name || "",
            username: req.body.username,
            password: req.body.password,
            profileImg: req.body.profileImg || "",
            bio: req.body.bio || ""
        };
        
        const response = await prisma.user.create({
            data: userData
        });
        
        if (!response) {
            return res.status(400).json({ error: "user not created" });
        }
        
        return res.status(201).json({ user: response });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
}

async function LogIn(req, res, next) {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(401).json({ error: err.message });
        }
        
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }
        
        req.logIn(user, function(err) {
            if (err) return next(err);
            return res.json({ user: user });
        });
    })(req, res, next);
}

export { LogIn, SignIn };