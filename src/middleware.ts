import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'



export function middleware(request: NextRequest) {
// Protect admin routes
if (request.nextUrl.pathname.startsWith('/admin')) {
// Add your authentication logic here
const isAuthenticated = /* your auth check */;



if (!isAuthenticated) {
return NextResponse.redirect(new URL('/login', request.url))
}
}



return NextResponse.next()
}



export const config = {
matcher: '/admin/:path*'
}