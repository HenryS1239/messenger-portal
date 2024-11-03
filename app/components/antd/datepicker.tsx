import { SelectProps } from "antd/es/select";
import React, { useEffect, useState } from "react";
import { Checkbox, DatePicker, Empty, Input, Select, Spin } from "antd";
import debounce from "lodash/debounce";
import { WarningOutlined } from "@ant-design/icons";

export const OptionDateRangePicker: React.FC<any> = ({ value, onChange }) => {
  const [dateDisable, setDateDisable] = useState(false);
  const [checked, setChecked] = useState(false);
  const RangePicker: any = DatePicker.RangePicker;

  useEffect(() => {
    if (onChange) {
      if (checked) {
        onChange(value);
      } else {
        onChange(null);
      }
    }
    if (!value) {
      setChecked(false);
    }
  }, [value]);

  return (
    <>
      <Input.Group>
        <RangePicker disabled={dateDisable} style={{ width: "80%" }} />
        <Checkbox
          style={{ marginLeft: 8 }}
          checked={checked}
          onClick={() => {
            setChecked(!checked);
            setDateDisable(checked);
          }}
        />
      </Input.Group>
    </>
  );
};
