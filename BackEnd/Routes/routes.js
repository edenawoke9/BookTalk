
import { Router } from "express";
import { SignIn, LogIn } from "../Controllers/user.js";
import { GetBook, GetAll, Create, Update, Delete } from "../Controllers/books.js";
import { GetTexts, createText, Delete as DeleteText } from "../Controllers/texts.js";
import { Create as CreateComment, Update as UpdateComment, Delete as DeleteComment, GetAll as GetAllComments } from "../Controllers/comments.js";

const router = Router();

// Book routes
router.post("/createBook", Create);
router.get("/getbooks", GetAll);
router.get("/getbooks/:id", GetBook);
router.put("/update/:id", Update);
router.delete("/delete/:id", Delete);

// User routes
router.post("/login", LogIn);
router.post("/signup", SignIn);

// Text routes
router.get("/texts/:id", GetTexts);
router.post("/createText", createText);
router.delete("/texts/:id", DeleteText);

// Comment routes
router.get("/comments", GetAllComments);
router.post("/createComment", CreateComment);
router.put("/comments/:id", UpdateComment);
router.delete("/comments/:id", DeleteComment);

export default router;