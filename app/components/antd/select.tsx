import { SelectProps } from "antd/es/select";
import React, { useEffect } from "react";
import { Empty, Select, Spin } from "antd";
import debounce from "lodash/debounce";
import { WarningOutlined } from "@ant-design/icons";

interface LiveQuerySelectProps<ValueType = any> extends Omit<SelectProps<ValueType>, "options" | "children"> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
    valueKey: string;
    labelKey: string;
    hasCreateNewPlaceholder?: boolean;
}

interface BaseValueType {
    key?: string;
    label: React.ReactNode;
    value: string | number;
}

export function LiveQuerySelect<ValueType extends BaseValueType = any>({
    fetchOptions,
    debounceTimeout = 1000,
    valueKey = "id",
    labelKey = "name",
    hasCreateNewPlaceholder = false,
    ...props
}: LiveQuerySelectProps) {
    const [options, setOptions] = React.useState<{ value: string; fetching: boolean; data: any[]; error: string }>({
        value: "",
        fetching: false,
        data: [],
        error: "",
    });

    const [selected, setSelected] = React.useState<any>();

    const fetchRef = React.useRef(0);

    const debounceFetcher = React.useMemo(() => {
        const loadOptions = (value: string) => {
            if (!value) {
                return;
            }
            fetchRef.current += 1;
            const fetchId = fetchRef.current;

            setOptions({
                ...options,
                fetching: true,
                error: "",
                value,
            });
            fetchOptions(value)
                .then((rs) => {
                    if (fetchId !== fetchRef.current) {
                        // for fetch callback order
                        return;
                    }
                    setOptions({
                        ...options,
                        fetching: false,
                        data: [
                            ...rs,
                            ...(hasCreateNewPlaceholder
                                ? [
                                      {
                                          [valueKey]: "_create_new",
                                          [labelKey]: <span style={{ textDecoration: "underline" }}>+ Create New Company</span>,
                                      },
                                  ]
                                : []),
                        ],
                    });
                })
                .catch((err) => {
                    setOptions({
                        ...options,
                        fetching: false,
                        error: err.message,
                    });
                });
        };
        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    useEffect(() => {
        if (props.onChange) {
            const opt = selected ? options.data.find((o) => o[valueKey] === selected) : null;
            props.onChange(selected, opt);
        }
    }, [selected]);

    const notFoundContent = () => {
        if (options.error) {
            return (
                <Empty
                    image={
                        <div style={{ padding: "5%", verticalAlign: "middle" }}>
                            <WarningOutlined style={{ fontSize: 48 }} />
                        </div>
                    }
                    description={options.error}
                />
            );
        } else if (options.fetching) {
            return (
                <Empty
                    image={
                        <div style={{ padding: "5%", verticalAlign: "middle" }}>
                            <Spin size="large" spinning={true} />
                        </div>
                    }
                    description="Searching..."
                />
            );
        } else {
            const msg = options.value ? `No data found for ${options.value}.` : props.placeholder ?? `Insert the keyword`;
            return <Empty description={msg} />;
        }
    };

    return (
        <Select<ValueType>
            showSearch
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={notFoundContent()}
            {...props}
            onSelect={(v: any) => setSelected(v)}
            onChange={(v: any) => setSelected(v)}
            onClear={() => setSelected(null)}
            options={options.data.map((d) => ({ label: d[labelKey], value: d[valueKey] }))}
        />
    );
}
