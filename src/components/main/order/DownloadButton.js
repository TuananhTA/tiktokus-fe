import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
require("dotenv").config();

const URL_ROOT = process.env.NEXT_PUBLIC_URL_ROOT;

const DownloadButton = () => {
  let url = `${URL_ROOT}/public/download`;

  return (
    <a href={url} download style={{marginTop:"3px"}}>
      <Button variant="success">Tải file CSV</Button>
    </a>
  );
};

export default DownloadButton;
