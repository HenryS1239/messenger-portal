import type { NextPage } from "next";
import { Empty } from "antd";

import { Users } from "@/app/containers";
import { PortalLayout } from "@/app/components/layouts";
import { useAppAuthStore } from "@/root/stores";
import { USER_TYPES } from "@/root/app/constants";

export default function (props: NextPage) {
  const user = useAppAuthStore()?.user;

  if (user && user.type === USER_TYPES.ADMIN) {
    //whitelist for what user type can see
    return (
      <PortalLayout>
        <Users.List />
      </PortalLayout>
    );
  } else {
    return (
      <PortalLayout>
        <Empty />;
      </PortalLayout>
    );
  }
}
