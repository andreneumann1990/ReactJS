import TextField from '@mui/material/TextField'
import { Autocomplete, Box } from '@mui/material'
import { useGlobalStore } from '../../hooks/stores'
import { countries, mainIndexGroup } from '../../constants/parameters'
import { useEffect, useRef } from 'react'
import { FormikErrors } from 'formik'
import { StringStringObject } from '../../constants/types'
import { focusFirstChildElement, getFirstChildElement } from '../../constants/functions'
import { useIndexGroupEffect } from '../../hooks/indexGroup'

export { Country1 }
export { Country2 }

//
//
//

function Country1({ setFieldValue }: { setFieldValue: (value: string) => (Promise<void> | Promise<FormikErrors<StringStringObject>>) }): JSX.Element {
    //
    // parameters and variables
    //

    const options = ['England', 'France', 'Germany', 'Musterland']
    const { layoutState } = useGlobalStore()
    const elementRef = useRef<HTMLDivElement | null>(null)
    const localIndexGroup = 'main-country1'

    //
    // functions
    //

    function handleKeyDown(event: React.KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            layoutState.setIndexGroup('main-country1')
            focusFirstChildElement(elementRef.current, 'input')
            return
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            layoutState.setIndexGroup('main')
            elementRef.current?.focus()
            // (event.currentTarget as HTMLElement)?.focus()
            return
        }
    }

    //
    // effects
    //

    // useEffect(() => {
    //     const inputElement = getFirstChildElement(elementRef.current, 'input')
    //     if (inputElement == null) return
    //     inputElement.tabIndex = layoutState.indexGroup === 'main-country1' ? 0 : -1
    // }, [layoutState.indexGroup])
    useIndexGroupEffect(elementRef.current, localIndexGroup, 'button, input')

    //
    //
    //

    return (<>
        <div
            onKeyDown={handleKeyDown}
            ref={elementRef}
            tabIndex={layoutState.indexGroup === mainIndexGroup ? 0 : -1}
        >
            <Autocomplete
                autoHighlight
                className="m-1 px-2 py-1 rounded-md"
                id="country1"
                onChange={(_, value) => setFieldValue(value ?? '')}
                options={options.map((option) => option)}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Country"
                        InputProps={{ ...params.InputProps }}
                    />
                )}
                tabIndex={layoutState.indexGroup === 'main-country1' ? 0 : -1}
            />
        </div>
    </>)
}

// From: https://mui.com/material-ui/react-autocomplete/
function Country2({ setFieldValue }: { setFieldValue: (value: string) => (Promise<void> | Promise<FormikErrors<StringStringObject>>) }): JSX.Element {
    //
    // parameters and variables
    //

    const { layoutState } = useGlobalStore()
    const { setIndexGroup } = layoutState
    const elementRef = useRef<HTMLDivElement | null>(null)
    const localIndexGroup = 'main-country2'

    //
    // functions
    //

    function handleKeyDown(event: React.KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            layoutState.setIndexGroup(localIndexGroup)
            focusFirstChildElement(elementRef.current, 'input')
            return
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            layoutState.setIndexGroup('main')
            elementRef.current?.focus()
            return
        }
    }

    //
    // effects
    //

    //     useEffect(() => {
    //         const inputElement = getFirstChildElement(elementRef.current, 'input')
    //         if (inputElement == null) return
    // 
    //         inputElement.tabIndex = layoutState.indexGroup === localIndexGroup ? 0 : -1
    //         inputElement.addEventListener('focus', () => setIndexGroup(localIndexGroup), true)
    //         return () => { inputElement.removeEventListener('focus', () => setIndexGroup(localIndexGroup), true) }
    //     }, [layoutState.indexGroup, setIndexGroup])
    useIndexGroupEffect(elementRef.current, localIndexGroup, 'input')

    //
    //
    //

    return (
        <div
            onKeyDown={handleKeyDown}
            ref={elementRef}
            tabIndex={layoutState.indexGroup === mainIndexGroup ? 0 : -1}
        >
            <Autocomplete
                autoHighlight
                className="m-1 px-2 py-1 rounded-md"
                getOptionLabel={(option) => option.label}
                id="country2"
                onChange={(_, value: { label: string } | null) => setFieldValue(value?.label ?? '')}
                options={countries}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Choose a country"
                        inputProps={{
                            ...params.inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                    />
                )}
                renderOption={(props, option, state) => (<Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props} key={`${state.index}a`}>
                    {/*
                    so both need a key -- the Box and the img element; probably the <></> fragment 
                    as well if it is being used(?);
                    
                    it complains that I should use <Image> but the elements have different heights
                    and <Image> seems to require a known height; 
                */}
                    <img key={`${state.index}b`}
                        loading="lazy"
                        width="20"
                        srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
                        src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
                        alt=""
                    />
                    {option.label} ({option.code}) +{option.phone}
                </Box>)
                }
                sx={{ width: 300 }}
            />
        </div>
    )
}
