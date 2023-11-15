import { authMiddleware } from '@clerk/nextjs'

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({})

// export function middleware(request: NextRequest) {
//   const requestHeaders = new Headers(request.headers)
//   requestHeaders.set('x-pathname', request.nextUrl.pathname)

//   return NextResponse.next({
//     request: {
//       headers: requestHeaders,
//     },
//   })
// }

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
