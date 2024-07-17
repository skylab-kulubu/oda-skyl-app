import { NextResponse } from "next/server"
import prisma from "../../../../../prisma/client"

export const dynamic = 'force-dynamic';
export async function GET(){
    try{
        const users = await prisma.user.findMany({
            where: {
                isInside: true
            }
        }).then((users) => {
            return users.map((user) => {
                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    isInside: user.isInside,
                    department: user.department,
                }
            })
        });

        if(users.length === 0){
            return NextResponse.json({success:true, message: "Oda boş!"}, {status: 200})
        }

        return NextResponse.json({success:true, message:"Oda içindeki kullanıcılar getirildi!", users:users}, {status:200});

    }catch(err){
        return NextResponse.json({success:false, message:err.message}, {status: 500})
    }
}