
import type { NextPage } from 'next'
import { Auth } from '@/app/containers';
import { BlankLayout } from '@/app/components/layouts';

export default function (props: NextPage) {
    return <BlankLayout>
        <Auth.Login/>
    </BlankLayout>
}