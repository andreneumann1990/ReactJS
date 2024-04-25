'use client'

import { Box, Button, Link, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { backEndHRef, focusableElementSelectors, mainIndexGroup } from '../../constants/parameters'
import { useIndexGroupContainer, useIndexGroupEffect } from '../../hooks/indexGroup'
import { NullableDivElement } from '../../constants/types'

export default Page

//
//
//

function Page() {
    //
    // parameters and variables
    //

    const [greetingResponse, setGreetingResponse] = useState('')
    const [postFormResponse, setPostFormResponse] = useState<{ username?: string, password?: string, }>({})

    const [pageElement, setPageElement] = useState<NullableDivElement>(null)

    //
    // functions
    //

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required.'),
            password: Yup.string().required('Required.'),
        }),
        onSubmit: async ({ username, password }) => {
            const response = await fetch(`${backEndHRef}/user/submit`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            })
            setPostFormResponse(await response.json())
        },
    })

    //
    // effects
    //

    useEffect(() => {
        fetch(`${backEndHRef}/greeting`)
            .then((response) => {
                async function applyResponse() {
                    setGreetingResponse(await response.text())
                }
                applyResponse()
            })
            .catch(() => { })
    }, [])

    useIndexGroupEffect(pageElement, focusableElementSelectors)

    //
    //
    //

    return (
        <div
            {...useIndexGroupContainer(mainIndexGroup)}
            ref={setPageElement}
        >
            {/* header; */}
            <h1 className="my-3 text-3xl font-bold">Back-End Examples</h1>

            {/* <h2 className="my-1 text-xl font-bold">Link:</h2> */}
            <ul className="*:my-2 pl-10">
                <li>
                    Link:&nbsp;
                    <Link
                        className="text-blue-300"
                        href={backEndHRef}
                    >{backEndHRef}</Link>
                </li>
                <li>heroku requires a paid dynos to run the back-end; :/</li>
            </ul>

            <h2 className="my-1 text-xl font-bold">GET requests:</h2>
            <ul className="*:my-2 pl-10">
                {greetingResponse === '' ?
                    (<li>no response yet</li>) :
                    (<li>{`Back-End: <${greetingResponse}>`}</li>)
                }
            </ul>

            <h2 className="my-1 text-xl font-bold">POST requests:</h2>
            <ul className="*:my-2 pl-10">
                {postFormResponse.username == null ?
                    (<li>no response yet</li>) :
                    Object.entries(postFormResponse).map(([key, value], index) => (<li key={index}>{`Back-End: <${key}, ${value}>`}</li>))
                }
            </ul>
            <Box
                component="form"
                sx={{ '& .MuiTextField-root': { m: 1, width: '25ch' }, }}
                noValidate
                autoComplete="off"
                onSubmit={formik.handleSubmit}
            >
                <div className="flex flex-wrap m-2">
                    <TextField
                        {...formik.getFieldProps('username')}
                        autoComplete="username"
                        error={formik.touched.username && formik.errors.username != null} helperText={formik.errors.username}
                        label="Username"
                        required
                        type="text"
                        variant="filled"
                    />
                    <TextField
                        {...formik.getFieldProps('password')}
                        autoComplete="current-password"
                        label="Password"
                        required
                        type="password"
                        variant="filled"
                    />
                    {/* {!formik.touched.username || !formik.errors.username ? null : formik.errors.username} */}
                    {/* <Input ></Input> */}
                </div>
                <div className="inline-block mx-4">
                    {/* <Box component="div" className="grid items-center m-2"> */}
                    <Button
                        className="m-2"
                        type="submit"
                        variant="contained"
                    >Submit</Button>
                    {/* </Box> */}
                </div>
            </Box>
            {/* </form> */}
        </div>
    )
}
