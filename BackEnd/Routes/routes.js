
import { Router } from "express";
import {SignIn,LogIn} from "../Controllers/user.js"

const router=Router()
router.post("/login",LogIn)
router.post("/signup",SignIn)
export default router;