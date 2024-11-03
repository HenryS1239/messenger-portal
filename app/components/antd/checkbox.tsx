import {Checkbox, Divider} from "antd";
import React, {useEffect, useState} from "react";
import {CheckboxGroupProps} from "antd/lib/checkbox";

export const CheckboxGroupWithAll = (props: CheckboxGroupProps) => {

    const [indeterminate, setIndeterminate] = useState(props.value && props.value?.length > 0);
    const [checkedAll, setCheckedAll] = useState(props.value?.length === props.options?.length);

    useEffect(() => {
        if (props.value) {
            setCheckedAll(props.value?.length === props.options?.length);
            setIndeterminate(props.value?.length > 0);
        } else {
            setCheckedAll(false);
            setIndeterminate(false);
        }
    }, [props.value])

    return <>
        <Checkbox.Group {...props} />

        <Divider type="vertical"/>
        <Checkbox indeterminate={!checkedAll && indeterminate} checked={checkedAll} onChange={(e) => {
            if (props.onChange) {
                props.onChange(e.target.checked ? (props.options as any[]).map(o => o.value) : []);
                setCheckedAll(e.target.checked);
            }
        }}>
            All
        </Checkbox>
    </>
}
