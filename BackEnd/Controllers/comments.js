import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const Create = async (req, res) => {
    try {
        const Comment = await prisma.Comment.create({
            data: req.body
        });
        
        if (!Comment) {
            return res.status(400).json({ error: "Error while creating Comment" });
        }
        
        return res.status(201).json({ message: "Created", comment: Comment });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const Update = async (req, res) => {
    try {
        const Comment = await prisma.Comment.update({
            where: { id: parseInt(req.params.id) },
            data: req.body
        });
        
        if (Comment) {
            return res.status(200).json({ message: "Updated", comment: Comment });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const Delete = async (req, res) => {
    try {
        const id = parseInt(req.params.id); // Fixed: was req.params.findMany
        
        await prisma.Comment.delete({ // Fixed: was Delete (capital D)
            where: { id: id }
        });
        
        return res.status(200).json({ message: "Deleted" }); // Fixed: was 205
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const GetAll = async (req, res) => {
    try {
        const Comments = await prisma.Comment.findMany();
        
        if (!Comments || Comments.length === 0) {
            return res.status(404).json({ error: "No Comments found" });
        }
        
        return res.status(200).json(Comments);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export { Delete, Update, Create, GetAll };