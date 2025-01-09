"use client";
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import bg from "@/public/backgound.avif";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { LoginProvider } from "./contexts/LoginProvider";
import { AuthProvider } from "./contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Define routes without Header and Footer
  const noLayoutRoutes = ["/login", "/signup"];

  return (
    <html lang="en">
      <body className={`${poppins.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <LoginProvider>
            <ToastContainer
              position="top-center"
              autoClose={2500}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnFocusLoss
              pauseOnHover={false}
              theme="dark"
            />
            {/* Routes without layout (e.g., login/signup) */}
            {noLayoutRoutes.includes(pathname) ? (
              <div className="min-h-screen flex flex-col">
                {children}
                <Footer />
              </div>
            ) : (
              // Routes with layout (e.g., dashboard, home)
              <div
                style={{
                  backgroundImage: `url(${bg.src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  height: "100vh",
                  width: "100%",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                  }}
                ></div>
                <div className="relative z-10 min-h-screen flex flex-col">
                  <Header />
                  <main className="flex-grow">{children}</main>
                  <Footer />
                </div>
              </div>
            )}
          </LoginProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
