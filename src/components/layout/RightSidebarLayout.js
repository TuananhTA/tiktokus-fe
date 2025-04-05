"use client" // Đảm bảo sử dụng trong client-side rendering

import React from 'react';
import styles from './RightSidebarLayout.module.css';
import dynamic from 'next/dynamic';

// Sử dụng dynamic import để đảm bảo PerfectScrollbar chỉ được tải trên client
const PerfectScrollbar = dynamic(() => import('react-perfect-scrollbar'), { ssr: false });
import 'react-perfect-scrollbar/dist/css/styles.css'; 

const RightSidebarLayout = ({ children, sidebar }) => {


  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <div className={styles.w}>
          <PerfectScrollbar>
            <main className={styles.mainContent}>{children}</main>
          </PerfectScrollbar>
      </div>
    </div>
  );
};

export default RightSidebarLayout;

