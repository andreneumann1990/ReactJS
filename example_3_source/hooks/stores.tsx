import { create } from 'zustand'
import { DropdownMenuState, DropdownMenuStore, GlobalState, KeyboardState, LayoutState, LayoutStore, MainState, MainStore, SearchState, SearchStore, SidenavState, SidenavStore, TopnavState, TopnavStore } from '../constants/types'
import { isDebugEnabled, tabIndexGroupDefault } from '../constants/general_constants'

//
//
//

export const useDropdownMenuStoreArray: DropdownMenuStore[] = [...Array(2)].map(() => (create<DropdownMenuState>((set) => ({
    buttonElement: null,
    setButtonElement: (buttonElement) => set(() => ({ buttonElement })),
    contentElement: null,
    setContentElement: (contentElement) => set(() => ({ contentElement })),

    element: null,
    setElement: (element) => set(() => ({ element })),
    iconElement: null,
    setIconElement: (iconElement) => set(() => ({ iconElement })),

    isOpen: false,
    setIsOpen: (isOpen) => set(() => ({ isOpen })),
}))))

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

export const useLayoutStore: LayoutStore = create<LayoutState>(set => ({
    activeTabIndexGroup: 0,
    setActiveTabIndexGroup: (tabIndex) => set(() => {
        if (isDebugEnabled) console.log(`Layout: tabIndex ${tabIndex}`)
        return { activeTabIndexGroup: tabIndex }
    }),
    resetActiveTabIndexGroup: () => set(() => {
        if (isDebugEnabled) console.log(`Layout: tabIndex ${tabIndexGroupDefault}`)
        return { activeTabIndexGroup: tabIndexGroupDefault }
    })
}))

export const useMainStore: MainStore = create<MainState>((set) => ({
    element: null,
    setElement: (element) => set(() => ({ element })),
    isActive: true,
    setIsActive: (isActive) => set(() => ({ isActive })),
}))

export const useSearchStore: SearchStore = create<SearchState>((set) => ({
    inputElement: null,
    setInputElement: (element) => set(() => ({ inputElement: element })),
    isOpen: false,
    setIsOpen: (isOpen) => set(() => ({ isOpen })),
    resultsElement: null,
    setResultsElement: (element) => set(() => ({ resultsElement: element })),
}))

export const useSidenavStore: SidenavStore = create<SidenavState>((set) => ({
    element: null,
    setElement: (element) => set(() => ({ element })),
    isOpen: false,
    setIsOpen: (isOpen) => set(() => ({ isOpen })),

    lastActiveDropdownElement: null,
    setLastActiveDropdownElement: (element) => set(() => ({ lastActiveDropdownElement: element })),
}))

export const useTopnavStore: TopnavStore = create<TopnavState>(set => ({
    element: null,
    setElement: (element) => set(() => ({ element })),
    homeLinkElement: null,
    setHomeLinkElement: (homeLinkElement) => set(() => ({ homeLinkElement })),

    menuButtonElement: null,
    setMenuButtonElement: (element) => set(() => ({ menuButtonElement: element }))
}))

