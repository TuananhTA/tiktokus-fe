"use client"
import Link from 'next/link'
import style from "./style.module.css"
import { useRouter } from 'next/navigation';


const SidebarContent = () =>{
  const router = useRouter();

  const navigate = (href)=> router.push(href);

  return(
    <div className={style.sidebar}>
      <div className={style.wappLogo}>
        <div className={style.logo}></div>
      </div>
      <Link href="/"><div  className={`p-3 ${style.item}`}><h3>Dashboard</h3></div></Link>
      <div onClick={()=> navigate("/order")} className={`p-3 ${style.item}`}><h3>Order</h3></div>
      <Link href="/product"><div  className={`p-3 ${style.item}`}><h3>Product</h3></div></Link>
      <Link href="/category"><div  className={`p-3 ${style.item}`}><h3>Category</h3></div></Link>
      <Link href="/transaction"><div  className={`p-3 ${style.item}`}><h3>Transaction</h3></div></Link>
      <Link href="/account"><div  className={`p-3 ${style.item}`}><h3>Account</h3></div></Link>
    </div>
  );
} 
export default SidebarContent;  
  