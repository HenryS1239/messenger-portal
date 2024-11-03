import { useFetchSettings } from '@/stores/dispatchers';
import { Spin } from 'antd';
import { useInit } from './hooks';

export const App: React.FC<any> = (props) => {
    const { children } = props;
    const fetch = useFetchSettings();

    useInit(() => {
        fetch();
    });

    return children ? children : <Spin />
}