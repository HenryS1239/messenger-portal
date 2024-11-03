import { Base } from "@/app/services/api/base";
import { IPagination } from "../../models/ui.models";

export class Setting extends Base {
  general(): Promise<any> {
    return this.http.get<any>(`/api/core/settings/general`);
  }

  options(): Promise<any> {
    return this.http.get<any>(`/api/core/settings/options`);
  }

  logs(): Promise<any> {
    return this.http.get<any>(`/api/core/settings/options`);
  }

  get(keys: string): Promise<any> {
    return this.http.get<any>(
      `/api/core/settings${this.toQueryString({ keys })}`
    );
  }

  update(body: { key: string; value: any }): Promise<any> {
    return this.http.put<any>(`/api/core/settings`, body);
  }

  getMultiple(keys: any[]): Promise<any> {
    return this.http.get<any>(`/api/core/settings/${keys.join(",")}`);
  }
}
