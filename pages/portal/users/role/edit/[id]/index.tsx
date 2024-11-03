import type { NextPage } from "next";
import { Roles } from "@/app/containers";
import { PortalLayout } from "@/app/components/layouts";
import { useRouter } from "next/router";

export default function (props: NextPage) {
    const router = useRouter();

    const { id } = router.query as any;

    return <PortalLayout>{id && <Roles.Form id={id} />}</PortalLayout>;
}
