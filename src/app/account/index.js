"use client";
import { useStore } from "@/store/hooks";
import UserFormInfo from "@/components/main/account/UserFromInfo";
import Main from "@/components/main/main";
import { useState } from "react";
import { Button } from "react-bootstrap";
require("dotenv").config();

let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

export default function AccountCom() {
  const [{ user }] = useStore();
  const [userLogin, setUserLogin] = useState(user);

  return (
    <Main title={"Account"}>
      {user.role === "ADMIN" && (
        <div>
          <a href={"/account/account-management"}>
            <Button>Quản lý tài khoản</Button>
          </a>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div style={{ width: "500px" }}>
          <UserFormInfo formData={userLogin} setFormData={setUserLogin} />
        </div>
      </div>
    </Main>
  );
}
