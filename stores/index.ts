import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { createStore, combineReducers } from "redux";
import { useSelector } from "react-redux";

import authReducer from "./reducers/auth.reducer";
import settingReducer from "./reducers/setting.reducer";

export const REDUX_ACTIONS = {
	SET_USER: "set_user",
	SET_USER_PHOTO: "set_user_photo",
	SET_GENERAL_SETTINGS: "set_general_settings",
	SET_OPTIONS: "set_options",
};

const reducers = combineReducers({
	auth: persistReducer({ key: "auth", storage }, authReducer),
	setting: persistReducer({ key: "setting", storage }, settingReducer),
});

export const store = createStore(reducers, {});

export const persistor = persistStore(store as any);

export const useAppStore = () => {
	const state = useSelector<any, any>((state) => state);
	const { auth, setting } = state;
	return { auth, setting };
};
export const useAppAuthStore = () =>
	useSelector<any, any>(({ auth }) => {
		// return auth ? { user: auth.user, photo: auth?.photo } : null
		return { user: auth.user, photo: auth?.photo };
	});
export const useAppSettingStore = () =>
	useSelector<any, any>(({ setting }) => setting);
