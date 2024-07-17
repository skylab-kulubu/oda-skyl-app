import { NextResponse } from "next/server"
import { jwtVerify } from 'jose';

export async function middleware(req){

    const authHeader = req.headers.get("Authorization")

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return NextResponse.json({success:false, message:"Geçersiz token!"}, {status:401})
    }

    const token = authHeader.split(" ")[1]

    try{
      const secret = new TextEncoder().encode(process.env.JWT_SECRET)
        const {payload} = await jwtVerify(token, secret)
        req.user = payload

        if( payload.role !== "ROLE_ADMIN"){
            return NextResponse.json({success:false, message:"Yetkisiz erişim!"}, {status:403})
        }

    }catch(err){
        return NextResponse.json({success:false, message:err.message}, {status:500})
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/api/users/:path*', '/api/userLogs/:path*']
}