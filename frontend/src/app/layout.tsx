import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AppSidebar from "@/components/AppSidebar";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "AquaOne — AI-Powered Citizen Stream & One Health Intelligence Platform",
  description: "Observe. Validate. Understand. Predict. Protect. Unified citizen science, AI validation, ML risk prediction, and FHIR health interoperability.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
        <AuthProvider>
          <Navbar />
          <div className="flex flex-1 w-full max-w-[1600px] mx-auto">
            <AppSidebar />
            <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </main>
          </div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
