import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient()
const Create=async(req,res)=>{
    const Comment=prisma.Comment.create({
        data: req.body
    })
    if (!Comment){
        res.status(400).json({error:" error while creating Comment"})
    }
    res.status(200).json("created")


}
const Update=async(req,res)=>{
    const Comment=prisma.Comment.update({
        where: {id: req.params.id},
        data: req.body

    })
    if (Comment){
        res.status(200).json("updated")
    }
}
const Delete=async(req,res)=>{
    const id=req.params.findMany
    prisma.Comment.Delete({
        where: {id:id}
    })
    res.status(205).json("deleted")
}
const GetAll=async(req,res)=>{
    const Comments= prisma.Comment.findMany()
    if (!Comments){
    res.status(404).json("no Comments found")
    }
    res.status(200).json(Comments)
}


export {Delete,Update,Create,GetAll}