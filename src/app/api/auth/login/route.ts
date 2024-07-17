import prisma from "../../../../../prisma/client";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const ip = req.headers.get('x-forwarded-for');
    const body = await req.json()

    const ipAddressLoginCount = await prisma.Log.count(
        {
            where:{
                success:false,
                ip:ip,
                action:"USER_LOGIN",
                timestamp:{
                    gte: new Date(new Date().getTime() - 10 * 60 * 1000)
                }
            }
        }
    )

    if(ipAddressLoginCount >= 5){
        return NextResponse.json({success:false, message:"Bu IP adresi ile 10 dakika içerisindeki maximum başarısız giriş sayısına ulaşıldı!"}, {status:429})
    }

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

        await prisma.Log.create({
            data:{
                ip:ip,
                action:"USER_LOGIN",
                userId:user.id,
                timestamp:new Date(),
                success:true
            }
        })

        return NextResponse.json({success:true, message:"Giriş başarılı!", token}, {status:200})
     }else{
        await prisma.Log.create({
            data:{
                ip:ip,
                action:"USER_LOGIN",
                timestamp:new Date(),
                success:false
            }
        })

        return NextResponse.json({success:false, message:"E-mail veya şifre yanlış!"}, {status:401})
    }
}