import { Base } from "@/app/services/api/base";
import { storage } from "@/app/services";

import { STORAGE_KEYS } from "@/app/constants";
import { IUser } from "@/app/models/api.models";
import { IMessage } from "@/app/models/ui.models";

export class Auth extends Base {
  login(credential: { email: string; password: string }) {
    return this.http
      .post<any, { token: string }>("/api/core/auth/login", credential)
      .then((rs) => {
        storage.local.set(STORAGE_KEYS.ACCESS_TOKEN, rs.token);
      });
  }

  profile() {
    return this.http.get<any, { user: IUser }>("/api/core/auth/profile");
  }

  updateProfile(dto: any) {
    return this.http.put<any, any>("/api/core/auth/profile", dto);
  }
  photo() {
    return this.http.get<any, { photo: string }>("/api/core/auth/photo");
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

  get password() {
    return {
      forget: (email: string) =>
        this.http.post<any, any>("/api/core/auth/forget-password", {
          email,
        }),
      reset: (email: string, token: string, password: string) =>
        this.http.post("/api/core/auth/reset-password", {
          email,
          token,
          password,
        }),
      update: (current: string, new_password: string) =>
        this.http.put("/api/core/auth/password", {
          current,
          password: new_password,
        }),
    };
  }
}
