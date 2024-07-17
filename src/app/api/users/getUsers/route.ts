import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../prisma/client";
import {NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function GET(req) {
    try{
    
        const users = await prisma.user.findMany({
            orderBy:{
                id: 'asc'
            }
        });



        if(users.length === 0){
            return NextResponse.json({success:false, message:"Kullanıcı bulunamadı!"}, {status:404})
        }

        const usersReturnDTO = users.map(user => {
            return {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                rfidUid: user.rfidUid,
                department: user.department,
                isInside: user.isInside
            }
        });


        return NextResponse.json({success:true, message:"Kullanıcılar getirildi!", users:usersReturnDTO}, {status:200});
    }catch(err){
        return NextResponse.json({success:false, message:err.message}, {status: 500})
    }
}