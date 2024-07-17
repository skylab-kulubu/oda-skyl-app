import { NextApiRequest, NextApiResponse } from "next";
import {NextResponse } from "next/server";
import prisma from "../../../../../../prisma/client";

export async function DELETE(request: Request, {params}: {params: {userId: string}}) {

    if(params.userId === undefined || params.userId === null || isNaN(Number(params.userId))){
        return NextResponse.json({success:false, message:"Kullanıcı idsi girilmedi!"}, {status:400})
    }

    try{
        const user = await prisma.user.findFirst({
            where: {
                id: Number(params.userId)
            }
        });

        if(!user){
            return NextResponse.json({success:false,message: "Belirtilen idye sahip kullanıcı bulunamadı!"}, {status: 404})
        }

        const userReturnDTO = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            rfidUid: user.rfidUid,
            department: user.department,
            isInside: user.isInside
        }


        await prisma.user.delete({
            where: {
                id: Number(params.userId)
            }
        });


        return NextResponse.json({success:true ,message:"Kullanıcı başarıyla silindi!",data:userReturnDTO} , {status:200});
    }catch(err){
        return NextResponse.json({success:false, message:err.message}, {status: 500})
    }
}