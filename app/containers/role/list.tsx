import { DeleteOutlined, EditOutlined, SearchOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Space, Table } from "antd";
import { useEffect, useState } from "react";
import Link from "next/link";
import { api, ui } from "@/app/services";
import { IPagination } from "../../models/ui.models";
import { PortalContent } from "../../components/contents";
import { ListingButton } from "../../components/listing/button";
import { ROLE_TYPES } from "../../constants";
import { capitalize } from "lodash";
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
  const [form] = Form.useForm();

  const columns = [
    {
      dataIndex: "name",
      title: "Role Name",
      // sorter: true,
    },
    {
      dataIndex: "type",
      title: "Role Type",
      render: (r: any) => capitalize(r),

      // sorter: true,
    },
    {
      title: "Actions",
      width: 100,
      align: "right",
      render: (r: any) => {
        return (
          <Space size={2}>
            <ListingButton href={`/admin/users/role/edit/${r._id}`} icon={<EditOutlined />} tooltipMsg="Edit" />
            <ListingButton
              tooltipMsg="Delete"
              icon={<DeleteOutlined />}
              onClick={() => handlers.delete(r._id)}
              additionalProps={{
                className: "table-column-actions-button",
                danger: true,
              }}
            />
          </Space>
        );
      },
    },
  ] as any[];

  const handlers = {
    refresh: async () => {
      setLoading(false);
      try {
        const rs = await api.user.role.list(pagination, filters);
        if (rs) {
          setPagination({
            ...pagination,
            total: rs.total,
          });
          setRows(rs.items);
        }
      } catch (err) {
        ui.notify.error(err);
      } finally {
        setLoading(false);
      }
    },
    delete: (id: string) => {
      ui.confirm(`Are you sure you want to delete this role? This action cannot be undone.`, async () => {
        try {
          setLoading(true);
          await api.user.role.delete(id);
          ui.notify.success(`Removed`);
          await handlers.refresh();
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
  }, [filters, pagination.current, pagination.pageSize]);

  const extra = (
    <Link href="/admin/users/role/create">
      <Button style={{ width: 80 }} type="primary">
        New
      </Button>
    </Link>
  );

  return (
    <PortalContent title="Account Role Management" extra={extra}>
      <Row>
        <Col span={24}>
          <Form
            layout="vertical"
            onFinish={(values) => {
              setPagination({ ...pagination, current: 1 });
              setFilters(values);
            }}
            form={form}
          >
            <Row gutter={[8, 2]}>
              <Col xl={8} lg={8} md={10} sm={12} xs={24}>
                <Form.Item name="search">
                  <Input placeholder="Search by Name" maxLength={120} />
                </Form.Item>
              </Col>
              <Col>
                <SearchButtonGroup loading={loading} setFilters={setFilters} pagination={pagination} setPagination={setPagination} form={form} />
              </Col>
            </Row>
          </Form>
        </Col>

        <Col span={24}>
          <Table
            rowKey="_id"
            // footer={(data) => (
            //   <span>
            //     Showing {data.length} record(s) of total {pagination.total}
            //   </span>
            // )}
            columns={columns}
            loading={loading}
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
