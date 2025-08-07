import { PrismaClient } from "@prisma/client";
const prisma=new PrismaClient()
const Create=async(req,res)=>{
    const book=prisma.Book.create({
        data: req.body
    })
    if (!book){
        res.status(400).json({error:" error while creating book"})
    }
    res.status(200).json("created")


}
const Update=async(req,res)=>{
    const book=prisma.Book.update({
        where: {id: req.params.id},
        data: req.body

    })
    if (book){
        res.status(200).json("updated")
    }
}
const Delete=async(req,res)=>{
    const id=req.params.findMany
    prisma.Book.Delete({
        where: {id:id}
    })
    res.status(205).json("deleted")
}
const GetAll=async(req,res)=>{
    const books= prisma.Book.findMany()
    if (!books){
    res.status(404).json("no books found")
    }
    res.status(200).json(books)
}
const GetBook=async(req,res)=>{
    const book=prisma.Book.findUnique({
        where: {id: req.params.findMany}
    })
    if(!book){
        res.status(404).json("no books found")

    }
    res.status(200).json(book)


}

export {Delete,Update,Create,GetAll,GetBook}