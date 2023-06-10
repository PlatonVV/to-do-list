import {ThunkDispatch} from 'redux-thunk';
import {AnyAction} from 'redux';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {AppRootStateType} from '../state/store';

type ThunkDispatchType = ThunkDispatch<AppRootStateType, any, AnyAction>
export const useAppDispatch = ()=> useDispatch<ThunkDispatchType>()

export const useAppSelector: TypedUseSelectorHook<AppRootStateType> = useSelector
