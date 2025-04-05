"use client"
import Main from "@/components/main/main"
import ListAccount from "@/components/main/account/accountManagement/ListAccount"
import ListProduct from "@/components/main/account/accountManagement/ListProduct"
import { useState } from "react";
import { Container } from "react-bootstrap";
import getData from "@/hooks/useFechtData"
import CreateAccountModal from "@/components/main/account/accountManagement/CreateAccountModal";
require("dotenv").config();

let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

export default function AccountManagementIndex(){

    const [userClick, setUserClick] = useState();
    const {data} = getData(`${URL_ROOT}/private/user/get-staff`);
    
    const hannleClick = (user)=>{
        setUserClick(user);
    }


    return(
        <Main title={"Account management"}>
            <CreateAccountModal></CreateAccountModal>
            <Container>
                <div style={{width : "100%"}}>
                    <ListAccount users={data?.data} handleClick = {hannleClick}></ListAccount>
                </div>
                <div style={{width : "100%"}}>
                    <ListProduct user={userClick}></ListProduct>
                </div>
            </Container>
        </Main>
    )
}