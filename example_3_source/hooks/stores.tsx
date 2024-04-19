import { create } from 'zustand'
import { useDropdownMenuStoreArray } from '../components/atoms/DropdownMenu'
import { useLayoutStore } from '../components/layout/Layout'
import { useMainStore } from '../components/layout/Main'
import { useSidenavStore } from '../components/layout/Sidenav'
import { GlobalState, KeyboardState, SearchState, TopnavState } from '../constants/types'

//
//
//

export { useGlobalStore }
function useGlobalStore(): GlobalState {
    return {
        dropdownMenuStateArray: useDropdownMenuStoreArray.map((store) => store()),
        keyboardState: useKeyboardStore(),
        layoutState: useLayoutStore(),
        mainState: useMainStore(),
        searchState: useSearchStore(),
        sidenavState: useSidenavStore(),
        topnavState: useTopnavStore(),
    }
}

useGlobalStore.getState = function (): GlobalState {
    return {
        dropdownMenuStateArray: useDropdownMenuStoreArray.map((store) => store.getState()),
        keyboardState: useKeyboardStore.getState(),
        layoutState: useLayoutStore.getState(),
        mainState: useMainStore.getState(),
        searchState: useSearchStore.getState(),
        sidenavState: useSidenavStore.getState(),
        topnavState: useTopnavStore.getState(),
    }
}

export const useKeyboardStore = create<KeyboardState>((set) => ({
    event: null,
    setEvent: (event) => set(() => ({ event }))
}))

export const useSearchStore = create<SearchState>((set) => ({
    inputElement: null,
    setInputElement: (element) => set(() => ({ inputElement: element })),
    isOpen: false,
    setIsOpen: (isOpen) => set(() => ({ isOpen })),
    resultsElement: null,
    setResultsElement: (element) => set(() => ({ resultsElement: element })),
}))

export const useTopnavStore = create<TopnavState>(set => ({
    element: null,
    setElement: (element) => set(() => ({ element })),
    homeLinkElement: null,
    setHomeLinkElement: (homeLinkElement) => set(() => ({ homeLinkElement })),

    menuButtonElement: null,
    setMenuButtonElement: (element) => set(() => ({ menuButtonElement: element }))
}))

