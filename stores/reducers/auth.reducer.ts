import { REDUX_ACTIONS } from "@/stores/index";
import { IUser } from "@/app/models/api.models";

interface IAuthState {
    user?: IUser,
    photo?: string;
}

interface IAuthAction {
    type: string,
    payload: IAuthState
}


const reducer = (state: any = null, action: IAuthAction): IAuthState => {
    const { type, payload } = action;
    switch (type) {
        case REDUX_ACTIONS.SET_USER:
            let user = null;
            if (payload.user) {
                user = payload.user;
                if (user) {
                    user.permissions = []; // reserve
                }
            }
            return { ...state, user };
        case REDUX_ACTIONS.SET_USER_PHOTO:
            return { ...state, photo: payload.photo };
        default:
    }
    return state;
};
export default reducer;
