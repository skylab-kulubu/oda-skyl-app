import { NextResponse } from "next/server"
import prisma from "../../../../../../prisma/client";

export async function POST(request: Request, {params}: {params: {rfidUid: string}}) {

    try{
        const user = await prisma.user.findFirst({
            where: {
                rfidUid: params.rfidUid
            }
        });

        if(!user){
            return NextResponse.json({success:false,message: "Belirtilen uidye sahip kullanıcı bulunamadı!"}, {status: 404})
        }

        if(!user.isInside){
            await prisma.userLog.create({
                data: {
                    userId: user.id,
                    enterDate: new Date()
                }
            })
        }

        if(user.isInside){
            const lastUserLog = await prisma.userLog.findFirst({
                where: {
                    userId: user.id,
                    leaveDate: null
                }
            });

            await prisma.userLog.update({
                where: {
                    id: lastUserLog.id
                },
                data: {
                    leaveDate: new Date()
                }
            });

        }

        user.isInside = !user.isInside;

        await prisma.user.update({
            where: {
                id : user.id
            },
            data: {
                isInside: user.isInside
            }
        })

        const userToReturn = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            department: user.department,
            isInside: user.isInside
        }


        if(user.isInside){
            return NextResponse.json({success:true ,message:"Kullanıcı başarıyla giriş yaptı!", user:userToReturn} , {status:200});
        }

        return NextResponse.json({success:true ,message:"Kullanıcı başarıyla çıkış yaptı!", user:userToReturn} , {status:200});
    }catch(err){
        return NextResponse.json({success:false, message:err.message}, {status: 500})
    }
   
}