import type { NextPage } from "next";
import { PortalLayout } from "@/app/components/layouts";
import { useRouter } from "next/router";
import { Message } from "@/app/containers";

export default function (props: NextPage) {
  const router = useRouter();

  const { id } = router.query as any;

  return <PortalLayout>{id && <Message.Form id={id} />}</PortalLayout>;
}
