import {SessionProvider} from "next-auth/react";
import {auth} from "~/server/auth"


export default function RootLayout({children}: { children: React.ReactNode }) {
    const session = auth();
    if (session)
    return (
        <html>
        <body>
        <SessionProvider session={}>{children}</SessionProvider>
        </body>
        </html>
    );
}
