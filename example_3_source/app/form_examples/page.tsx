'use client'

import { useFormik } from 'formik'
import { MouseEvent, SyntheticEvent, } from 'react'
import * as Yup from 'yup'
import { InputCountry1, InputCountry2 } from '../../components/atoms/InputCountry'
import Link from 'next/link'
import { Button } from '@mui/material'
import { useNavigateAndHighlightElement } from '../../hooks/navigation_hooks'

function Page() {
    useNavigateAndHighlightElement('FormExamples')

    //
    // functions
    //

    const form1 = useFormik({
        initialValues: {
            button: '',
            checkbox: 'false',
            color: '#000000',
            date: '',
            datetimeLocal: '',
            email: '',
            file: '',
            hidden: 'super secret hidden field',
            image: '',
            month: '',
            number: '',
            password: '',
            radio: 'a',
            range: '50',
            reset: '',
            search: '',
            submit: '',
            tel: '',
            text: '',
            time: '',
            url: '',
            week: '',
        },
        validationSchema: Yup.object({
            text: Yup.string().matches(/^\D*$/g, 'No numbers!'),
            password: Yup.string()
                .min(6, 'Too short.')
                .max(6, 'Too long.')
                .matches(/^123456$/g, 'Too secure.')
                .required('Required.'),
            url: Yup.string().url('Invalid url.'),
        }),
        onSubmit: async (values: { [field: string]: string }) => {
            alert(JSON.stringify(values, null, 2))
        },
    })

    const form2 = useFormik({
        initialValues: {
            country1: '',
            country2: '',
        },
        onSubmit: async (values: { [field: string]: string }) => {
            alert(JSON.stringify(values, null, 2))
        },
    })

    //
    //
    //

    function normalizeHeights(formElement: HTMLDivElement | null): void {
        if (formElement == null) return
        const items = formElement.childNodes
        let tallest = 0

        items.forEach(item => {
            if (!(item instanceof HTMLElement)) return
            if (item.offsetHeight <= tallest) return
            tallest = item.offsetHeight
        })

        items.forEach(item => {
            if (!(item instanceof HTMLElement)) return
            item.style.minHeight = `${tallest}px`
        })
    }

    function handleClick(event: MouseEvent): void {
        const element = event.target as HTMLInputElement | null
        if (element == null) return
        if (element.name == '') return
        form1.setFieldValue(element.name, 'clicked')
    }

    function resetForm(event: MouseEvent): void {
        form1.resetForm()
        handleClick(event)
    }

    function handleChangeForCountry1(value: string) {
        form2.setFieldValue('country1', value)
    }

    function handleChangeForCountry2(value: string) {
        form2.setFieldValue('country2', value)
    }

    //
    //
    //

    return (<>
        {/* header; */}
        <h1 className="my-3 text-3xl font-bold">Form Examples</h1>

        <h2 className="my-1 text-xl font-bold">All Input Types:</h2>
        <form onSubmit={form1.handleSubmit}>
            <div ref={normalizeHeights} className="grid grid-flow-row md:grid-cols-2 xl:grid-cols-3 border-x-[1px] items-center">
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Button:
                        <br />
                        <input type="button" name="button" value="use cases? use normal button instead?" className="bg-primary border m-1 px-2 py-1 rounded-md" onClick={handleClick} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Checkbox:
                        <input type="checkbox" className="ml-2 m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('checkbox')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Color:
                        <input type="color" className="ml-2 m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('color')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Date:
                        <br />
                        <input type="date" className="m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('date')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Datetime-Local:
                        <br />
                        <input type="datetime-local" className="m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('datetimeLocal')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Email:
                        <br />
                        <input type="email" placeholder="max.mustermann@mustermail.de" className="w-72 m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('email')} autoComplete="email" />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        File:
                        <br />
                        <input type="file" accept=".txt,.cs,application/msword" className="m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('file')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <p>Hidden:
                        <input type="hidden" className="ml-2 m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('hidden')} />
                    </p>
                </div>
                <div className="flex px-5 border-x-[1px] items-center">
                    <label className="flex items-center">
                        Image:
                        <input type="image" name="image" src="./icons/logo192.png" width={40} className="ml-2 m-1 px-2 py-1 rounded-md" onClick={handleClick} />
                    </label>
                    {!form1.touched.image || Object.keys(form1.errors).length < 1 ?
                        null : <span className="ml-4 px-2 py-1 text-red-500">The form contains invalid fields.</span>
                    }
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Month:
                        <br />
                        <input type="month" className="m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('month')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Number:
                        <br />
                        <input type="number" className="m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('number')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        <span className="before:content-['*'] after:content-['*'] after:ml-1 after:text-red-500">Password:</span>
                        {!form1.touched.password ? null : form1.errors.password ?
                            <span className="ml-4 px-2 py-1 text-red-500">{form1.errors.password}</span>
                            : <span className="ml-4 px-2 py-1 text-green-500">That&apos;s the right password!</span>
                        }
                        <br />
                        <input id="password" type="password" placeholder="123456" className="m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('password')} autoComplete="current-password" />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Radio:
                        <br />
                        <label className="inline-flex px-2"><input type="radio" name="radio" value="a" checked={form1.values.radio === 'a'} onChange={form1.handleChange} />&nbsp;a</label>
                        <label className="inline-flex px-2"><input type="radio" name="radio" value="b" checked={form1.values.radio === 'b'} onChange={form1.handleChange} />&nbsp;b</label>
                        <label className="inline-flex px-2"><input type="radio" name="radio" value="c" checked={form1.values.radio === 'c'} onChange={form1.handleChange} />&nbsp;c</label>
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Range:
                        <br />
                        <input type="range" className="m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('range')} />
                    </label>
                </div>
                <div className="grid justify-between px-5 border-x-[1px] items-center">
                    <label>
                        Reset:
                        <br />
                        <input type="reset" name="reset" value="use cases? use normal button instead?" className="bg-primary border m-1 px-2 py-1 rounded-md" onClick={resetForm} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Search:
                        <br />
                        <input type="search" className="m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('search')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Submit:
                        {!form1.touched.submit || Object.keys(form1.errors).length < 1 ?
                            <span className="h-7" /> :
                            <span className="ml-4 px-2 py-1 text-red-500">The form contains invalid fields.</span>
                        }
                        <br />
                        <input type="submit" name="submit" value="use cases? use normal button instead?" className="bg-primary border m-1 px-2 py-1 rounded-md" onClick={handleClick} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Tel:
                        <br />
                        <input type="tel" className="m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('tel')} autoComplete="tel" />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Text:
                        {!form1.touched.text || !form1.errors.text ? null : <span className="ml-4 px-2 py-1 text-red-500">{form1.errors.text}</span>}
                        <br />
                        <input type="text" placeholder="text only" className="m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('text')} autoComplete="username" />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Time:
                        <input type="time" className="ml-2 m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('time')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        URL:
                        {!form1.touched.url || !form1.errors.url ? null : <span className="ml-4 px-2 py-1 text-red-500">{form1.errors.url}</span>}
                        <br />
                        <input type="url" placeholder="https://www.google.de" className="m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('url')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Week:
                        <br />
                        <input type="week" className="m-1 px-2 py-1 rounded-md" {...form1.getFieldProps('week')} />
                    </label>
                </div>
                <div className="hidden xl:block px-5 xl:border-x-[1px] items-center" />
                <div className="hidden xl:block px-5 xl:border-x-[1px] items-center" />
            </div>
        </form >

        <br />

        {/* country select input element; */}
        <h2 className="my-1 text-xl font-bold">MUI has predefined UI elements:</h2>
        <form className="m-4" onSubmit={form2.handleSubmit}>
            <div ref={normalizeHeights} className="grid grid-flow-row md:grid-cols-2 xl:grid-cols-3 items-center">
                <div className="grid px-5 items-center">
                    <div>
                        First try:
                        {/*
                            rounded-md does not work since it is applied to the container without border; 
                            customization might be difficult when using these; 
                        */}
                        <InputCountry1 className="m-1 px-2 py-1 rounded-md" onChange={(_: SyntheticEvent, value: string) => handleChangeForCountry1(value)} />
                    </div>
                </div>
                <div className="grid px-5 items-center">
                    <div>
                        Copied from: <Link className="text-blue-300" href={'https://mui.com/material-ui/react-autocomplete/'}>https://mui.com/material-ui/react-autocomplete/</Link>
                        <InputCountry2 className="m-1 px-2 py-1 rounded-md" onChange={(_: SyntheticEvent, { label }: { label: string }) => handleChangeForCountry2(label)} />
                    </div>
                </div>
            </div>
            <br />
            <Button variant="outlined" type="submit">Submit</Button>
        </form >
    </>)
}

export default Page