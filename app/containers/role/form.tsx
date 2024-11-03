import { PortalContent } from "@/app/components/contents";
import { Tree, Button, Col, Form, Input, Row, Switch, FormProps, Space, Radio } from "antd";
import React, { useEffect, useState } from "react";
import { api, ui } from "@/app/services";
import { useRouter } from "next/router";

export const UserRoleForm: React.FC<{ id?: string }> = (props) => {
  const { id } = props;

  const [loading, setLoading] = useState(false);

  const [role, setRole] = useState<any>();

  const [form] = Form.useForm();

  const router = useRouter();

  const handlers = {
    refresh: async () => {
      if (id) {
        setLoading(false);
        try {
          const r = await api.user.role.get(id);
          setRole(r);
        } catch (err) {
          ui.notify.error(err);
        } finally {
          setLoading(false);
        }
      }
    },
    submit: (values: any) => {
      ui.confirm(`Are you sure you want to submit?`, async () => {
        setLoading(true);
        try {
          if (id) {
            await api.user.role.update(id as string, values);
            ui.notify.success(`Updated`);
          } else {
            await api.user.role.create(values);
            ui.notify.success(`Created`);
            router.push(`/admin/users/role`);
          }
        } catch (err) {
          ui.notify.error(err);
        } finally {
          setLoading(false);
        }
      });
    },
  };

  useEffect(() => {
    handlers.refresh().finally();
  }, [id]);

  const isReady = id ? !!role : true;

  const initialValues = {
    name: role?.name,
    type: role?.type,
    isSelectAll: role?.isSelectAll,
  };

  const formProps: FormProps = {
    labelCol: { sm: 8, md: 4, lg: 5 },
    wrapperCol: { sm: 12, md: 16, lg: 15 },
    layout: "vertical",
    initialValues,
    onFinish: handlers.submit,
    form: form,
  };

  return (
    <PortalContent back={true} title="Roles" loading={loading} subTitle="Create a Role and select permission to view based on respective role.">
      {isReady && (
        <Form {...formProps}>
          <Row>
            <Col span={24}>
              <Form.Item
                label="Role Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please insert the name.",
                  },
                ]}
              >
                <Input maxLength={32} />
              </Form.Item>
              <Form.Item name="type" label="Type">
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio name="Admin" value="admin">
                      Admin
                    </Radio>
                    <Radio name="Customer" value="customer">
                      Customer
                    </Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Form.Item colon={false}>
                <Button htmlType="submit" type="primary" disabled={loading}>
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </PortalContent>
  );
};
