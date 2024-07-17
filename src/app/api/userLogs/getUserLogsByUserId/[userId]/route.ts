import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../../prisma/client";
import {NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function GET(request: Request, {params}: {params: {userId: string}}) {

    if(params.userId === undefined || params.userId === null || isNaN(Number(params.userId))){
        return NextResponse.json({success:false, message:"Kullanıcı idsi girilmedi!"}, {status:400})
    }

    
    try{
        const userToGet = await prisma.user.findFirst({
            where:{
                id: Number(params.userId)
            }
        });

        if(!userToGet){
            return NextResponse.json({success:false, message:"Kullanıcı bulunamadı!"}, {status:404})
        }



        const userLogs = await prisma.userLog.findMany({
            where:{
                userId: userToGet.id
            },
            include:{
                user:true
            },
            orderBy:{
                id: 'asc'
            }
        });

        if(userLogs.length === 0){
            return NextResponse.json({success:false, message:"Belirtilen kullanıcıya ait log kaydı bulunamadı!"}, {status:404})
        }

        const userLogsReturnDTO = userLogs.map(log => {
            delete log.userId;
            log.user = {
                id: log.user.id,
                firstName: log.user.firstName,
                lastName: log.user.lastName,
                email: log.user.email,
                role: log.user.role,
                rfidUid: log.user.rfidUid,
                department: log.user.department,
                isInside: log.user.isInside
            }
            return log;
        });
   


        return NextResponse.json({success:true, message:"Belirtilen kullanıcıya ait log kayıtları başarıyla getirildi!", data:userLogsReturnDTO}, {status:200});
    }catch(err){
        return NextResponse.json({success:false, message:err.message}, {status: 500})
    }
}