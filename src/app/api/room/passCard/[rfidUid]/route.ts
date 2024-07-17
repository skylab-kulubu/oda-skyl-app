import { NextResponse } from "next/server"
import prisma from "../../../../../../prisma/client";

export async function POST(request: Request, {params}: {params: {rfidUid: string}}) {
    const ip = request.headers.get('x-forwarded-for');

    const ipAddressFailedPassCount = await prisma.Log.count({
        where:{
            ip:ip,
            action:"USER_PASS_CARD",
            timestamp:{
                gte: new Date(new Date().getTime() - 60 * 60 * 1000)
            }
        }
    })

    if(ipAddressFailedPassCount >= 18){
        return NextResponse.json({success:false, message:"Bu IP adresi ile 1 saat içerisindeki maximum giriş/çıkış sayısına ulaşıldı!"}, {status:429})
    }

    try{
        const user = await prisma.user.findFirst({
            where: {
                rfidUid: params.rfidUid
            }
        });


        if(!user){

            await prisma.Log.create({
                data:{
                    success:false,
                    ip:ip,
                    action:"USER_PASS_CARD",
                    timestamp:new Date()
                }
            })

            return NextResponse.json({success:false,message: "Belirtilen uidye sahip kullanıcı bulunamadı!"}, {status: 404})
        }

        const userLogCount = await prisma.Log.count({
            where:{
                userId: user.id,
                action:"USER_PASS_CARD",
                timestamp:{
                    gte: new Date(new Date().getTime() - 5 * 60 * 1000)
                }
            }
        })
    
        if(userLogCount >= 6){
            return NextResponse.json({success:false, message:"Bu kullanıcı ile son 5 dakika içerisindeki maximum giriş/çıkış sayısına ulaşıldı!"}, {status:429})
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

        await prisma.Log.create({
            data:{
                success:true,
                userId:user.id,
                ip:ip,
                action:"USER_PASS_CARD",
                timestamp:new Date()
            }
        })


        if(user.isInside){
            return NextResponse.json({success:true ,message:"Kullanıcı başarıyla giriş yaptı!", user:userToReturn} , {status:200});
        }

        return NextResponse.json({success:true ,message:"Kullanıcı başarıyla çıkış yaptı!", user:userToReturn} , {status:200});
    }catch(err){
        await prisma.Log.create({
            data:{
                success:false,
                ip:ip,
                action:"USER_PASS_CARD",
                timestamp:new Date()
            }
        })

        return NextResponse.json({success:false, message:err.message}, {status: 500})
    }
   
}