import { MutableRefObject } from 'react'
import { StoreApi, UseBoundStore } from 'zustand'

//
//
//

export type { BooleanRef, DropdownMenu, TimeoutRef }
export type { ButtonElement, SetButtonElement }
export type { DivElement, SetDivElement }
export type { Element, SetElement }

export type { DropdownMenuState, DropdownMenuStore }
export type { GlobalState }
export type { LayoutState, LayoutStore }
export type { MainState, MainStore }

export type { SidenavState, SidenavStore }
export type { TopnavState, TopnavStore }

//
//
//

type BooleanRef = MutableRefObject<boolean>
type DropdownMenu = React.JSX.Element
type TimeoutRef = MutableRefObject<NodeJS.Timeout | undefined>

type ButtonElement = HTMLButtonElement | null
type SetButtonElement = (element: ButtonElement) => void

type DivElement = HTMLDivElement | null
type SetDivElement = (element: DivElement) => void

type Element = HTMLElement | null
type SetElement = (element: Element) => void

//
//
//

interface DropdownMenuState {
    buttonElement: ButtonElement,
    setButtonElement: SetButtonElement,
    contentElement: DivElement,
    setContentElement: SetDivElement,

    element: Element,
    setElement: SetElement,
    iconElement: Element,
    setIconElement: SetElement,

    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
}
type DropdownMenuStore = UseBoundStore<StoreApi<DropdownMenuState>>

interface GlobalState {
    dropdownMenuStateArray: DropdownMenuState[],
    layoutState: LayoutState,
    mainState: MainState,
    sidenavState: SidenavState,
    topnavState: TopnavState
}

interface LayoutState {
    activeTabIndexGroup: number,
    setActiveTabIndexGroup: (tabIndex: number) => void,
    resetActiveTabIndexGroup: () => void,
}
type LayoutStore = UseBoundStore<StoreApi<LayoutState>>

interface MainState {
    element: HTMLElement | null,
    setElement: (element: HTMLElement | null) => void,
    isActive: boolean,
    setIsActive: (isActive: boolean) => void,
}
type MainStore = UseBoundStore<StoreApi<MainState>>

interface SidenavState {
    element: HTMLElement | null,
    setElement: (element: HTMLElement | null) => void,

    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,

    lastActiveDropdownElement: HTMLButtonElement | null,
    setLastActiveDropdownElement: (element: HTMLButtonElement | null) => void,
}
type SidenavStore = UseBoundStore<StoreApi<SidenavState>>

interface TopnavState {
    element: HTMLElement | null,
    setElement: (element: HTMLElement | null) => void,

    menuButtonElement: HTMLButtonElement | null,
    setMenuButtonElement: (element: HTMLButtonElement | null) => void,
}
type TopnavStore = UseBoundStore<StoreApi<TopnavState>>
