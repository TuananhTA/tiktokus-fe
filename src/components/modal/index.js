"use client";
import { Children, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ModalCustom({heading,buttonName,colorButton,size,children,onClick,close}) {
  const [show, setShow] = useState(false);

  const handleClose = () =>{
    close(setShow);
  } 
  const handlesubmit =()=>{
    onClick(setShow)
  }
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant={colorButton} onClick={handleShow}>
        {buttonName}
      </Button>

      <Modal 
        show={show} 
        onHide={handleClose}
        backdrop="static"
        size = {size}
      >
        <Modal.Header closeButton>
          <Modal.Title>{heading}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handlesubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalCustom;