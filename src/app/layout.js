import localFont from "next/font/local";
import "./globals.css";
import RightSidebarLayout from '@/components/layout/RightSidebarLayout';
import SidebarContent from "@/components/sidebar/sidebar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer} from 'react-toastify';
import Provider from "@/store/Provider";
import 'react-photo-view/dist/react-photo-view.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { Roboto } from 'next/font/google'
import 'tippy.js/dist/tippy.css'; 
import "react-horizontal-scrolling-menu/dist/styles.css";
const roboto = Roboto({
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  display: 'swap',
})

export const metadata = {
  title: "Ronin",
  description: "Ronin ecomment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <link rel="icon" href="/logo.png" />
      <body className={roboto.className}>
        <Provider>
            <RightSidebarLayout sidebar={<SidebarContent />} children={children}>
            </RightSidebarLayout>
            <ToastContainer autoClose={1000} />
        </Provider>
      </body>
    </html>
  );
}