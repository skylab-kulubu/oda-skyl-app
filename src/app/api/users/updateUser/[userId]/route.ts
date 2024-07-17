import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../../prisma/client";
import {NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function PUT(request: Request, {params}: {params: {userId: string}}) {
    const body = await request.json()

    const userId = parseInt(params.userId,10)

    if(userId === undefined || userId === null || isNaN(userId)){
        return NextResponse.json({success:false, message:"Kullanıcı idsi girilmedi!"}, {status:400})
    }

    const exists = await prisma.user.findFirst({
        where:{
            id:userId
        }
    })

    if(!exists){
        return NextResponse.json({success:false, message:"Kullanıcı bulunamadı!"}, {status:404})
    }
    

    if(body.role !== "ROLE_ADMIN" && body.role !== "ROLE_USER"){
        return NextResponse.json({success:false, message:"Geçersiz rol!"}, {status:400})
    }

    await prisma.user.update({
        where:{
            id:userId
        },
        data:{
            email:body.email,
            firstName:body.firstName,
            lastName:body.lastName,
            department:body.department,
            rfidUid:body.rfidUid,
            role:body.role
        }
    })

    return NextResponse.json({success:true, message:"Kullanıcı güncellendi!"}, {status:200});
}