import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownProps,
  Menu,
  Select,
  SelectProps,
} from "antd";
import { api } from "@/app/services";

export const SelectComponent: React.FC<any> = (props) => {
  const {
    value,
    showSearch = true,
    optionFilterProp = "label",
    ...selectProps
  } = props;

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>();
  const [options, setOptions] = useState<any[]>();

  useEffect(() => {
    setError(undefined);
    // api.user.rider
    // .list({ current: 1, pageSize: 1000 }, { types, stations })
    // .then((rs) => {
    // setOptions(
    //   rs.items.map((r) => {
    //     return { value: r._id, label: r };
    //   })
    // );
    // setReady(true);
    // })
    // .catch((err) => {
    //     setError(err.message);
    //     setReady(true);
    // });
  }, [value]);

  return (
    <Select
      {...selectProps}
      optionFilterProp={optionFilterProp}
      showSearch={showSearch}
      options={options}
      loading={!ready}
    />
  );
};
