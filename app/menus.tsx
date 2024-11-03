import React from "react";

// notes: don't use react-icons/gr, icon color is black but not able set icon color via style

const ReactIcon = {
  Ai: (Component: any) => <Component style={{ marginBottom: -2, marginRight: 20 }} />,
  Fi: (Component: any) => <Component style={{ marginBottom: -2, marginRight: 20 }} />,
  Fa: (Component: any) => <Component style={{ marginBottom: -2, marginRight: 20 }} />,
  Si: (Component: any) => <Component style={{ marginBottom: -2, marginRight: 20 }} />,
  Cg: (Component: any) => <Component style={{ marginBottom: -2, marginRight: 20 }} />,
  Bs: (Component: any) => <Component style={{ marginBottom: -2, marginRight: 20 }} />,
  Hi: (Component: any) => <Component style={{ marginBottom: -2, marginRight: 20 }} />,
  Ri: (Component: any) => <Component style={{ marginBottom: -2, marginRight: 20 }} />,
  Md: (Component: any) => <Component style={{ marginBottom: -2, marginRight: 20 }} />,
  Ti: (Component: any) => <Component style={{ marginBottom: -2, marginRight: 20 }} />,
  Gr: (Component: any) => <Component style={{ marginBottom: -2, marginRight: 20 }} />,
  Bi: (Component: any) => <Component style={{ marginBottom: -2, marginRight: 20 }} />,
  Im: (Component: any) => <Component style={{ marginBottom: -2, marginRight: 20 }} />,
};

export const PORTAL_MENU = [
  {
    id: "messages",
    name: "Messages",
    path: "/admin/message",
  },
  {
    id: "management",
    name: "User Management",
    children: [
      {
        key: "user",
        label: (
          <a rel="noopener noreferrer" href="/admin/users/management">
            Manage Users
          </a>
        ),
      },
      {
        key: "roles",
        label: (
          <a rel="noopener noreferrer" href="/admin/users/role">
            Manage Roles
          </a>
        ),
      },
    ],
  },
];
