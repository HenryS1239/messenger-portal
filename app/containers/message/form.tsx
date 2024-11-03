import { PortalContent } from "@/app/components/contents";
import { Button, Col, Divider, Form, Input, Row, Select, InputNumber } from "antd";
import React, { useEffect, useState } from "react";
import { api, ui } from "@/app/services";
import { useRouter } from "next/router";
import { useInit } from "@/app/hooks";
import { FormProps } from "antd/es/form/Form";
import { USER_TYPES } from "../../constants";

export interface IOffice {
  name: string;
  registrationNo: string;
  phoneNo: string;
  email: string;
  website: string;
  location: { lat: string; lng: string };
  address: {
    address1: string;
    address2: string;
    address3: string;
    city: string;
    country: string;
    postcode: string;
    state: string;
  };
}

export const OfficeManagementForm: React.FC<{ id?: string }> = (props) => {
  const { id } = props;

  const isCreate = !id;

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<any>();

  const router = useRouter();

  const handlers = {
    init: async () => {
      await handlers.refresh();
    },
    refresh: async () => {
      if (id) {
        setLoading(true);
        try {
          const rs = await api.office.get(id);
          setFormValues(rs);
          form.setFieldsValue(rs);
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
          values.type = USER_TYPES.ADMIN;
          if (id) {
            await api.office.update(id, values);
            ui.notify.success(`Updated Office`);
            await handlers.refresh();
          } else {
            await api.office.create(values);
            ui.notify.success(`Created Office`);
            router.push(`./`);
          }
        } catch (err) {
          ui.notify.error(err);
        } finally {
          setLoading(false);
        }
      });
    },
  };

  useInit(async () => {
    await handlers.init();
  });

  useEffect(() => {
    handlers.refresh().finally();
  }, []);

  const [form] = Form.useForm();
  const formProps: FormProps = {
    layout: "vertical",
    form: form,

    initialValues: formValues,
    onValuesChange: (_: any, values: any) => {
      setFormValues(values);
    },
    onFinish: (values: any) => {
      handlers.submit(values);
    },
  };

  return (
    <PortalContent back={true} title={isCreate ? "Add a New Office " : "Update Office "} loading={loading}>
      <Form {...formProps}>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Company Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: "Company Name is required.",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Company Registration No."
              name="registerNo"
              required
              rules={[
                {
                  required: true,
                  message: "Registration No. is required.",
                },
              ]}
            >
              <Input maxLength={40} />
            </Form.Item>
            <Form.Item
              label="Contact No."
              name="contact"
              required
              rules={[
                {
                  required: true,
                  message: "Contact No. is required.",
                },
              ]}
            >
              <Input className="remove-input-num-arrow" type="number" maxLength={11} />
            </Form.Item>
          </Col>
        </Row>
        <Divider />

        <Row gutter={[16, 0]}>
          <Col md={24} lg={12}>
            <Form.Item label="Address 1" name={["address", "address1"]}>
              <Input maxLength={100} />
            </Form.Item>
            <Form.Item label="Address 2" name={["address", "address2"]}>
              <Input maxLength={100} />
            </Form.Item>
            <Form.Item label="Address 3" name={["address", "address3"]}>
              <Input maxLength={100} />
            </Form.Item>

            <Form.Item style={{ marginBottom: 0 }}>
              <Row gutter={[8, 8]}>
                <Col span={12}>
                  <Form.Item label="City" name={["address", "city"]}>
                    <Input maxLength={60} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="Postcode" name={["address", "postcode"]}>
                    <Input maxLength={10} />
                  </Form.Item>
                </Col>
              </Row>
            </Form.Item>
          </Col>

          <Col md={24} lg={24}>
            <Form.Item colon={false}>
              <Button htmlType="submit" type="primary">
                {isCreate ? "Create" : "Update"}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </PortalContent>
  );
};
