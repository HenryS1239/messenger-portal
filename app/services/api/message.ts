import { Base } from "@/app/services/api/base";
import { IPagination } from "@/app/models/ui.models";
import { IListResponse } from "@/app/models/api.models";

export class Message extends Base {
  list = (pagination: IPagination, filter = {}, sorter?: any) => {
    return this.doGet<any, IListResponse<any>>(`/api/core/message`, {
      ...this.toPaginationQuery(pagination),
      ...this.toSorter(sorter),
      ...filter,
    });
  };

  get = (id: string) => {
    return this.http.get(`/api/core/message/${id}`);
  };

  create = (dto: any) => {
    return this.http.post(`/api/core/message`, dto);
  };

  delete = (id: string) => {
    return this.http.delete(`/api/core/message/${id}`);
  };
}
