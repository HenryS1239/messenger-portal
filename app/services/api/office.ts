import { Base } from "@/app/services/api/base";
import { IPagination } from "@/app/models/ui.models";
import { IListResponse } from "@/app/models/api.models";

export class Office extends Base {
  list = (
    pagination: IPagination,
    filter = {  },
    sorter?: any
  ) => {
    return this.doGet<any, IListResponse<any>>(`/api/core/companies`, {
      ...this.toPaginationQuery(pagination),
      ...this.toSorter(sorter),
      ...filter,
    });
  };

  get = (id: string) => {
    return this.http.get(`/api/core/companies/${id}`);
  };

  create = (dto: any) => {
    return this.http.post(`/api/core/companies`, dto);
  };

  update = (id: string, dto: any) => {
    return this.http.put(`/api/core/companies/${id}`, dto);
  };

  delete = (id: string) => {
    return this.http.delete(`/api/core/companies/${id}`);
  };
}
