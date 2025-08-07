import { PrismaClient
 } from "@prisma/client";
 const prisma=new PrismaClient()
const createGroup=async(req,res)=>{
    const group=await prisma.group.create({
        data: req.body
    })
    if (group){
        res.status(201)
    }
}
const joinGroup=async(req,res)=>{
   
    const join=await prisma.group.update({
        where: {id: req.params.grpId},
        data: {
            users: {
                connect: {id: userId}
            }
        }
    })
    if (!join){
        res.status(400).json("coulcn't join")
    }
    res.status(200)


}
const leaveGroup=async(req,res)=>{
    const leave=await prisma.group.update({
        where: {id: req.params.grpId},
        data:{
            users: {
                disconnect: {id: req.params.userId}
            }
        }

})

}

export {leaveGroup,joinGroup,createGroup}