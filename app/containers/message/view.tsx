import { PortalContent } from "@/app/components/contents";
import { Descriptions, Typography } from "antd";
import React, { useState } from "react";
import { api, ui } from "@/app/services";
import { useRouter } from "next/router";
import { useInit } from "../../hooks";
import formatter from "../../formatter";
import { useAppAuthStore } from "@/root/stores";
import { USER_TYPES } from "../../constants";

const ReadByUserDetails: React.FC<any> = (props) => {
  const { user } = props;
  return (
    <>
      <Typography.Text>
        {user.name} ({formatter.toDisplayDatetime(user.readAt)})
      </Typography.Text>
      <br />
    </>
  );
};

export const MessageViewDetails: React.FC<{ id?: string }> = (props) => {
  const { id } = props;

  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<any>();

  const { user } = useAppAuthStore();

  const isAdmin = user?.role?.type === USER_TYPES.ADMIN;

  const handlers = {
    refresh: async () => {
      setLoading(true);
      try {
        if (id) {
          const rs = isAdmin ? await api.message.admin.get(id) : await api.message.customer.get(id);
          setFormValues(rs);
        }
      } catch (err) {
        ui.notify.error(err);
      } finally {
        setLoading(false);
      }
    },
  };

  const adminDescriptionItems = [
    {
      key: "subject",
      label: "Subject",
      span: 3,
      children: formValues?.subject,
    },
    {
      key: "createdAt",
      label: "Received At",
      span: 3,
      children: formatter.toDisplayDatetime(formValues?.createdAt),
    },
    {
      key: "readBy",
      label: "Read By",
      span: 3,
      children: formValues?.readBy.map((user: any) => <ReadByUserDetails user={user} />),
    },
    {
      key: "content",
      label: "Content",
      span: 3,
      children: <p>{formValues?.content}</p>,
    },
  ];

  const customerDescriptionItems = [
    {
      key: "subject",
      label: "Subject",
      span: 3,
      children: <>{formValues?.subject}</>,
    },
    {
      key: "createdAt",
      label: "Received At",
      span: 3,
      children: <>{formatter.toDisplayDatetime(formValues?.createdAt)}</>,
    },
    {
      key: "readAt",
      label: "Read At",
      span: 3,
      children: formatter.toDisplayDatetime(formValues?.readBy.find((readUser: any) => readUser.userRefId == user._id)?.readAt) ?? "-",
    },
    {
      key: "content",
      label: "Content",
      span: 3,
      children: <p>{formValues?.content}</p>,
    },
  ];

  useInit(() => {
    handlers.refresh();
  });

  return (
    <PortalContent back={"/portal/message"} title={"Message Details"} loading={loading}>
      <Descriptions bordered column={1} items={isAdmin ? adminDescriptionItems : customerDescriptionItems} />
    </PortalContent>
  );
};
