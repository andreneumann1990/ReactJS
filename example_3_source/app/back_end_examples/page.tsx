'use client'

import { Box, Button, Link, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'
import { useNavigateAndHighlightElement } from '../../hooks/navigation'
import { backEndHRef } from '../../constants/general'

export default Page

//
//
//

function Page() {
    useNavigateAndHighlightElement('back_end_examples')

    //
    // parameters and variables
    //

    const [greetingResponse, setGreetingResponse] = useState('')
    const [postFormResponse, setPostFormResponse] = useState<{ username?: string, password?: string, }>({})

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

    //
    //
    //

    return (<>
        {/* header; */}
        <h1 className="my-3 text-3xl font-bold">Back-End Examples</h1>

        {/* <h2 className="my-1 text-xl font-bold">Link:</h2> */}
        <ul className="*:my-2 pl-10">
            <li>
                Link:&nbsp;
                <Link className="inline-block text-blue-300" href={backEndHRef}>{backEndHRef}</Link>
            </li>
        </ul>

        <h2 className="my-1 text-xl font-bold">GET requests:</h2>
        <ul className="*:my-2 pl-10">
            {greetingResponse == '' ?
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
                <TextField error={formik.touched.username && formik.errors.username != null} helperText={formik.errors.username} required label="Username" type="text" autoComplete="username" variant="filled" {...formik.getFieldProps('username')} />
                <TextField required label="Password" type="password" autoComplete="current-password" variant="filled" {...formik.getFieldProps('password')} />
                {/* {!formik.touched.username || !formik.errors.username ? null : formik.errors.username} */}
                {/* <Input ></Input> */}
            </div>
            <div className="inline-block mx-4">
                {/* <Box component="div" className="grid items-center m-2"> */}
                <Button className="m-2" type="submit" variant="contained">Submit</Button>
                {/* </Box> */}
            </div>
        </Box>
        {/* </form> */}
    </>)
}
