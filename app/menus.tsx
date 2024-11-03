import React from "react";
import { FaUserTie } from "react-icons/fa";
import { AiOutlineUser } from "react-icons/ai";
import { SiHackthebox } from "react-icons/si";
import { MdOutlineCorporateFare } from "react-icons/md";
import { USER_TYPES } from "./constants";

export interface IMenu {
  id: string;
  name: string;
  path?: string;
  pattern?: RegExp;
  icon?: React.ReactNode;
  children?: IMenu[];
  userTypes?: string[];
}

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

export const PORTAL_MENU: IMenu[] = [
  {
    id: "dashboard",
    name: "Dashboard",
    icon: ReactIcon.Fa(FaUserTie),
    path: "/portal/dashboard",
  },
  {
    id: "p-projects",
    name: "Projects",
    icon: ReactIcon.Si(SiHackthebox),
    // path: "/portal/project",
    pattern: /\/portal\/project\/\w/,
    children: [
      {
        id: "p-projects-create",
        name: "Create New",
        path: "/portal/project/create",
        pattern: /\/admin\/project\/create\/\w/,
      },
      {
        id: "p-projects-preconstruction",
        name: "Pre-Construction",
        path: "/portal/project/preconstruction",
        pattern: /\/admin\/project\/preconstruction\/\w/,
      },
      {
        id: "p-projects-construction",
        name: "Construction",
        path: "/portal/project/construction",
        pattern: /\/admin\/project\/construction\/\w/,
      },
      {
        id: "p-projects-postconstruction",
        name: "Post Construction",
        path: "/portal/project/postconstruction",
        pattern: /\/admin\/project\/postconstruction\/\w/,
      },
      {
        id: "p-projects-dlp",
        name: "Defect Liability Period",
        path: "/portal/project/dlp",
        pattern: /\/admin\/project\/dlp\/\w/,
      },
      {
        id: "p-projects-completion",
        name: "Completion",
        path: "/portal/project/completed",
        pattern: /\/admin\/project\/completed\/\w/,
      },
    ],
    // children: [
    //   {
    //     id: "p-projects-preconstruction",
    //     name: "Preconstruction",
    //     path: "/portal/project/preconstruction",
    //     pattern: /\/admin\/projects\/preconstruction\/\w/,
    //   },
    //   {
    //     id: "p-projects-construction",
    //     name: "Construction",
    //     path: "/portal/project/construction",
    //     pattern: /\/admin\/projects\/construction\/\w/,
    //   },
    //   {
    //     id: "p-projects-postconstruction",
    //     name: "Post Construction",
    //     path: "/portal/project/postconstruction",
    //     pattern: /\/admin\/projects\/postconstruction\/\w/,
    //   },
    //   {
    //     id: "p-projects-dlp",
    //     name: "DLP",
    //     path: "/portal/project/dlp",
    //     pattern: /\/admin\/projects\/dlp\/\w/,
    //   },
    //   {
    //     id: "p-projects-completion",
    //     name: "Completion",
    //     path: "/portal/project/completion",
    //     pattern: /\/admin\/projects\/completion\/\w/,
    //   },
    // ],
  },
  {
    id: "p-customers",
    name: "Customers",
    pattern: /\/admin\/customers\/\w/,
    icon: ReactIcon.Ai(AiOutlineUser),
    children: [
      {
        id: "p-customers-individual",
        name: "Individual",
        icon: ReactIcon.Ai(AiOutlineUser),
        path: "/admin/customers/individual",
        pattern: /\/admin\/individual\/\w/,
        children: [
          {
            id: "p-customers-individual-site",
            name: "Site",
            path: "/admin/customers/individual/site",
            pattern: /\/admin\/customers\/site\/\w/,
          },
          {
            id: "p-customers-individual-overview",
            name: "Users",
            path: "/admin/customers/individual/overview",
            pattern: /\/admin\/customers\/overview\/\w/,
          },
        ],
      },
      {
        id: "p-customers-corporate",
        name: "Corporate",
        icon: ReactIcon.Md(MdOutlineCorporateFare),
        path: "/admin/customers/corporate",
        pattern: /\/admin\/corporate\/\w/,
        children: [
          {
            id: "p-customers-corporate-site",
            name: "Site",
            path: "/admin/customers/corporate/site",
            pattern: /\/admin\/customers\/site\/\w/,
          },
          {
            id: "p-customers-corporate-overview",
            name: "Users",
            path: "/admin/customers/corporate/overview",
            pattern: /\/admin\/customers\/overview\/\w/,
          },
          {
            id: "p-customers-corporate-company",
            name: "Company",
            path: "/admin/customers/corporate/company",
            pattern: /\/admin\/customers\/company\/\w/,
          },
        ],
      },
    ],

    userTypes: [USER_TYPES.ADMIN],
  },
];
