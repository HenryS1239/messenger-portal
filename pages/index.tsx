import { Col, Result, Row } from 'antd'
import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {

    return <Row align='middle' justify='center' style={{ height: '100vh', width: '100%' }}>
        <Col span={12}>
            <Image src="/resources/img/logo-long.png" width={420} height={220} />
        </Col>
    </Row>
}

export default Home
