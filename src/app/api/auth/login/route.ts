import prisma from "../../../../../prisma/client";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json()

    if(!body.email || !body.password){
        return NextResponse.json({success:false, message:"E-mail ve şifre alanları zorunludur!"}, {status:400})
    }

const user = await prisma.user.findFirst({
    where:{
        email:body.email
     }
    })

    if(user && bcrypt.compareSync(body.password, user.password)){
        const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const token = await new SignJWT({sub:user.id, email: user.email, role:user.role})
        .setProtectedHeader({alg:"HS256"})
        .setExpirationTime("1h")
        .sign(secret)

        return NextResponse.json({success:true, message:"Giriş başarılı!", token}, {status:200})
     }else{
        return NextResponse.json({success:false, message:"E-mail veya şifre yanlış!"}, {status:401})
    }
}