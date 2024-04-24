import { KeyboardEvent, MutableRefObject } from 'react'
import { StoreApi, UseBoundStore } from 'zustand'

//
//
//

// I am not sure if I like it the `a new type for everything` approach; in some 
// situations it is really handy to prevent writing the same object structure
// more than once; on the other hand these types need to be imported every time;

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
export type NullableFormElement = HTMLFormElement | null
export type SetNullableFormElement = (element: NullableFormElement) => void

export type NullableHTMLElement = HTMLElement | null
export type SetNullableHTMLElement = (element: NullableHTMLElement) => void
export type NullableImageElement = HTMLImageElement | null
export type SetNullableImageElement = (element: NullableImageElement) => void

export type NullableElement = Element | null
export type NullableEventTarget = EventTarget | null

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

export interface KeyboardEventState {
    event?: React.KeyboardEvent,
    setEvent: (event?: React.KeyboardEvent) => void,
}

export interface LayoutState {
    indexGroup: string,
    setIndexGroup: (indexGroup: string) => void,
}
export type LayoutStore = UseBoundStore<StoreApi<LayoutState>>

export interface MainState {
    element: NullableHTMLElement,
    setElement: (element: NullableHTMLElement) => void,
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
    element: NullableHTMLElement,
    setElement: (element: NullableHTMLElement) => void,

    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,

    lastActiveDropdownElement: HTMLButtonElement | null,
    setLastActiveDropdownElement: (element: HTMLButtonElement | null) => void,
}
export type SidenavStore = UseBoundStore<StoreApi<SidenavState>>

export interface TopnavState {
    element: NullableHTMLElement,
    setElement: (element: NullableHTMLElement) => void,
    homeLinkElement: NullableAnchorElement,
    setHomeLinkElement: SetNullableAnchorElement,

    menuButtonElement: HTMLButtonElement | null,
    setMenuButtonElement: (element: HTMLButtonElement | null) => void,
}
export type TopnavStore = UseBoundStore<StoreApi<TopnavState>>
