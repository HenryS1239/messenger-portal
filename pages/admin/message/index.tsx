import type { NextPage } from "next";
import { PortalLayout } from "@/app/components/layouts";
import { Message } from "@/app/containers";

export default function (props: NextPage) {
  return (
    <PortalLayout>
      <Message.List />
    </PortalLayout>
  );
}
