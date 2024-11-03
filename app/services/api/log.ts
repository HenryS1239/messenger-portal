import { Base } from "@/app/services/api/base";
import { IPagination } from "../../models/ui.models";
import { IListResponse } from "../../models/api.models";

export class Log extends Base {
  list = (pagination: IPagination, filter = {}, sorter?: any) => {
    return this.doGet<any, IListResponse<any>>(`/api/core/logs`, {
      ...this.toPaginationQuery(pagination),
      ...this.toSorter(sorter),
      ...filter,
    });
  };
}
