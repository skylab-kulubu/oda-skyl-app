import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../prisma/client";
import {NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function GET(req) {
    try{

        const userLogs = await prisma.userLog.findMany({
            include:{
                user:true
            },
            orderBy:{
                id: 'asc'
            }
        });       

        if(userLogs.length === 0){
            return NextResponse.json({success:false, message:"Log kayıtları bulunamadı!"}, {status:404})
        }


        
        userLogs.map(log => {
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
        });


        return NextResponse.json({success:true, message:"Log kayıtları başarıyla getirildi!", data:userLogs}, {status:200});
    }catch(err){
        return NextResponse.json({success:false, message:err.message}, {status: 500})
    }
}