import { NextResponse } from "next/server"
import prisma from "../../../../../prisma/client"
import bcrypt from "bcrypt"

export async function POST(req: Request) {
  const body = await req.json()
  const ip = req.headers.get('x-forwarded-for');


  const ipAddressCreateCount = await prisma.Log.count({
    where:{
        success:true,
        ip:ip,
      action:"USER_CREATE",
      timestamp:{
            gte: new Date(new Date().getTime() - 60 * 60 * 1000)
        }
    }
  })

    if(ipAddressCreateCount >= 3){
        return NextResponse.json({success:false, message:"Bu IP adresi ile 1 saat içerisindeki maximum kayıt sayısına ulaşıldı!"}, {status:429})
    }

  if(!body.email || !body.password || !body.firstName || !body.lastName || !body.department){
    return NextResponse.json({success:false, message:"Email, password, firstName, lastName ve department alanları zorunludur!"}, {status:400})
    }   

    const exists = await prisma.user.findFirst({
        where:{
            email:body.email
        }
    })
    if(exists){
        await prisma.Log.create({
            data:{
                success:false,
                ip:ip,
                action:"USER_CREATE",
                timestamp:new Date()
            }
        })

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

    const createdUser = await prisma.user.findFirst({
        where:{
            email:body.email
        }
    })

    await prisma.Log.create({
        data:{
            success:true,
            ip:ip,
            action:"USER_CREATE",
            timestamp:new Date(),
            userId:createdUser.id
        }
    })

    return NextResponse.json({success:true, message:"Kullanıcı oluşturuldu!"}, {status:200});
}