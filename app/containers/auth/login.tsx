import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { api, ui } from "@/app/services";
import { useDispatch } from "react-redux";
import { REDUX_ACTIONS } from "@/stores/index";
import { LoginLayout } from "./layout";
import { useRouter } from "next/router";
import { useInit } from "../../hooks";
import { USER_TYPES } from "../../constants";

export const Login: React.FC<any> = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handlers = {
    login: async (values: any) => {
      try {
        setLoading(true);
        await api.auth.login({
          email: values.email,
          password: values.password,
        });

        const user: any = await api.auth.profile();
        if (user) {
          dispatch({ type: REDUX_ACTIONS.SET_USER, payload: { user } });
          ui.notify.success("Login Successful.");
          if (user.type === USER_TYPES.ADMIN) {
            await router.replace("/admin/message");
          } else {
            await router.replace("/portal/message");
          }
        }
      } catch (err: any) {
        ui.notify.error(err.message);
      } finally {
        setLoading(false);
      }
    },
    defaultPage: async () => {
      try {
        const user: any = await api.auth.profile();
        dispatch({ type: REDUX_ACTIONS.SET_USER, payload: { user } });
        if (user.type === USER_TYPES.ADMIN) {
          await router.replace("/admin/message");
        } else {
          await router.replace("/portal/message");
        }
      } catch (err) {}
    },
  };

  useInit(() => {
    handlers.defaultPage();
  });

  return (
    <LoginLayout title="" loading={loading}>
      <Form layout="vertical" onFinish={handlers.login}>
        <Form.Item
          name={"email"}
          rules={[
            {
              required: true,
              message: "This field is required",
            },
          ]}
          className="mb10-md"
        >
          <Input placeholder="email" size="large" type="email" prefix={<UserOutlined />} />
        </Form.Item>
        <Form.Item
          name={"password"}
          rules={[
            {
              required: true,
              message: "This field is required",
            },
          ]}
        >
          <Input placeholder="password" prefix={<LockOutlined />} type="password" size="large" />
        </Form.Item>

        <Form.Item>
          <div style={{ textAlign: "center" }}>
            <Button htmlType="submit" type="primary" size="large" block>
              Login
            </Button>
          </div>
        </Form.Item>
      </Form>
    </LoginLayout>
  );
};
