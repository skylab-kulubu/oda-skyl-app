import { NextResponse } from "next/server"
import prisma from "../../../../../prisma/client"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  const body = await req.json()

  if(!body.email || !body.password || !body.firstName || !body.lastName || !body.department){
    return NextResponse.json({success:false, message:"Email, password, firstName, lastName ve department alanları zorunludur!"}, {status:400})
    }   

    const exists = await prisma.user.findFirst({
        where:{
            email:body.email
        }
    })
    if(exists){
        return NextResponse.json({success:false, message:"Bu e-mail adresi zaten kullanımda!"}, {status:400})
    }

    const hashedPassword = await bcrypt.hash(body.password, 10)

    await prisma.user.create({
        data:{
            email:body.email,
            password:hashedPassword,
            firstName:body.firstName,
            lastName:body.lastName,
            department:body.department,
            isInside:false,
            role:"ROLE_USER"
        }
    })

    return NextResponse.json({success:true, message:"Kullanıcı oluşturuldu!"}, {status:200});
}