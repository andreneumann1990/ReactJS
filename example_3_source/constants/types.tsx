import { KeyboardEvent, MutableRefObject } from 'react'
import { StoreApi, UseBoundStore } from 'zustand'

//
//
//

export type NullableBoolean = boolean | null
export type NullableBooleanRef = MutableRefObject<NullableBoolean>
export type NullableNumber = number | null
export type NullableNumberRef = MutableRefObject<NullableNumber>

export type StringStringObject = { [field: string]: string }

export type BooleanRef = MutableRefObject<boolean>
export type TimeoutRef = { current?: NodeJS.Timeout }

export type NullableAnchorElement = HTMLAnchorElement | null
export type SetNullableAnchorElement = (element: NullableAnchorElement) => void

export type NullableButtonElement = HTMLButtonElement | null
export type SetNullableButtonElement = (element: NullableButtonElement) => void

export type NullableDivElement = HTMLDivElement | null
export type SetNullableDivElement = (element: NullableDivElement) => void

export type NullableHTMLElement = HTMLElement | null
export type SetNullableHTMLElement = (element: NullableHTMLElement) => void

//
//
//

export interface DropdownMenuState {
    buttonElement: NullableButtonElement,
    setButtonElement: SetNullableButtonElement,
    contentElement: NullableDivElement,
    setContentElement: SetNullableDivElement,

    element: NullableHTMLElement,
    setElement: SetNullableHTMLElement,
    iconElement: NullableHTMLElement,
    setIconElement: SetNullableHTMLElement,

    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,
}
export type DropdownMenuStore = UseBoundStore<StoreApi<DropdownMenuState>>

export interface EntryData {
    href: string,
    open: boolean,
    purifiedInnerHTML: string,
}

export interface GlobalState {
    dropdownMenuStateArray: DropdownMenuState[],
    layoutState: LayoutState,
    mainState: MainState,

    searchState: SearchState,
    sidenavState: SidenavState,
    topnavState: TopnavState
}

//TODO
// export type NullableKeyboardEvent = KeyboardEvent | null
// export interface KeyboardState {
//     event: NullableKeyboardEvent,
//     setEvent: (event: NullableKeyboardEvent) => void,
// }

export interface KeyboardEventState {
    event?: React.KeyboardEvent,
    setEvent: (event?: React.KeyboardEvent) => void,
}

export interface LayoutState {
    _previousIndexGroup: string,
    indexGroup: string,
    setIndexGroup: (indexGroup: string) => void,
    resetIndexGroup: () => void,
    restorePreviousIndexGroup: () => void,
}
export type LayoutStore = UseBoundStore<StoreApi<LayoutState>>

export interface MainState {
    element: HTMLElement | null,
    setElement: (element: HTMLElement | null) => void,
    isActive: boolean,
    setIsActive: (isActive: boolean) => void,
}
export type MainStore = UseBoundStore<StoreApi<MainState>>

export interface SearchData {
    [url_relative: string]: EntryData[]
}

export type Pair = [number, number]
export interface SearchState {
    inputElement: HTMLInputElement | null,
    setInputElement: (element: HTMLInputElement | null) => void,
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,

    resultsDataArray: SearchData,
    setResultsDataArray: (data: SearchData) => void,
    resultsElement: HTMLDivElement | null,
    setResultsElement: (element: HTMLDivElement | null) => void,

    resultsSelectedIndex: Pair,
    setResultsSelectedIndex: (index: Pair) => void,
}
export type SearchStore = UseBoundStore<StoreApi<SearchState>>

export interface SidenavState {
    element: HTMLElement | null,
    setElement: (element: HTMLElement | null) => void,

    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,

    lastActiveDropdownElement: HTMLButtonElement | null,
    setLastActiveDropdownElement: (element: HTMLButtonElement | null) => void,
}
export type SidenavStore = UseBoundStore<StoreApi<SidenavState>>

export interface TopnavState {
    element: HTMLElement | null,
    setElement: (element: HTMLElement | null) => void,
    homeLinkElement: NullableAnchorElement,
    setHomeLinkElement: SetNullableAnchorElement,

    menuButtonElement: HTMLButtonElement | null,
    setMenuButtonElement: (element: HTMLButtonElement | null) => void,
}
export type TopnavStore = UseBoundStore<StoreApi<TopnavState>>
