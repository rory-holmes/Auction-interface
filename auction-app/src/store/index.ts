// @ts-ignore
import create from 'zustand';

interface UserState {
    user: userIdentity;
    setUser: (user: userIdentity) => void;
    imagePath: string;
    setImagePath: string;
    // editUser: (user: User, newUsername: string) => void;
    removeUser: (user: userIdentity) => void;
}

const getLocalStorage = (key:string): userIdentity => JSON.parse(window.localStorage.getItem(key) as string)
const setLocalStorage = (key: string, value: userIdentity) => window.localStorage.setItem(key, JSON.stringify(value))

const getLocalImageStorage = (key:string): string => JSON.parse(window.localStorage.getItem(key) as string)
const setLocalImageStorage = (key: string, value: string) => window.localStorage.setItem(key, (value))

// @ts-ignore
const useStore = create<UserState>((set) => ({
    user: getLocalStorage('user'),
    imagePath: getLocalImageStorage('imagePath'),
    setUser: (user: userIdentity) => set(() => {
        setLocalStorage('user', user)
        return {user: user}
    }),

    removeUser: (user: userIdentity) => set(() => {
        setLocalStorage('user', {userId: -1, token: ""})
        return {user: user}
    }),
    // setImagePath: (path : string) => set(() => {
    //     setLocalImageStorage('imagePath', path)
    //     return {}
    // })
}))
export const useUserStore = useStore;