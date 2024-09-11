import { useDispatch, useSelector, useStore } from 'react-redux'
import type { AppDispatch, AppStore, RootState } from './store'

// Use a type assertion for backwards compatibility
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: <TSelected = unknown>(
  selector: (state: RootState) => TSelected,
  equalityFn?: (left: TSelected, right: TSelected) => boolean
) => TSelected = useSelector

export const useAppStore: () => AppStore = useStore