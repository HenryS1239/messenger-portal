// built-in libraries
import { Table } from "antd";

// man-made libraries
import { IPagination } from "@/app/models/ui.models";

// interfaces
interface IListing {
  data: any[];
  columns: any[];
  pagination: IPagination;
  loading: boolean;
  setPagination: any;
  rowKey: string;
  rowSelection?: any;
  showSizeChanger?: boolean;
  scrollableScreenWidth?: number | string | true | undefined;
}

// content (basic listing)
export const List: React.FC<IListing> = (props) => {
  const {
    data,
    columns,
    pagination,
    loading,
    setPagination,
    rowKey,
    rowSelection,
    showSizeChanger = true,
    scrollableScreenWidth = undefined,
  } = props;

  return (
    <Table
      rowKey={rowKey}
      // footer={(data) => (
      //   <span>
      //     Showing {data.length} record(s) of total {pagination.total}
      //   </span>
      // )}
      columns={columns}
      loading={loading}
      dataSource={data}
      pagination={{ ...pagination, showSizeChanger }}
      onChange={(pagination, filters, sorter) => {
        setPagination({
          current: pagination.current,
          pageSize: pagination.pageSize,
        });
      }}
      rowSelection={rowSelection}
      scroll={{ x: scrollableScreenWidth }}
    />
  );
};
