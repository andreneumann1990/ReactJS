import { create } from 'zustand'
import { DropdownMenuState, DropdownMenuStore, GlobalState, KeyboardState, LayoutState, LayoutStore, MainState, MainStore, SearchState, SearchStore, SidenavState, SidenavStore, TopnavState, TopnavStore } from '../constants/types'
import { isDebugEnabled, defaultIndexGroup } from '../constants/general_constants'
import { useEffect } from 'react'

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

export const useLayoutStore: LayoutStore = create<LayoutState>((set, get) => ({
    _previousIndexGroup: defaultIndexGroup,
    indexGroup: defaultIndexGroup,
    setIndexGroup: (indexGroup) => set((state) => {
        if (isDebugEnabled) console.log(`Layout: indexGroup ${indexGroup}`)
        state._previousIndexGroup = state.indexGroup
        return { indexGroup }
    }),
    resetIndexGroup: () => set(() => {
        if (isDebugEnabled) console.log(`Layout: indexGroup ${defaultIndexGroup}`)
        return { indexGroup: defaultIndexGroup }
    }),
    restorePreviousIndexGroup: () => set((state) => {
        if (isDebugEnabled) console.log(`Layout: indexGroup ${state._previousIndexGroup}`)
        return { indexGroup: state._previousIndexGroup }
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

    resultsDataArray: {},
    setResultsDataArray: (resultsDataArray) => set(() => ({ resultsDataArray })),
    resultsElement: null,
    setResultsElement: (element) => set(() => ({ resultsElement: element })),

    resultsSelectedIndex: [0, 0],
    setResultsSelectedIndex: (resultsSelectedIndex) => set(() => ({ resultsSelectedIndex })),
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

