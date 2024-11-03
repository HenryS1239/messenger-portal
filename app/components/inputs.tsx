import React from "react";
import { Checkbox, Space, Typography } from "antd";

type TreeCheckboxProps = {
    value?: string[],
    onChange?: (values: string[]) => void,
    disabled?: boolean,
    groups: { label: string, options?: { value: string, label: string }[] }[],
    style?: any
};
export const TreeGroupCheckbox: React.FC<TreeCheckboxProps> = (props) => {
    const { value, onChange, disabled, groups, style } = props;

    const onValuesChanged = (values: any[]) => {
        if (onChange) {
            onChange(values);
        }
    };

    return <Space direction="vertical" size={4} style={style}>
        <Checkbox.Group onChange={onValuesChanged} value={value} disabled={disabled}>
            {groups?.map((group, i) => {
                return <React.Fragment key={i}>
                    <Typography.Text strong>{group.label}</Typography.Text>
                    <ul>
                        {group.options?.map((option, j) => {
                            return <li key={j} style={{ listStyleType: "none" }}>
                                <Checkbox key={option.value} value={option.value}>{option.label}</Checkbox>
                            </li>;
                        })}
                    </ul>
                </React.Fragment>;
            })}
        </Checkbox.Group>
    </Space>;
};
