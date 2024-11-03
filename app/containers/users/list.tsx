import { PortalContent } from "@/app/components/contents";
import { Button, Col, Row, Space, Table, Tag, Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import { IPagination } from "@/app/models/ui.models";
import { CheckCircleOutlined, DeleteOutlined, EditOutlined, SearchOutlined, StopOutlined, CloseOutlined } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";

//internal imports
import { useAppAuthStore } from "@/stores/index";
import { api, ui } from "@/app/services";
import { USER_TYPES } from "@/root/app/constants";
import { ListingButton } from "@/root/app/components/listing/button";
import { SearchButtonGroup } from "@/root/app/components/form";

export const List: React.FC<any> = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any>([]);
  const [pagination, setPagination] = useState<IPagination>({
    current: 1,
    pageSize: 50,
    total: 0,
  });
  const [filters, setFilters] = useState<any>();
  const { user } = useAppAuthStore();

  const columns = [
    {
      dataIndex: "username",
      title: "Username",
      // sorter: true,
    },
    {
      dataIndex: ["role", "name"],
      title: "Role",
      // sorter: true,
    },
    {
      dataIndex: "email",
      title: "Email",
      // sorter: true,
    },
    {
      title: "Actions",
      align: "right",
      width: 100,
      render: (r: any) => {
        return (
          <Space size={2}>
            <ListingButton tooltipMsg="Edit" icon={<EditOutlined />} href={`./management/edit/${r._id}`} />
            <ListingButton
              icon={r.isDisabled ? <CheckCircleOutlined /> : <StopOutlined />}
              tooltipMsg={r.isDisabled ? "Unblock" : "Block"}
              style={{ color: r.isDisabled ? "Gray" : "Red" }}
              onClick={() => handlers.setDisable(r._id, r.isDisabled)}
            />
            <ListingButton
              icon={<DeleteOutlined />}
              tooltipMsg="Delete"
              onClick={() => handlers.deleteUser(r._id)}
              additionalProps={{ danger: true }}
            />
          </Space>
        );
      },
    },
  ] as any[];

  const handlers = {
    refresh: async () => {
      setLoading(true);
      try {
        if (user) {
          const rs = await api.user.admin.list(pagination, {
            ...filters,
          });
          const removeCurrentUser = rs.items.filter((acc: any) => acc._id !== user._id);
          setPagination({
            ...pagination,
            total: rs.total,
          });
          setRows(removeCurrentUser);
        }
      } catch (err) {
        ui.notify.error(err);
      } finally {
        setLoading(false);
      }
    },
    deleteUser: async (id: string) => {
      ui.confirm(`Are you sure you want to delete this user? This action cannot be undone.`, async () => {
        try {
          setLoading(true);
          await api.user.admin.delete(id);
          ui.notify.success(`Removed`);
          await handlers.refresh();
        } catch (err) {
          ui.notify.error(err);
        } finally {
          setLoading(false);
        }
      });
    },
    setDisable: async (id: string, disabled: boolean) => {
      ui.confirm(`Are you sure you want to ${!disabled ? "block" : "unblock"} this user?`, async () => {
        try {
          setLoading(true);
          await api.user.admin.status(id, {
            isDisabled: !disabled,
          });
          ui.notify.success(`Success`);
          await handlers.refresh();
        } catch (err) {
          ui.notify.error(err);
        } finally {
          setLoading(false);
        }
      });
    },
  };

  const extra = (
    <Button style={{ width: 80 }} type="primary" href="/admin/users/management/create">
      New
    </Button>
  );

  useEffect(() => {
    handlers.refresh().finally();
  }, [filters, pagination.current, pagination.pageSize]);

  const [filterForm] = useForm();

  return (
    <PortalContent title="User Management" extra={extra} loading={loading}>
      <Row>
        <Col span={24}>
          <Form
            form={filterForm}
            layout="vertical"
            onFinish={(values) => {
              setPagination({ ...pagination, current: 1 });
              setFilters(values);
            }}
          >
            <Row gutter={[8, 2]}>
              <Col xl={12} lg={12} md={10} sm={12} xs={24}>
                <Form.Item name="search">
                  <Input placeholder="Search by Name/ Email/ Username" maxLength={120} />
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
            // footer={(data) => (
            //   <span>
            //     Showing {data.length} record(s) of total {pagination.total}
            //   </span>
            // )}
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
