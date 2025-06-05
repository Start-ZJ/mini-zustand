/* 本质上就是一个函数的定义。
等价于
type SetStateInternal<T> = (partial: T | Partial<T> | { _(state: T): T | Partial<T> | void }['_'],replace: boolean): void
*/

type SetStateInternal<T> = {
  _(
    partial: T | Partial<T> | {_(state: T): T | Partial<T> | void}["_"],
    replace?: boolean | undefined
  ): void;
}["_"];
export interface StoreApi<T> {
    getState: () => T
    setState: SetStateInternal<T>
    /* (listener: (state: T, perState: T) => void) => () => void
    等价于(listener: (state: T, perState: T) => void) : () => void */
    subscribe: (listener: (state: T, perState: T) => void) => () => void
    destroy: () => void
}
export type StateCreator<T> = (
    setState: StoreApi<T>['setState'],
    getState: StoreApi<T>['getState'],
    store: StoreApi<T>
) => T

type CreateStore = {
    <T>(createState: StateCreator<T>): StoreApi<T>;
    <T>(): (createState: StateCreator<T>) => StoreApi<T>;
}
export const CreateStore = ((createState) => createState ? createStoreImpl(createState) : createStoreImpl) as CreateStore;
type CreateStoreImpl = <T>(createImpl: StateCreator<T>) => StoreApi<T>;
export const createStoreImpl: CreateStoreImpl = (createState) => {
    type TState = ReturnType<typeof createState>;
    type Listener = (state: TState, perState: TState) => void;
    let state: TState;
    let listeners: Set<Listener> = new Set();
    const getState: StoreApi<TState>['getState'] = () => state;
    const setState: StoreApi<TState>["setState"] = (partial, replace) => {
    const nextState =
      typeof partial === "function"
        ? (partial as (state: TState) => TState)(state)
        : partial;
    // 状态值改变，执行监听函数
    if (!Object.is(nextState, state)) {
      const prevState = state;
      state =
        replace ?? typeof nextState !== "object"
          ? (nextState as TState)
          : Object.assign({}, state, nextState);

      listeners.forEach((listener) => listener(state, prevState));
    }
  };
    const subscribe: StoreApi<TState>['subscribe'] = (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }
    const destroy: StoreApi<TState>['destroy'] = () => {
        listeners.clear()
    }
    const api = {
        getState,
        setState,
        subscribe,
        destroy
    }
    state = createState(setState, getState, api);
    return api;
}