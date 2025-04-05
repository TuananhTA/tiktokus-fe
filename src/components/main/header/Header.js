"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Navbar, Container, Button } from 'react-bootstrap';
import authorizeAxiosInstance from '@/hooks/axios';
import getData from '@/hooks/useFechtData';
import { useStore } from '@/store/hooks';
require('dotenv').config()
let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT

function Header({ title }) {
  const { data } = getData(`${URL_ROOT}/private/user/get-user-login`);
  console.log(data)
  function formatToUSD(amount) {
    
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount).replace(/,/g, '');
  }  

  const name = data?.data.fullName ? data?.data.fullName : null;
  const balance = data?.data.balance;
  const role  = data?.data.role;

  return (
    <>
      <Navbar className="bg-body-tertiary sticky-top">
        <Container>
          <Navbar.Brand href="#home">{title}</Navbar.Brand>
          <Navbar.Toggle />
          {name && (
            <Navbar.Collapse>
              <Navbar.Text>
                {name ? `Hi! ${name}` : "Bạn chưa đăng nhập"}
              </Navbar.Text>
            </Navbar.Collapse>
          )}
          {name && (
            <Navbar.Collapse className="justify-content-end">
              {role !="ADMIN"  && <Navbar.Text>
                Dư nợ :{formatToUSD(balance)}
              </Navbar.Text>}
              <Navbar.Text>
                <a href='/logout'>
                  <Button className="m-2">
                    Logout
                  </Button>
                </a>
              </Navbar.Text>
            </Navbar.Collapse>
          )}
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
