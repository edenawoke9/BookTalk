import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient()
const createText=async(req,res)=>{
    try {
        const text= await prisma.Text.create({
            data: req.body
        })
        if(!text){
            return res.status(400).json("not created")
        }
        res.status(201).json(text)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const Delete=async(req,res)=>{
    try {
        await prisma.Text.delete({
            where: {id: req.params.id}
        })
        res.status(200).json({ message: "Text deleted successfully" })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
const GetTexts= async(req,res)=>{
    try {
        const texts= await prisma.Text.findMany({
            where: {groupId: req.params.id}
        })
        res.status(200).json(texts)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}
export {Delete,createText,GetTexts}