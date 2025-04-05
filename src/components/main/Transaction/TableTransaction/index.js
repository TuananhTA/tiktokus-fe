// components/OrderTable.js
"use client"
import React from 'react';
import { Table } from 'react-bootstrap';
const moment = require('moment');
require('dotenv').config()
import getData from '@/hooks/useFechtData';

let URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT

const TrasTable = ({ transactions, page= 0, size= 0 }) => {
    function formatToUSD(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount).replace(/,/g, '');
    }

  return (
    <Table hover>
      <thead>
        <tr>
          <th>Mã giao dịch</th>
          <th>Thực hiện</th>
          <th>Nội dung</th>
          <th>Chi phí</th>
          <th>Số dư</th>
          <th>Thời gian</th>
        </tr>
      </thead>
      <tbody>
        {transactions?.map(transaction => (
          <tr key={transaction.id}>
            <td>{page * size + transaction.id}</td>
            <th>{transaction.updatedBy}</th>
            <td className={transaction.type == "PLUS"? "" : `text-danger` }>{transaction.description}</td>
            <td>{transaction.type == "PLUS"? `+` :""}{formatToUSD(transaction.amount)}</td>
            <td>{formatToUSD(transaction.prevBalance)}</td>
            <td>{moment(transaction.createdAt).format(' HH:mm DD-MM-YYYY')}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TrasTable;
