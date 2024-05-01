import { MutableRefObject } from 'react'
import { StoreApi, UseBoundStore } from 'zustand'

//
//
//

// I am not sure if I like it the `a new type for everything` approach; in some 
// situations it is really handy to prevent writing the same object structure
// more than once; on the other hand these types need to be imported every time;

export type NullableBoolean = boolean | null | undefined
export type NullableBooleanRef = MutableRefObject<NullableBoolean>
export type NullableNumber = number | null | undefined
export type NullableNumberRef = MutableRefObject<NullableNumber>

export type NullableString = string | null | undefined
export type StringStringObject = { [field: string]: string }

export type BooleanRef = MutableRefObject<boolean>
export type TimeoutRef = { current?: NodeJS.Timeout }

export type NullableAnchorElement = HTMLAnchorElement | null | undefined
export type SetNullableAnchorElement = (element: NullableAnchorElement) => void
export type NullableButtonElement = HTMLButtonElement | null | undefined
export type SetNullableButtonElement = (element: NullableButtonElement) => void

export type NullableDivElement = HTMLDivElement | null | undefined
export type SetNullableDivElement = (element: NullableDivElement) => void
export type NullableFormElement = HTMLFormElement | null | undefined
export type SetNullableFormElement = (element: NullableFormElement) => void

export type NullableHTMLElement = HTMLElement | null | undefined
export type SetNullableHTMLElement = (element: NullableHTMLElement) => void
export type NullableImageElement = HTMLImageElement | null | undefined
export type SetNullableImageElement = (element: NullableImageElement) => void

export type NullableInputElement = HTMLInputElement | null | undefined
export type SetNullableInputElement = (element: NullableInputElement) => void
export type NullableElement = Element | null | undefined
export type NullableEventTarget = EventTarget | null | undefined

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

export interface LayoutState {
    indexGroup: string,
    setIndexGroup: (indexGroup: string) => void,
    isFirstKeyDown: boolean,
    setIsFirstKeyDown: (isFirstKeyDown: boolean) => void,

    keyDownCooldown: number,
    setKeyDownCooldown: (keyDownCooldown: number) => void,
    previousFocusedElement: NullableHTMLElement,
    setPreviousFocusedElement: (previousFocusedElement: NullableHTMLElement) => void,
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
    inputElement: NullableInputElement,
    setInputElement: (element: NullableInputElement) => void,
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,

    resultsDataArray: SearchData,
    setResultsDataArray: (data: SearchData) => void,
    resultsElement: NullableDivElement,
    setResultsElement: (element: NullableDivElement) => void,

    resultsSelectedIndex: Pair,
    setResultsSelectedIndex: (index: Pair) => void,
}
export type SearchStore = UseBoundStore<StoreApi<SearchState>>

export interface SidenavState {
    element: NullableHTMLElement,
    setElement: (element: NullableHTMLElement) => void,
    isOpen: boolean,
    setIsOpen: (isOpen: boolean) => void,

    isPanning: boolean,
    setIsPanning: (isPanning: boolean) => void,
    lastActiveDropdownElement: NullableButtonElement,
    setLastActiveDropdownElement: (element: NullableButtonElement) => void,

    panningOffset: number,
    setPanningOffset: (panningOffset: number) => void,
}
export type SidenavStore = UseBoundStore<StoreApi<SidenavState>>

export interface TopnavState {
    element: NullableHTMLElement,
    setElement: (element: NullableHTMLElement) => void,
    homeLinkElement: NullableAnchorElement,
    setHomeLinkElement: SetNullableAnchorElement,

    menuButtonElement: NullableButtonElement,
    setMenuButtonElement: (element: NullableButtonElement) => void,
}
export type TopnavStore = UseBoundStore<StoreApi<TopnavState>>
