import { withAuth } from "next-auth/middleware";

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(req) {
        // We can add custom logic here if we need to check roles over the whole /admin segment
        // For now, if they are making it here they are authenticated.
    },
    {
        callbacks: {
            authorized: ({ token }) => {
                // Must be authenticated to access /admin/:path
                return !!token;
            },
        },
        pages: {
            signIn: "/admin",
        },
    }
);

// Protect all routes under /admin, EXCEPT the /admin login page itself
export const config = { matcher: ["/admin/(.*)"] };
