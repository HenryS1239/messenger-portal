import { Button, Col, Divider, Form, Input, Row, Select, Space, InputNumber } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FormProps } from "antd/es/form/Form";

//internal imports
import { PortalContent } from "@/app/components/contents";
import { api, ui } from "@/app/services";
import { USER_TYPES } from "@/root/app/constants";

export const UserForm: React.FC<{ id?: string }> = (props) => {
  const { id } = props;

  const isCreate = !id;

  const [ready, setReady] = useState(false);

  const [loading, setLoading] = useState(false);
  const [selectors, setSelectors] = useState<{ roles: any[]; offices: any[] }>({
    roles: [],
    offices: [],
  });
  const [formValues, setFormValues] = useState<any>();

  const router = useRouter();

  const handlers = {
    reloadSelectors: async () => {
      try {
        const role = await api.user.role.list({ pageSize: 5000, current: 1 }, { type: [USER_TYPES.ADMIN] });
        if (role.items.length === 0) {
          throw Error("Please proceed to create role");
        }
        setSelectors({
          ...selectors,
          roles: role.items.map((r: any) => {
            return { label: r.name, value: r._id };
          }),
        });
      } catch (err) {
        ui.notify.error(err);
      }
    },
    refresh: async () => {
      if (id) {
        setLoading(true);
        try {
          const rs = await api.user.admin.get(id);
          if (rs) {
            setFormValues(rs);
          }
        } catch (err) {
          ui.notify.error(err);
        } finally {
          setLoading(false);
          setReady(true);
        }
      } else {
        setReady(true);
      }
    },
    submit: (values: any) => {
      ui.confirm(`Are you sure you want to submit?`, async () => {
        setLoading(true);
        try {
          if (id) {
            await api.user.admin.update(id, values);
            ui.notify.success(`Updated User`);
            await handlers.refresh();
          } else {
            await api.user.admin.create(values);
            ui.notify.success(`Created User`);
            router.push(`/portal/users/management`);
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
    if (ready) {
      handlers.refresh().finally();
    }
  }, [id]);

  useEffect(() => {
    handlers.refresh();
  }, []);

  useEffect(() => {
    handlers.reloadSelectors();
  }, [formValues]);

  const [userForm] = Form.useForm();
  const formProps: FormProps = {
    layout: "vertical",
    form: userForm,
    initialValues: formValues,
    onValuesChange: (_: any, values: any) => {
      setFormValues(values);
    },
    onFinish: async (values: any) => {
      const role = (await api.user.role.get(values.role)) as any;
      handlers.submit({ ...values, type: role.type });
    },
  };

  return (
    <PortalContent back={true} title={isCreate ? "Add a New User" : "Update User"} loading={loading}>
      <Row>
        <Col span={12}>
          {ready && (
            <Form {...formProps}>
              <Divider orientation="left">User Information</Divider>

              <Form.Item
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Username is required.",
                  },
                ]}
              >
                <Input maxLength={32} />
              </Form.Item>

              <Form.Item
                label="Full Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Full Name is required.",
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Contact No"
                name="contact"
                rules={[
                  {
                    required: true,
                    message: "Contact No is required.",
                  },
                ]}
              >
                <Input maxLength={11} className="remove-input-num-arrow" type="number" />
              </Form.Item>

              <Divider />
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Email is required.",
                  },
                ]}
              >
                <Input type="Role" />
              </Form.Item>
              <Form.Item
                label="Role"
                name="role"
                rules={[
                  {
                    required: true,
                    message: "Role is required.",
                  },
                ]}
              >
                <Select options={selectors.roles} />
              </Form.Item>

              {isCreate && (
                <>
                  <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                      {
                        required: true,
                        message: "Password is required.",
                      },
                    ]}
                  >
                    <Input.Password placeholder="New Password" />
                  </Form.Item>
                  <Form.Item
                    label={"Retype New Password"}
                    name={"retype_password"}
                    rules={[
                      {
                        required: true,
                        message: "Please retype the user password",
                      },
                      {
                        validator: async (rule, value) => {
                          if (value !== userForm.getFieldValue("password")) {
                            throw new Error("Passwords do not match!");
                          }
                        },
                      },
                    ]}
                  >
                    <Input.Password placeholder="Retype new Password" />
                  </Form.Item>
                </>
              )}

              <Form.Item>
                <Space size={8}>
                  <Button htmlType="submit" type="primary">
                    {isCreate ? "Create" : "Update"}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          )}
        </Col>
        <style jsx global>
          {`
            .ant-divider-horizontal.ant-divider-with-text::before,
            .ant-divider-horizontal.ant-divider-with-text::after {
              border-top: 1px solid !important;
            }
            .ant-divider-horizontal.ant-divider-with-text {
              font-size: 20px !important;
            }
          `}
        </style>
      </Row>
    </PortalContent>
  );
};
