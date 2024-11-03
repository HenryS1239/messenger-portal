import React, { useEffect, useState } from "react";
import { Layout, Menu, Typography, Space, Row, Col, Button, Badge } from "antd";
import { PORTAL_MENU, IMenu } from "@/app/menus";
import { APP } from "@/app/config";
import { useAppAuthStore } from "@/stores/index";
import { BellOutlined, LogoutOutlined } from "@ant-design/icons";
import { api, ui } from "@/app/services";
import { useLogout } from "@/stores/dispatchers";
import { useRouter } from "next/router";
import Link from "next/link";
import { AuthGuard } from "../guards";
import { capitalize, isEmpty } from "lodash";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp } from "firebase/app";
import { USER_TYPES } from "../../constants";

// const Menus = () => {
//   const { user } = useAppAuthStore();

//   const acl = UserPermissions(user);

//   const router = useRouter();

//   const toMenu = (menu: IMenu, inheritId: string = "") => {
//     const key = inheritId ? `${inheritId}${MENU_KEY_SEP}${menu.id}` : `${menu.id}`;

//     const allowed = user?.role?.permissions.includes(menu.id);

//     if (allowed) {
//       if (menu.children && menu.children.length > 0) {
//         return (
//           <Menu.SubMenu style={{ color: "#fff" }} title={menu.name} key={key} icon={menu.icon}>
//             {menu.children.map((c) => toMenu(c, key))}
//           </Menu.SubMenu>
//         );
//       }
//       return (
//         <Menu.Item icon={menu.icon} key={key}>
//           <span>
//             {menu.path && (
//               <Link href={menu.path}>
//                 <a>{menu.name}</a>
//               </Link>
//             )}
//             {!menu.path && menu.name}
//           </span>
//         </Menu.Item>
//       );
//     }
//   };

//   const pathname = router.pathname;

//   const subMenusCheck = (menus: IMenu[], parent: string): any => {
//     return menus
//       .map((m) => {
//         const key = `${parent}${MENU_KEY_SEP}${m.id}`;
//         const isSamePath = () => m?.path === pathname;
//         const isMatchPattern = () => {
//           if (m?.pattern) {
//             return pathname.match(m.pattern);
//           }
//           return false;
//         };

//         if (isSamePath() || isMatchPattern()) {
//           return { ...m, menu_key: key };
//         }
//         if (m.children && m.children?.length > 0) {
//           return subMenusCheck(m.children, key);
//         }
//         return null;
//       })
//       .filter((v) => !!v);
//   };

//   const selectedChildKeys = PORTAL_MENU.map<any>((menu) => {
//     const isSamePath = () => menu?.path === pathname;
//     const isMatchPattern = () => {
//       if (menu?.pattern) {
//         return pathname.match(menu.pattern);
//       }
//       return false;
//     };
//     if (menu.children && menu.children?.length > 0) {
//       return subMenusCheck(menu.children, `${menu.id}`);
//     }
//     if (isSamePath() || isMatchPattern()) {
//       return { ...menu, menu_key: menu.id };
//     }
//     return null;
//   })
//     .filter((v) => !!v)
//     .flat(2)
//     .map((d) => d.menu_key);

//   // support 2 layers keys only (first prefix always is parent)
//   const selectedParentKeys = selectedChildKeys.map((k) => `${k}`.split(MENU_KEY_SEP)?.[0]);
//   const selectedKeys = selectedParentKeys.concat(selectedChildKeys).filter((v, i, self) => self.indexOf(v) === i);
//   return (
//     <div className="menu">
//       <Menu
//         style={{
//           minHeight: "25vh",
//         }}
//         mode="inline"
//         defaultSelectedKeys={selectedKeys}
//         theme="dark"
//         defaultOpenKeys={selectedKeys}
//       >
//         {[USER_TYPES.ADMIN, USER_TYPES.SUPER_ADMIN].includes(user?.type) &&
//           PORTAL_MENU.map((menu) => {
//             // TODO: filter menu with user role permission

//             const allowed = user?.role?.permissions.includes(menu.id);

//             if (allowed) {
//               return toMenu(menu);
//               // } else {
//               //     const key = `${menu.id}`;
//               //     return (
//               //         <Menu.SubMenu title={menu.name} key={key} icon={menu.icon}>
//               //             {toMenu(menu, key)}
//               //         </Menu.SubMenu>
//               //     );
//               // }
//             }
//           }).filter((v) => !!v)}
//       </Menu>
//     </div>
//   );
// };

const AppHeader: React.FC<any> = () => {
  const { user } = useAppAuthStore();
  const isSupported = () => "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;

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
            });
            window.location.reload();
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
          <Row align="middle">
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
          </Row>
        </Col>
        {userType === "Admin" && <Col></Col>}
        <Col>
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
