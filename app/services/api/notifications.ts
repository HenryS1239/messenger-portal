import { Base } from "@/app/services/api/base";
import { IPagination } from "@/app/models/ui.models";
import { IListResponse } from "@/app/models/api.models";

export class Notifications extends Base {
  list(pagination: IPagination, filter?: { username?: string; email?: string; types?: string[] }): Promise<IListResponse<any>> {
    return this.http.get(
      `/api/core/notifications${this.toQueryString({
        ...this.toPaginationQuery(pagination),
        ...filter,
      })}`
    );
  }

  read(dto: any) {
    return this.http.post(`/api/core/notifications/read`, dto);
  }

  browserAlert() {
    return this.http.get(`/api/core/notifications/browser/alert`);
  }
}
