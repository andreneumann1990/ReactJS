import { create } from 'zustand'
import { DropdownMenuState, DropdownMenuStore, GlobalState, LayoutState, LayoutStore, MainState, MainStore, SearchState, SearchStore, SidenavState, SidenavStore, TopnavState, TopnavStore } from '../constants/types'
import { defaultIndexGroup, isDebugEnabled } from '../constants/parameters'

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
        layoutState: useLayoutStore.getState(),
        mainState: useMainStore.getState(),
        searchState: useSearchStore.getState(),
        sidenavState: useSidenavStore.getState(),
        topnavState: useTopnavStore.getState(),
    }
}

export const useLayoutStore: LayoutStore = create<LayoutState>((set) => ({
    indexGroup: defaultIndexGroup,
    setIndexGroup: (indexGroup) => set(() => {
        if (isDebugEnabled) {
            // console.log(`Layout: indexGroup ${indexGroup}`)
        }
        return { indexGroup }
    }),

    isFirstKeyDown: true,
    setIsFirstKeyDown: (isFirstKeyDown) => set(() => ({ isFirstKeyDown })),
    keyDownCooldown: 0,
    setKeyDownCooldown: (keyDownCooldown) => set(() => ({ keyDownCooldown })),

    previousFocusedElement: null,
    setPreviousFocusedElement: (previousFocusedElement) => set(() => ({ previousFocusedElement })),
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

