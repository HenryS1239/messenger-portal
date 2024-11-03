import { Button, Result, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";

export const Error404 = () => {
    const usr = useSelector<any, any>(({ auth }) => auth?.user);

    const router = useRouter();

    return <Result
        status="warning"
        title="Error 404"
        subTitle={<Typography.Text>Ooops, Page {router.pathname} cannot be found.</Typography.Text>}
        extra={
            <Button type="primary" icon={<ArrowLeftOutlined />} href={usr ? "/sc" : "/auth/login"}>
                {usr ? "Go to Dashboard" : "Go to Login"}
            </Button>
        }
    />
}
