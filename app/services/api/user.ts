import { Base } from "@/app/services/api/base";
import { IPagination } from "@/app/models/ui.models";
import { IListResponse } from "@/app/models/api.models";

export class User extends Base {
  admin = {
    list: (pagination: IPagination, filter: any = {}) => {
      return this.doGet<any, IListResponse<any>>(`/api/core/user`, {
        ...this.toPaginationQuery(pagination),
        ...filter,
      });
    },
    get: (id: string) => {
      return this.http.get<any, any>(`/api/core/user/${id}`);
    },
    create: (dto: any) => {
      return this.http.post<any, any>(`/api/core/user`, dto);
    },
    update: (id: string, dto: any) => {
      return this.http.put<any, any>(`/api/core/user/${id}`, dto);
    },
    delete: (id: string) => {
      return this.http.delete<any, any>(`/api/core/user/${id}`);
    },
    status: (id: string, dto: any) => {
      return this.http.put<any, any>(`/api/core/user/status/${id}`, dto);
    },
  };
  role = {
    list: (pagination: IPagination, filter: any = {}, sorter?: any) => {
      return this.doGet<any, IListResponse<any>>(`/api/core/roles`, {
        ...this.toPaginationQuery(pagination),
        ...this.toSorter(sorter),
        ...filter,
      });
    },

    get: (id: string) => {
      return this.http.get(`/api/core/roles/${id}`);
    },

    create: (dto: any) => {
      return this.http.post(`/api/core/roles`, dto);
    },

    update: (id: string, dto: any) => {
      return this.http.put(`/api/core/roles/${id}`, dto);
    },

    delete: (id: string) => {
      return this.http.delete(`/api/core/roles/${id}`);
    },
  };
}
