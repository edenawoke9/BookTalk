
import { Router } from "express";
import {SignIn,LogIn} from "../Controllers/user.js"
import { GetBook,GetAll,Create,Update,Delete } from "../Controllers/books.js";


const router=Router()
router.post("/createBook",Create)
router.get("/getbooks",GetAll)
router.get("/getbooks/:id",GetBook
)
router.put("/update/:id",Update)
router.delete("/delete/:id",Delete)
router.post("/login",LogIn)
router.post("/signup",SignIn)
export default router;