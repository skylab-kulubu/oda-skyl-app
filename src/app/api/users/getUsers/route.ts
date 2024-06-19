import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../../prisma/client";
import {NextResponse } from "next/server";

export const dynamic = 'force-dynamic';
export async function GET(req) {
    try{
        const users = await prisma.user.findMany();

        return NextResponse.json({success:true, message:"Kullanıcılar getirildi!", users:users}, {status:200});
    }catch(err){
        return NextResponse.json({success:false, message:err.message}, {status: 500})
    }
}