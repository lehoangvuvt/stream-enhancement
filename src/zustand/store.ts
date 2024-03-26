import { create } from 'zustand'

export type UserInfo = {
    username: string;
    name: string;
    id: number;
}

export type State = {
    userInfo: UserInfo | null;
    setUserInfo: (userInfo: UserInfo | null) => void;
}

export const useAppStore = create<State>((set) => ({
    userInfo: null,
    setUserInfo: (userInfo: UserInfo | null) => set((state: State) => ({
        userInfo: userInfo
    }))
}))

