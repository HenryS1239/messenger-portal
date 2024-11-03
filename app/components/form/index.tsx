import React from "react";
import { Button, Input } from "antd";
import { CloseOutlined, SearchOutlined } from "@ant-design/icons";

type ButtonGroupInterface = {
  showAdvancedFilter?: boolean;
  setShowAdvancedFilter?: any;
  loading: boolean;
  setFilters: any;
  pagination: any;
  setPagination: any;
  form: any;
};
export const SearchButtonGroup = (props: ButtonGroupInterface) => {
  const { showAdvancedFilter, setShowAdvancedFilter, loading, setFilters, pagination, setPagination, form } = props;

  return (
    <Input.Group compact>
      <Button htmlType="submit" icon={<SearchOutlined />} loading={loading} style={{ color: "green" }} />
      <Button
        icon={<CloseOutlined />}
        onClick={() => {
          setFilters({});
          setPagination({ ...pagination, current: 1 });
          form.resetFields();
        }}
        loading={loading}
        style={{ color: "red" }}
      />
      {setShowAdvancedFilter && (
        <Button
          onClick={() => {
            setShowAdvancedFilter(!showAdvancedFilter);
          }}
          style={{ color: "#fe9400" }}
        >
          Advanced Search
        </Button>
      )}
    </Input.Group>
  );
};
