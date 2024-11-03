import { Empty } from "antd";
import { useRouter } from "next/router";
import type { NextPage } from "next";
import { Users } from "@/app/containers";
import { PortalLayout } from "@/app/components/layouts";
import { useAppAuthStore } from "@/root/stores";
import { USER_TYPES } from "@/root/app/constants";

export default function (props: NextPage) {
  const router = useRouter();
  const user = useAppAuthStore()?.user;

  if (user && user.type === USER_TYPES.ADMIN) {
    const { id } = router.query as any;

    return <PortalLayout>{id && <Users.Form id={id} />}</PortalLayout>;
  } else {
    return (
      <PortalLayout>
        <Empty />;
      </PortalLayout>
    );
  }
}
