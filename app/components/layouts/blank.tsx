import React from "react";
import { Row, Col } from "antd";

export const Blank: React.FC = ({ children }) => {
  return (
    <div
      style={{
        backgroundImage: `url(/resources/img/bg.jpg)`,
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Row justify="center" align="middle" style={{ height: "100vh" }}>
        <Col xs={22} sm={20} md={12} lg={12} xl={8}>
          {children}
        </Col>
      </Row>
    </div>
  );
};
