import { useDispatch } from "react-redux";
import { api } from "@/app/services";
import { REDUX_ACTIONS } from "@/stores/index";
import { useRouter } from "next/router";

export function useFetchSettings() {
  const dispatch = useDispatch();
  return () => {
    // api.setting.general().then(rs => dispatch({
    //     type: REDUX_ACTIONS.SET_GENERAL_SETTINGS,
    //     payload: rs
    // })
    // ).catch(err => {
    //     console.warn(`failed fetch settings: ${err.message}`);
    // });
  };
}

export function useLogout() {
  const dispatch = useDispatch();
  return () => {
    dispatch({
      type: REDUX_ACTIONS.SET_USER,
      payload: { user: null },
    });
  };
}

export function useFetchProfile() {
  const dispatch = useDispatch();
  return () => {
    Promise.all([api.auth.profile(), api.auth.photo()])
      .then(([user]) => {
        dispatch({
          type: REDUX_ACTIONS.SET_USER,
          payload: { user },
        });
      })
      .catch((err) => {
        console.warn(`failed fetch options: ${err.message}`);
      });
  };
}
