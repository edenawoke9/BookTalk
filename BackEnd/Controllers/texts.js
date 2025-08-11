import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient()
const createText=async(req,res)=>{
    const text=prisma.Text.create({
        data: req.body
    })
    if(!text){
        res.status(400).json("not created")
    }
    res.status(201)
}
const Delete=async(req,res)=>{
    prisma.Text.delete({
        where: {id: req.params.id}
    })
    res.status(200)

}
const GetTexts= async(req,res)=>{
    const texts= prisma.Text.findMany({
        where: {groupId: req.params.id}
    })
    res.status(200).json(texts)
}
export {Delete,createText,GetTexts}