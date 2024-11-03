import React, { useEffect, useMemo, useState } from "react";
import { Button, Dropdown, DropdownProps, Menu, Select, SelectProps } from "antd";
import { api, ui } from "@/app/services";
import { IPagination } from "../models/ui.models";
import { USER_TYPES } from "../constants";

export const SelectUser: React.FC<any> = (props) => {
  const { value, showSearch = true, optionFilterProp = "label", ...selectProps } = props;

  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string>();
  const [options, setOptions] = useState<any[]>();
  const [pagination, setPagination] = useState<IPagination>({
    current: 1,
    pageSize: 50,
    total: 0,
  });

  const handlers = {
    getUsers: async () => {
      try {
        const users = await api.user.admin.list(
          {
            ...pagination,
          },
          {
            types: USER_TYPES.CUSTOMER,
          }
        );
        if (users.total > 0) {
          setPagination((values) => {
            return {
              ...values,
              total: users.total,
            };
          });
          const userOptions = users.items.map((user) => {
            return {
              value: user._id,
              label: user.name,
            };
          });
          setOptions((values) => {
            if (values) {
              return [...values, ...userOptions];
            } else {
              return [...userOptions];
            }
          });
        } else {
          setOptions([]);
        }
      } catch (err) {
        ui.notify.error(err);
      } finally {
        setReady(true);
      }
    },
  };

  useEffect(() => {
    setError(undefined);
  }, [value]);

  useEffect(() => {
    handlers.getUsers();
  }, [pagination?.current]);

  return (
    <Select
      {...selectProps}
      mode="multiple"
      optionFilterProp={optionFilterProp}
      showSearch={showSearch}
      options={options}
      loading={!ready}
      onPopupScroll={async (e: any) => {
        const { target } = e;
        if ((target as any).scrollTop + (target as any).offsetHeight === (target as any).scrollHeight) {
          // if not load all;
          if (options && pagination?.total && options.length < pagination.total) {
            const page = {
              offset: pagination.current ?? 0 * (pagination?.pageSize ?? 50),
              limit: pagination?.pageSize ?? 50,
            };
            setPagination((values) => {
              return {
                ...values,
                page,
              };
            });
          }
        }
      }}
    />
  );
};
