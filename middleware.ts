import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If not logged in and trying to access student pages → redirect home
  if (!user && request.nextUrl.pathname.startsWith("/student")) {
    return NextResponse.redirect(new URL("/auth/student-login", request.url));
  }

  // If not logged in and trying to access admin pages → redirect to admin login
  if (!user && request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/auth/admin-login", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/student/:path*", "/admin/:path*"],
};
