import React, { useEffect, useState } from "react";
import { Layout, Menu, Typography, Space, Row, Col, Button, Badge } from "antd";
import { PORTAL_MENU, IMenu } from "@/app/menus";
import { APP } from "@/app/config";
import { useAppAuthStore } from "@/stores/index";
import { BellOutlined } from "@ant-design/icons";
import { api, ui } from "@/app/services";
import { useLogout } from "@/stores/dispatchers";
import { useRouter } from "next/router";
import Link from "next/link";
import { AuthGuard } from "../guards";
import { capitalize, isEmpty } from "lodash";
import { USER_TYPES } from "../../constants";
import { useInterval } from "../../hooks";

const SIDER_WIDTH = 260;
const MENU_KEY_SEP = ".";

const Profile = () => {
  const { user } = useAppAuthStore();

  const userType = user?.type == "admin" || user?.type == "superadmin" ? "Admin" : capitalize(user?.type);

  const router = useRouter();

  const logout = useLogout();
  const [notificationCount, setNotificationCount] = useState(0);
  const isSupported = () => "Notification" in window && "serviceWorker" in navigator && "PushManager" in window;

  const handlers = {
    getAlert: async () => {
      try {
        const alert: any = await api.notification.browserAlert();
        if (alert && !isEmpty(alert.count) && Notification) {
          switch (alert.count) {
            case 0:
              break;
            case 1:
              if (Notification.permission === "granted") {
                const notificationForOnlyOne = new Notification(alert.title, {
                  body: alert.message,
                });
                setTimeout(() => notificationForOnlyOne.close(), 10 * 1000); // close after 10 seconds
              }
              break;
            default:
              if (Notification.permission === "granted") {
                const notificationForMoreThanOne = new Notification(alert.message);
                setTimeout(() => notificationForMoreThanOne.close(), 10 * 1000); // close after 10 seconds
              }
          }
          setNotificationCount(alert.count);
        }
      } catch (err) {
        ui.notify.error(err);
      }
    },
  };

  useEffect(() => {
    // get notification permission
    if (isSupported()) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  // 20 second interval's calling api
  useInterval(() => {
    if (isSupported()) {
      handlers.getAlert();
    }
  }, 20000); // 20 seconds

  return (
    <div>
      <Row justify="center" align="middle" className="py10-md">
        <Col
          span={20}
          style={{ cursor: "pointer" }}
          onClick={() => {
            user.type === USER_TYPES.ADMIN ? router.push("/portal/dashboard") : router.push("/portal/project");
          }}
        >
          <Space>
            {/* <img className="logo" alt="Logo" src="/resources/img/Logo-Main.png" style={{ width: 70 }} /> */}
            <Typography.Title
              level={2}
              className="wt-header-text"
              style={{
                marginTop: 25,
                paddingLeft: 75,
                lineHeight: "0.5em",
                textTransform: "uppercase",
              }}
            >
              {APP.NAME}
              <br />
              <span style={{ fontSize: "10px" }}>{userType} PORTAL</span>
            </Typography.Title>
          </Space>
        </Col>
      </Row>
      <Row justify="center" align="middle" className="px20-md py10-md" style={{ color: "#fff" }}>
        <Col span={24}>
          <div
            style={{
              borderRadius: "50%",
              overflow: "hidden",
              backgroundImage: user?.photo?.url ? `url(${user?.photo?.url})` : `url(/resources/img/profile.png)`,
              backgroundSize: "100%",
              backgroundPosition: "center center",
              width: 150,
              height: 150,
              margin: "auto",
            }}
          ></div>
        </Col>
        <Col span={24} className="text-center pt10-md">
          Welcome back,
          <br />
          <Typography.Title level={4} style={{ color: "#fff" }}>
            {user?.name}
          </Typography.Title>
        </Col>
        <Col span={24} className="text-center">
          <Badge count={notificationCount || 0}>
            <BellOutlined
              style={{ fontSize: "16px", cursor: "pointer", color: "#fff" }}
              onClick={() => {
                router.push("/portal/notifications");
              }}
            />
          </Badge>
          &nbsp; | &nbsp;
          <Link href={"/portal/profile"}>Profile</Link> &nbsp; | &nbsp;
          <a
            href="#"
            onClick={() => {
              ui.confirm(`Are you sure you want to logout ?`, () => {
                router.replace("/auth/login");
                api.auth.logout().finally(() => {
                  logout();
                });
              });
            }}
          >
            Logout
          </a>
        </Col>
      </Row>
    </div>
  );
};
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

  const router = useRouter();
  const logout = useLogout();

  const userType = user?.type == "admin" || user?.type == "superadmin" ? "Admin" : capitalize(user?.type);

  return (
    <Layout.Header className="wt-main-header" style={{ height: "auto", padding: 0 }}>
      <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet"></link>
      <Row justify="start" style={{ padding: "0px 20px 0px 20px", justifyContent: "space-between" }}>
        <Col>
          <Row align="middle">
            <Col style={{ display: "flex", justifyContent: "center" }}>
              <img className="logo" alt="Logo" src="/resources/img/messenger-icon-4.jpg" style={{ height: 64 }} />
            </Col>
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
          </Row>
        </Col>
        <Col>
          <Button
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
