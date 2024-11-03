import type { NextPage } from "next";
import { Roles } from "@/app/containers";
import { PortalLayout } from "@/app/components/layouts";

export default function (props: NextPage) {
    return (
        <PortalLayout>
            <Roles.Form />
        </PortalLayout>
    );
}
