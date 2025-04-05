import React, { useState } from 'react';
import { Modal, Button, Tab, Nav } from 'react-bootstrap';
import OrderTabComponent from './index';
import style from "./style.module.css"
const OrderModal = ({ orders, showModal, handleClose, handleSubmit }) => {
    return (
        <Modal show={showModal} onHide={handleClose} size="lg" className={style["modal-fullscreen"]} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Order Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className={style["modal-content"]} >
               <OrderTabComponent orders={orders}></OrderTabComponent>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleSubmit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
};
export default OrderModal;