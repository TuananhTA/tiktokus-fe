"use client";
import { Children, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalCustomV2({heading,size,children,setShow,show,close,update, deleteProduct}) {

  return (
    <>
      <Modal 
        show={show} 
        onHide={close}
        backdrop="static"
        size = {size}
      >
        <Modal.Header closeButton>
          <Modal.Title>{heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={deleteProduct}>
            Xóa
          </Button>
          <Button variant="primary" onClick={update}>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalCustomV2;