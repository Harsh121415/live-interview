import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";


export const metadata = {
  title: "V-interview",
  description:
    "virtual interview platform, mock interview website, online interview practice, job interview preparation, real-time interview feedback, remote interview coaching, interview simulator, interview tips and tricks, practice interviews online, video interview training.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={` antialiased`}
        >
          {children}
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
