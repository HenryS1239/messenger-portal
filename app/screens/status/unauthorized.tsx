import {Button, Result} from "antd";

export const Unauthorized = (props: { message: string }) => {
    return <Result
        status="warning"
        title={props?.message}
        extra={
            <Button type="primary" key="console" href={"auth/login"}>
                Go to Login
            </Button>
        }
    />
}
