import { CreateStore, StoreApi, StateCreator } from './vanilla';
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