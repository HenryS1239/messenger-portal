import React from "react";
import { Row, Col, Card, Space, Typography, Spin } from "antd";
import { APP } from "@/app/config";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

// const sleep = (v: number) => new Promise(resolve => setTimeout(resolve, v));

// -----
const now = new Date();

export const LoginLayout: React.FC<{ loading?: boolean; title?: string }> = ({ children, loading, title }) => {
  const dispatch = useDispatch();
  const history = useRouter();

  return (
    <div>
      <Card style={{ borderRadius: 20 }}>
        <Spin spinning={loading}>
          <Row justify="center" gutter={[16, 16]}>
            <Col span={24}>
              <Space size={16} style={{ width: "100%", textAlign: "center" }} direction="vertical">
                <img alt="Logo" style={{ width: 180, paddingTop: 20, paddingBottom: 20 }} src="/resources/img/messenger-icon-4.jpg" />
                <Typography.Title level={4}>{APP.NAME}</Typography.Title>
                {title && <Typography.Text>{title}</Typography.Text>}
              </Space>
            </Col>

            <Col md={24}>{children}</Col>
          </Row>
        </Spin>
      </Card>
      <div style={{ width: "100%", textAlign: "center", marginTop: 10 }}>
        <Typography.Text style={{ opacity: 0.5, fontSize: 12 }}></Typography.Text>
      </div>
    </div>
  );
};
