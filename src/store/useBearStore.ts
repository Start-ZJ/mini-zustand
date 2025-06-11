import { create } from './../mini-zustand'
import { immer } from './../mini-zustand/middleware/immer'
interface BaerState {
    bears: number
    count: number
    increase: (by?: number) => void
    decrease: (by?: number) => void
    reset: () => void
    increaseCount: () => void
}
const useCreateState = create(
    immer<BaerState>((set) => ({
        bears: 0,
        count: 100,
        increase: (by = 1) => set((state) => ({ bears: state.bears + by })),
        decrease: (by = 1) =>
            set((draft) => {
                draft.bears -= by;
            }),
        reset: () => set({ bears: 0 }),
        increaseCount: () => set((state) => ({ count: state.count + 1 })),
    }))
)
export default useCreateState