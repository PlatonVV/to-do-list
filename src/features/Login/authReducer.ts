import {LoginType} from './login';
import {Dispatch} from 'redux';
import {
    SetAppErrorActionType,
    setAppStatusAC,
    SetAppStatusActionType,
    setIsInitializedAC,
    SetIsInitializedACActionType
} from '../../app/app-reducer';
import {authAPI, ResultCode} from '../../api/todolists-api';
import {handleServerAppError, handleServerNetworkError} from '../../utils/error-utils';
import {clearTodosDataAC, ClearTodosDataActionType} from '../TodolistsList/todolists-reducer';

const initState = {
    isLoggedIn: false
};


type InitStateType = typeof initState

export const authReducer = (state: InitStateType = initState, action: ActionsType): InitStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.isLoggedIn};
        default:
            return state;
    }
};
export const logOutTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    try {
        const result = await authAPI.logOut();
        if (result.data.resultCode === ResultCode.SUCCESS) {
            dispatch(setIsLoggedInAC(false));
            dispatch(setIsInitializedAC(true));
            dispatch(setAppStatusAC('succeeded'));
            dispatch(clearTodosDataAC());
        } else {
            handleServerAppError(result.data, dispatch);
        }
    } catch (e) {
        const error = (e as { message: string });
        handleServerNetworkError(error, dispatch);
    }
};

export const meTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    try {
        const result = await authAPI.me();
        if (result.data.resultCode === ResultCode.SUCCESS) {
            dispatch(setIsLoggedInAC(true));
            dispatch(setIsInitializedAC(true));
            dispatch(setAppStatusAC('succeeded'));
        } else {
            handleServerAppError(result.data, dispatch);
        }
    } catch (e) {
        const error = (e as { message: string });
        handleServerNetworkError(error, dispatch);
    } finally {
        dispatch(setIsInitializedAC(true));
    }
};

export const loginTC = (data: LoginType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'));
    try {
        const result = await authAPI.login(data);
        if (result.data.resultCode === ResultCode.SUCCESS) {
            dispatch(setIsLoggedInAC(true));
            dispatch(setAppStatusAC('succeeded'));
        } else {
            handleServerAppError(result.data, dispatch);
        }
    } catch (e) {
        const error = (e as { message: string });
        handleServerNetworkError(error, dispatch);
    }

};

type ActionsType = ReturnType<typeof setIsLoggedInAC>
    | SetAppStatusActionType
    | SetAppErrorActionType
    | SetIsInitializedACActionType
    | ClearTodosDataActionType

export const setIsLoggedInAC = (isLoggedIn: boolean) => ({type: 'login/SET-IS-LOGGED-IN', isLoggedIn} as const);
