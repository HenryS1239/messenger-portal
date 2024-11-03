import React from "react";
import { REDUX_ACTIONS, useAppAuthStore } from "@/stores/index";
import { api, ui } from "@/app/services";
import { useInit } from "@/app/hooks";
import { Status } from "@/app/screens";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";

export const AuthGuard: React.FC<any> = ({ children }) => {
  const user = useAppAuthStore()?.user;
  const dispatch = useDispatch();
  const router = useRouter();

  useInit(() => {
    if (user) {
      api.auth
        .profile()
        .then((user) => {
          dispatch({ type: REDUX_ACTIONS.SET_USER, payload: { user } });
        })
        .catch((err) => {
          if (err?.statusCode === 401) {
            if (api.auth.token.is_exists()) {
              api.auth.token.clear();
              ui.notify.info("Session Expired");
            }
            router.push("/auth/login");
          }
        });
    } else {
      api.auth.token.clear();
      ui.notify.info("Login Required");
      router.push("/auth/login");
    }
  });

  return user ? children : <Status.Unauthorized message="Unauthorized" />;
};
