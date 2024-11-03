import { PortalContent } from "@/app/components/contents";
import { Button, Col, Divider, Form, Input, Row, Select, InputNumber, Checkbox } from "antd";
import React, { useEffect, useState } from "react";
import { api, ui } from "@/app/services";
import { useRouter } from "next/router";
import { FormProps } from "antd/es/form/Form";
import { USER_TYPES } from "../../constants";
import { SelectUser } from "../../components/selectors";

export const MessageBroadcastForm: React.FC<{ id?: string }> = (props) => {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<any>();
  const [form] = Form.useForm();

  const router = useRouter();

  const handlers = {
    submit: (values: any) => {
      ui.confirm(`Are you sure you want to submit?`, async () => {
        setLoading(true);
        try {
          await api.message.create(values);
          ui.notify.success(`Message Broadcasted`);
          router.push(`./`);
        } catch (err) {
          ui.notify.error(err);
        } finally {
          setLoading(false);
        }
      });
    },
  };

  const formProps: FormProps = {
    layout: "vertical",
    form: form,

    initialValues: formValues,
    onValuesChange: (_: any, values: any) => {
      setFormValues(values);
    },
    onFinish: (values: any) => {
      if (!values.selectAll && !values.receipient) {
        ui.notify.error("Please at least select 1 receipient before submission");
      } else {
        handlers.submit(values);
      }
    },
  };

  return (
    <PortalContent back={"/admin/message"} title={"Broadcast New Message"} loading={loading}>
      <Form {...formProps}>
        <Row>
          <Col span={12}>
            <Form.Item
              label="Subject"
              name="subject"
              rules={[
                {
                  required: true,
                  message: "Subject is required.",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item label="Content" name="content">
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item label="" name="selectAll" valuePropName="checked">
              <Checkbox>Select All</Checkbox>
            </Form.Item>
            <Form.Item label="Receipients" name="receipient">
              <SelectUser />
            </Form.Item>
          </Col>
        </Row>
        <Divider />

        <Row gutter={[16, 0]}>
          <Col md={24} lg={24}>
            <Form.Item colon={false}>
              <Button htmlType="submit" type="primary">
                Submit
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </PortalContent>
  );
};
