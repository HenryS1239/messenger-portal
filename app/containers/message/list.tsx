import { PortalContent } from "@/app/components/contents";
import { Button, Col, Form, Input, Row, Space, Table } from "antd";
import { useEffect, useState } from "react";
import { IPagination } from "@/app/models/ui.models";
import { api, ui } from "@/app/services";
import { EditOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import { USER_TYPES } from "../../constants";
import { SearchButtonGroup } from "../../components/form";

export const List = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any>([]);
  const [pagination, setPagination] = useState<IPagination>({
    current: 1,
    pageSize: 50,
    total: 0,
  });
  const [filters, setFilters] = useState<any>();

  const columns = [
    {
      dataIndex: "receiver",
      title: "Receiver Name",
    },
    {
      dataIndex: "message",
      title: "Message",
    },
    {
      title: "Actions",
      align: "right",
      width: 100,
      render: (r: any) => {
        return (
          <Space size={2}>
            <Button href={`./message/edit/${r._id}`} type="link" icon={<EditOutlined />} />
          </Space>
        );
      },
    },
  ] as any[];

  const handlers = {
    refresh: async () => {
      setLoading(true);
      try {
        const rs = await api.office.list(pagination, {
          ...filters,
          type: USER_TYPES.ADMIN,
        });
        setPagination({
          ...pagination,
          total: rs.total,
        });
        setRows(rs.items);
      } catch (err) {
        ui.notify.error(err);
      } finally {
        setLoading(false);
      }
    },
  };

  const extra = (
    <Button style={{ width: 80 }} type="primary" href="/admin/message/create">
      New
    </Button>
  );

  useEffect(() => {
    handlers.refresh().finally();
  }, [filters, pagination.current, pagination.pageSize]);
  const [filterForm] = useForm();

  return (
    <PortalContent title="Message Management" extra={extra} loading={loading}>
      <Row>
        <Col span={24}>
          <Form
            form={filterForm}
            layout="vertical"
            onFinish={(values) => {
              values.type = USER_TYPES.ADMIN;
              setPagination({ ...pagination, current: 1 });
              setFilters(values);
            }}
          >
            <Row gutter={[8, 2]}>
              <Col xl={8} lg={8} md={10} sm={12} xs={24}>
                <Form.Item name="name">
                  <Input placeholder="Search by Receiver Name" maxLength={120} />
                </Form.Item>
              </Col>
              <Col>
                <SearchButtonGroup
                  loading={loading}
                  setFilters={setFilters}
                  pagination={pagination}
                  setPagination={setPagination}
                  form={filterForm}
                />
              </Col>
            </Row>
          </Form>
        </Col>

        <Col span={24}>
          <Table
            rowKey="_id"
            columns={columns}
            dataSource={rows}
            pagination={pagination}
            onChange={(pagination, filters, sorter) => {
              setPagination({
                current: pagination.current,
                pageSize: pagination.pageSize,
              });
            }}
          />
        </Col>
      </Row>
    </PortalContent>
  );
};
