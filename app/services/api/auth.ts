import { Base } from "@/app/services/api/base";
import { storage } from "@/app/services";

import { STORAGE_KEYS } from "@/app/constants";
import { IUser } from "@/app/models/api.models";
import { IMessage } from "@/app/models/ui.models";

export class Auth extends Base {
  login(credential: { email: string; password: string }) {
    return this.http.post<any, { token: string }>("/api/core/auth/login", credential).then((rs) => {
      storage.local.set(STORAGE_KEYS.ACCESS_TOKEN, rs.token);
    });
  }

  registerFCM(body: { fcmToken: string; isNotification: true }) {
    return this.http.post<any, { token: string }>("/api/core/auth/fcm", body);
  }

  profile() {
    return this.http.get<any, { user: IUser }>("/api/core/auth/profile");
  }

  get token() {
    return {
      clear: (): void => {
        storage.local.remove(STORAGE_KEYS.USER);
        storage.local.remove(STORAGE_KEYS.ACCESS_TOKEN);
        storage.local.remove(STORAGE_KEYS.REFRESH_TOKEN);
      },
      is_exists: (): boolean => storage.local.has(STORAGE_KEYS.ACCESS_TOKEN),
    };
  }

  logout(): Promise<IMessage> {
    return new Promise(async (resolve, reject) => {
      await this.http.get<any, any>("/api/core/auth/logout");
      this.token.clear();
      resolve({ message: "success" });
    });
  }
}
