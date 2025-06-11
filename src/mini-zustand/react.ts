import type { StoreApi, StateCreator } from './vanilla';
import { createStore } from './vanilla';
import useSyncExternalStoreExports from 'use-sync-external-store/shim/with-selector';
const { useSyncExternalStoreWithSelector } = useSyncExternalStoreExports;
type ExtractState<S> = S extends { getState: () => infer T } ? T : never;
type ReadonlyStoreApi<T> = Pick<StoreApi<T>, 'getState' | 'subscribe'>;
type WithReact<S extends ReadonlyStoreApi<unknown>> = S & { getServerState?: () => ExtractState<S> }
export type UseBoundStore<S extends WithReact<ReadonlyStoreApi<unknown>>> = {
    (): ExtractState<S>
    <U>(
        selector: (state: ExtractState<S>) => U,
        equals?: (a: U, b: U) => boolean
    ): U
} & S;
type Create = {
    <T>(createState: StateCreator<T>): UseBoundStore<StoreApi<T>>
    <T>(): (createState: StateCreator<T>) => UseBoundStore<StoreApi<T>>
}
export const create = function <T>(createState: StateCreator<T>) {
    return createState ? createImpl(createState) : createImpl;
} as Create;
const createImpl = <T>(createState: StateCreator<T>) => {
    const api = typeof createState === 'function' ? createStore(createState) : createStore;
    const useBoundStore = (selector?: any, equalityFn?: any) => useStore(api, selector, equalityFn);
    return useBoundStore;
}
export function useStore<TState, StateSlice>(
    api: WithReact<StoreApi<TState>>,
    selector: (state: TState) => StateSlice = api.getState as any,
    equalityFn?: (a: StateSlice, b: StateSlice) => boolean
) {
    const slice = useSyncExternalStoreWithSelector(
        api.subscribe,
        api.getState,
        api.getServerState || api.getState,
        selector,
        equalityFn
    )
    return slice
}