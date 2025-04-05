import React, { useState } from 'react';
import { Tab, Nav } from 'react-bootstrap';
import { PhotoProvider, PhotoView } from 'react-photo-view';

const OrderTabComponent = ({ orders }) => {
    const [activeKey, setActiveKey] = useState(orders.length > 0 ? orders[0].index : '');

    return (
      <Tab.Container
        id="order-tabs"
        activeKey={activeKey}
        onSelect={(k) => setActiveKey(k)}
      >
        <Nav variant="pills">
          {orders.map((order, index) => (
            <Nav.Item key={order.index}>
              <Nav.Link eventKey={order.index}>{index}</Nav.Link>
            </Nav.Item>
          ))}
        </Nav>

        <Tab.Content>
          {orders.map((order, index) => (
            <Tab.Pane eventKey={order.index} key={order.index}>
              <div style={{ display: "flex" }}>
                <div style={{ width: "40%" }}>
                  <p className="mb-1">
                    <strong>Customer Name:</strong> {order.customName}
                  </p>
                  <p className="mb-1">
                    <strong>Phone:</strong> {order.phone}
                  </p>
                  <p className="mb-1">
                    <strong>Email:</strong> {order.email}
                  </p>
                  <p className="mb-1">
                    <strong>Address:</strong> {order.street}{" "}
                    {order.streetTwo ? `, ${order.streetTwo}` : ""},{order.city}
                    , {order.state}, {order.zipCode},{order.country}
                  </p>
                  <p className="mb-1">
                    <strong>Status:</strong> {order.status}
                  </p>
                  <p className="mb-1">
                    <strong>Label URL:</strong>{" "}
                    <a
                      href={order.labelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      cick để xem
                    </a>
                  </p>
                  <p className="mb-1">
                    <strong>Tracking Number:</strong> {order.tracking}
                  </p>
                  <p className="mb-1">
                    <strong>Extra ID:</strong> {order.extraId}
                  </p>
                  <p className="mb-1">
                    <strong>Type:</strong> {order.type}
                  </p>
                </div>
                <div>
                  <h4>Danh sách sản phẩm</h4>
                  <ul>
                    {order.orderDetailsList.map((detail, index) => (
                      <li
                        key={index}
                        className="p-2"
                        style={{ display: "flex" }}
                      >
                        <PhotoProvider key={detail.product.id}>
                          <PhotoView src={detail.product.urlImage}>
                            <img
                              src={detail.product.urlImage}
                              alt="Thumbnail"
                              style={{
                                width: "50px",
                                height: "50px",
                                cursor: "pointer",
                              }}
                            />
                          </PhotoView>
                        </PhotoProvider>
                        <div style={{padding : "0 4px"}}>
                          <p className="m-0" style={{fontSize:"16px"}}>
                            <strong>{detail.product.productName}</strong> x{" "}
                            {detail.quantity}
                          </p>
                          <p className='m-0'>
                            sku: {detail.product.sku}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Tab.Pane>
          ))}
        </Tab.Content>
      </Tab.Container>
    );
};

export default OrderTabComponent;