import React, { useEffect, useState } from "react";
import { Layout, Typography, Space, Row, Col, Button, Dropdown } from "antd";
import { PORTAL_MENU } from "@/app/menus";
import { APP } from "@/app/config";
import { REDUX_ACTIONS, useAppAuthStore } from "@/stores/index";
import { DownOutlined, LogoutOutlined } from "@ant-design/icons";
import { api, ui } from "@/app/services";
import { useLogout } from "@/stores/dispatchers";
import { useRouter } from "next/router";
import { AuthGuard } from "../guards";
import { capitalize } from "lodash";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { USER_TYPES } from "../../constants";
import { useDispatch } from "react-redux";

const Menus = () => {
  const router = useRouter();

  return (
    <Space>
      {PORTAL_MENU.map((menu: any) => {
        if (menu.children) {
          return (
            <Col key={menu.id}>
              <Dropdown menu={{ items: menu.children }}>
                <Button type="link">
                  <Space>
                    {menu.name}
                    <DownOutlined />
                  </Space>
                </Button>
              </Dropdown>
            </Col>
          );
        } else {
          return (
            <Col key={menu.id}>
              <Button type="link" onClick={() => router.push(menu.path)}>
                <Space>{menu.name}</Space>
              </Button>
            </Col>
          );
        }
      })}
    </Space>
  );
};

const AppHeader: React.FC<any> = () => {
  const { user } = useAppAuthStore();
  const isSupported = () => "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;
  const isOptIn = user?.isNotification;
  const dispatch = useDispatch();

  const router = useRouter();
  const logout = useLogout();

  const userType = capitalize(user?.type);

  const firebaseConfig = {
    apiKey: APP.FIREBASE_API_KEY,
    authDomain: APP.FIREBASE_AUTH_DOMAIN,
    projectId: APP.FIREBASE_PROJECT_ID,
    storageBucket: APP.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: APP.FIREBASE_MESSAGING_SENDER_ID,
    appId: APP.FIREBASE_APP_ID,
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firebase Cloud Messaging and get a reference to the service
  const fcmMessaging = getMessaging(app);

  const handlers = {
    initFCM: async () => {
      const messaging = getMessaging();
      // Add the public key generated from the console here.
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          getToken(messaging, { vapidKey: "BG-Oc_qFClQAZgpUfab6G_U_vFp7h1WfW0kn7g9MFH-s6_Sb4l0GKsoVx1gmG5SjkoICq0eLiDgM5Jdp0oIOdMY" }).then(
            (newToken) => {
              api.auth.registerFCM({ fcmToken: newToken, isNotification: true }).then((res) => {});
            }
          );
          onMessage(fcmMessaging, (payload: any) => {
            new Notification(payload.data.title, {
              body: payload.data.body,
              icon: "/resources/img/messenger-icon-4.jpg",
            });
            window.location.reload();
          });
        }
      });
    },
    optInOut: async () => {
      ui.confirm(`Are you sure you want to ${isOptIn ? "opt out" : "opt in"} for notifications?`, async () => {
        try {
          await api.auth.optInOut();
          ui.notify.success(`Preference Updated`);
        } catch (err) {
          ui.notify.error(err);
        } finally {
          api.auth.profile().then((user) => {
            dispatch({ type: REDUX_ACTIONS.SET_USER, payload: { user } });
          });
        }
      });
    },
  };

  useEffect(() => {
    if (user?.type !== USER_TYPES.ADMIN && isSupported()) {
      handlers.initFCM();
    }
  });

  return (
    <Layout.Header className="wt-main-header" style={{ height: "auto", padding: 0 }}>
      <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"></link>
      <Row justify="start" style={{ padding: "0px 20px 0px 20px", justifyContent: "space-between" }}>
        <Col>
          <Row align="middle" gutter={[12, 12]}>
            <Col style={{ display: "flex", justifyContent: "center" }}>
              <img className="logo" alt="Logo" src="/resources/img/messenger-icon-4.jpg" style={{ height: 64 }} />
            </Col>
            <Col>
              <Typography.Title
                className="px30-md py10-md"
                level={4}
                style={{
                  margin: "0 0 0 6px",
                  fontFamily: "Montserrat",
                  fontWeight: "darker",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {userType} Portal
              </Typography.Title>
            </Col>
            {userType === "Admin" && <Space>{Menus()}</Space>}
          </Row>
        </Col>

        <Col>
          {userType === "Customer" && (
            <Space>
              <Button type="link" onClick={handlers.optInOut}>
                {isOptIn ? "Opt-out for Notifications" : "Opt-in for Notifications"}
              </Button>
            </Space>
          )}
          <Button
            type="link"
            icon={<LogoutOutlined />}
            onClick={() => {
              ui.confirm(`Are you sure you want to logout ?`, () => {
                api.auth.logout().finally(() => {
                  logout();
                  router.replace("/auth/login");
                });
              });
            }}
          >
            Logout
          </Button>
        </Col>
      </Row>
    </Layout.Header>
  );
};

export const Portal: React.FC = ({ children }) => {
  return (
    <Layout>
      <Layout>
        <AppHeader />

        <Layout>
          <Layout.Content
            style={{
              padding: "24px 24px 24px 24px",
              margin: 0,
              minHeight: "100vh",
            }}
          >
            <AuthGuard>{children}</AuthGuard>
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
