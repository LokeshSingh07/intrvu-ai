import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export { default } from "next-auth/middleware"
import { getToken } from "next-auth/jwt"



export async function proxy(request: NextRequest){
    const token = await getToken({req:request, secret: process.env.NEXTAUTH_SECRET});
    const url = request.nextUrl
    // console.log("url => ", url);

    if(token &&
        (
            url.pathname.startsWith('/auth') 
        )
    ){
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if(!token && url.pathname.startsWith('/dashboard') ){
        return NextResponse.redirect(new URL('/auth', request.url))
    }

    return NextResponse.next();
}
 

// kon kon se path pr middleware run krna h
export const config = {
    matcher: [
        '/auth',
        '/dashboard/:path*',
        "/profile"
    ],
}