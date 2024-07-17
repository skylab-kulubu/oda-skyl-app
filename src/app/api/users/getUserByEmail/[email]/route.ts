import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../../prisma/client";
import {NextResponse } from "next/server";

export async function GET(request: Request, {params}: {params: {email: string}}) {
    try{
        const user = await prisma.user.findFirst({
            where: {
                email: params.email
            }
        });



        if(!user){
            return NextResponse.json({success:false,message: "Belirtilen emaile sahip kullanıcı bulunamadı!"}, {status: 404})
        
        }

        const userReturnDto = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            rfidUid: user.rfidUid,
            department: user.department,
            isInside: user.isInside
        }

        return NextResponse.json({success:true ,message:"Kullanıcı getirildi!", user:userReturnDto} , {status:200});
    }catch(err){
        return NextResponse.json({success:false, message:err.message}, {status: 500})
    }
}