import React from "react";
import { Card, Breadcrumb, Spin } from "antd";
import { useRouter } from "next/router";
import { PageHeader } from "@ant-design/pro-components";

type AppProps = {
  children?: any;
  back?: any;
  title?: string;
  subTitle?: string | React.ReactNode;
  extra?: React.ReactElement;
  loading?: boolean;
  isStep?: boolean;
  breadcrumbs?: {
    name: string;
    path?: string;
  }[];
};

export const Portal = ({ children, back, title, subTitle, extra, loading = false, breadcrumbs, isStep = false }: AppProps) => {
  const router = useRouter();

  return (
    <Card bordered={!isStep}>
      {(title || extra) && (
        <PageHeader
          style={{
            paddingLeft: 0,
            paddingRight: 0,
            paddingBottom: subTitle ? 0 : "auto",
          }}
          ghost={false}
          onBack={back ? () => (typeof back === "string" ? router.replace(back) : router.back()) : undefined}
          title={title}
          extra={extra}
        />
      )}
      {subTitle && (
        <div style={{ paddingBottom: "30px", color: "#a6a6a6" }}>
          <span>{subTitle}</span>
        </div>
      )}

      {breadcrumbs && (
        <Breadcrumb style={{ marginBottom: 8 }}>
          {breadcrumbs?.map((b, i) => {
            return (
              <Breadcrumb.Item key={i} href={b.path}>
                {b.name}
              </Breadcrumb.Item>
            );
          })}
        </Breadcrumb>
      )}

      <div className="wt-portal-content">
        <Spin spinning={loading}>{children}</Spin>
      </div>
    </Card>
  );
};
