import TextField from '@mui/material/TextField'
import { Autocomplete, Box } from '@mui/material'
import { countries, mainIndexGroup } from '../../constants/parameters'
import { useState } from 'react'
import { FormikErrors } from 'formik'
import { NullableDivElement, StringStringObject } from '../../constants/types'
import { focusFirstChildElement } from '../../constants/functions'
import { useIndexGroupItem, useIndexGroupContainer } from '../../hooks/useIndexGroup'

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
    const [containerElement, setContainerElement] = useState<NullableDivElement>(null)
    const localIndexGroup = 'main-country1'

    //
    // functions
    //

    function handleKeyDown(event: React.KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            focusFirstChildElement(containerElement, 'input')
            return
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            containerElement?.focus()
            return
        }
    }

    //
    //
    //

    return (
        <div
            {...useIndexGroupItem(mainIndexGroup)}
            // className="max-w-[310px]"
            onKeyDown={handleKeyDown}
            ref={setContainerElement}
        >
            <Autocomplete
                {...useIndexGroupContainer(localIndexGroup)}
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
                sx={{ maxWidth: 300 }}
            />
        </div>
    )
}

// From: https://mui.com/material-ui/react-autocomplete/
function Country2({ setFieldValue }: { setFieldValue: (value: string) => (Promise<void> | Promise<FormikErrors<StringStringObject>>) }): JSX.Element {
    //
    // parameters and variables
    //

    const [containerElement, setContainerElement] = useState<NullableDivElement>(null)
    const localIndexGroup = 'main-country2'

    //
    // functions
    //

    function handleKeyDown(event: React.KeyboardEvent): void {
        if (event.key === 'Enter') {
            event.preventDefault()
            event.stopPropagation()
            // layoutState.setIndexGroup(localIndexGroup)
            focusFirstChildElement(containerElement, 'input')
            return
        }

        if (event.key === 'Escape') {
            event.preventDefault()
            event.stopPropagation()
            // layoutState.setIndexGroup('main')
            containerElement?.focus()
            return
        }
    }

    //
    // effects
    //

    // useIndexGroupEffect(containerElement, focusableElementSelectors)

    //
    //
    //

    return (
        <div
            {...useIndexGroupItem(mainIndexGroup)}
            onKeyDown={handleKeyDown}
            ref={setContainerElement}
        >
            <Autocomplete
                {...useIndexGroupContainer(localIndexGroup)}
                autoHighlight
                className="m-1 px-2 py-1 rounded-md"
                // data-index-group={localIndexGroup}
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
                sx={{ maxWidth: 300 }}
            />
        </div>
    )
}
