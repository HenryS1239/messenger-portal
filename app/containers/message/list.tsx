import { PortalContent } from "@/app/components/contents";
import { Button, Col, Form, Input, Row, Space, Table, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { IPagination } from "@/app/models/ui.models";
import { api, ui } from "@/app/services";
import { CheckCircleFilled, DeleteOutlined, EditOutlined, EyeOutlined, InfoCircleFilled } from "@ant-design/icons";
import { useForm } from "antd/lib/form/Form";
import { USER_TYPES } from "../../constants";
import { SearchButtonGroup } from "../../components/form";
import { ListingButton } from "../../components/listing/button";
import { useAppAuthStore } from "@/root/stores";
import formatter from "../../formatter";
import { useInit } from "../../hooks";

export const List = () => {
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any>([]);
  const [pagination, setPagination] = useState<IPagination>({
    current: 1,
    pageSize: 50,
    total: 0,
  });
  const [filters, setFilters] = useState<any>();
  const [filterForm] = useForm();
  const { user } = useAppAuthStore();

  const isAdmin = user?.role?.type === USER_TYPES.ADMIN;

  const handlers = {
    refresh: async () => {
      setLoading(true);
      try {
        const filter = isAdmin ? {} : { customer: user._id };
        const rs = isAdmin ? await api.message.admin.list(pagination, filter) : await api.message.customer.list(pagination, filter);
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
    delete: (id: string) => {
      ui.confirm(`Are you sure you want to delete this message? This will remove the message for receipients and cannot be undone.`, async () => {
        try {
          setLoading(true);
          await api.message.delete(id);
          ui.notify.success(`Deleted Message`);
          await handlers.refresh();
        } catch (err) {
          ui.notify.error(err);
        } finally {
          setLoading(false);
        }
      });
    },
  };

  const adminColumns = [
    {
      dataIndex: "receipient",
      title: "Receiver Name",
      render: (r: any) => {
        const names = r.map((receipient: any) => receipient.name);
        return names.join(",");
      },
    },
    {
      dataIndex: "createdAt",
      title: "Broadcasted Time",
      render: (r: string) => formatter.toDisplayDatetime(r),
    },
    {
      dataIndex: "subject",
      title: "Subject",
    },
    {
      dataIndex: "content",
      title: "Message",
    },
    {
      title: "Actions",
      align: "right",
      width: 100,
      render: (r: any) => {
        return (
          <Space size={2}>
            <ListingButton href={`./message/view/${r._id}`} icon={<EyeOutlined />} tooltipMsg="View" />
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

  const customerColumns = [
    {
      dataIndex: "readBy",
      title: "Read Status",
      render: (r: any) => {
        const readByInfo = r.filter((item: any) => item.userRefId === user?._id);
        if (r.length === 0 || readByInfo.length === 0) {
          return (
            <Tooltip placement="top" title={"Unread"}>
              <InfoCircleFilled style={{ fontSize: "3vh", color: "#ffbd00" }} />{" "}
            </Tooltip>
          );
        } else {
          const readAt = formatter.toDisplayDatetime(readByInfo[0].readAt);
          return (
            <Tooltip placement="top" title={`Read at ${readAt}`}>
              <CheckCircleFilled style={{ fontSize: "3vh", color: "#00e537" }} />
            </Tooltip>
          );
        }
      },
    },
    {
      dataIndex: "createdAt",
      title: "Received At",
      render: (r: string) => formatter.toDisplayDatetime(r),
    },
    {
      dataIndex: "subject",
      title: "Subject",
    },
    {
      dataIndex: "content",
      title: "Message",
    },
    {
      title: "Actions",
      align: "right",
      width: 100,
      render: (r: any) => {
        return (
          <Space size={2}>
            <ListingButton href={`./message/view/${r._id}`} icon={<EyeOutlined />} tooltipMsg="View" />
          </Space>
        );
      },
    },
  ] as any[];

  const extra = isAdmin ? (
    <Button style={{ width: 80 }} type="primary" href="/admin/message/create">
      New
    </Button>
  ) : (
    <></>
  );

  useInit(() => {
    handlers.refresh();
  });

  useEffect(() => {
    handlers.refresh().finally();
  }, [filters, pagination.current, pagination.pageSize]);

  return (
    <PortalContent title="Message Management" extra={extra} loading={loading}>
      <Row>
        <Col span={24}>
          {isAdmin && (
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
          )}
        </Col>

        <Col span={24}>
          <Table
            rowKey="_id"
            columns={isAdmin ? adminColumns : customerColumns}
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
