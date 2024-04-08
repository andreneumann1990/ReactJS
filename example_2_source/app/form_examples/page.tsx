'use client'

import { useFormik } from 'formik'
import { MouseEvent, } from 'react'
import * as Yup from 'yup'

function Page() {
    //
    // functions
    //

    const formik = useFormik({
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
            submit: 'Submit',
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
        formik.setFieldValue(element.name, 'clicked')
    }

    function resetForm(event: MouseEvent): void {
        formik.resetForm()
        handleClick(event)
    }

    //
    //
    //

    return (<>
        {/* header; */}
        <h1 className="my-3 text-3xl font-bold">Form Examples</h1>

        <h2 className="my-1 text-xl font-bold">All Input Types:</h2>
        <form onSubmit={formik.handleSubmit} >
            <div ref={normalizeHeights} className="grid grid-flow-row md:grid-cols-2 xl:grid-cols-3 border-x-[1px] items-center">
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Button:
                        <br />
                        <input type="button" name="button" value="use cases? use normal button instead?" className="bg-[--color-light-1] border m-1 px-2 py-1 rounded-md" onClick={handleClick} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Checkbox:
                        <input type="checkbox" className="ml-2 m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('checkbox')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Color:
                        <input type="color" className="ml-2 m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('color')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Date:
                        <br />
                        <input type="date" className="m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('date')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Datetime-Local:
                        <br />
                        <input type="datetime-local" className="m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('datetimeLocal')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Email:
                        <br />
                        <input type="email" autoComplete="true" placeholder="max.mustermann@mustermail.de" className="w-72 m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('email')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        File:
                        <br />
                        <input type="file" accept=".txt,.cs,application/msword" className="m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('file')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label htmlFor="hidden">Hidden:
                        <input type="hidden" className="ml-2 m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('hidden')} />
                    </label>
                </div>
                <div className="flex px-5 border-x-[1px] items-center">
                    <label className="flex items-center">
                        Image:
                        <input type="image" name="image" src="./icons/logo192.png" width={40} className="ml-2 m-1 px-2 py-1 rounded-md" onClick={handleClick} />
                    </label>
                    {!formik.touched.image || Object.keys(formik.errors).length < 1 ?
                        null : <span className="ml-4 px-2 py-1 text-red-500">The form contains invalid fields.</span>
                    }
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Month:
                        <br />
                        <input type="month" className="m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('month')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Number:
                        <br />
                        <input type="number" className="m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('number')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        <span className="after:content-['*'] after:ml-1 after:text-red-500">Password:</span>
                        {!formik.touched.password ? null : formik.errors.password ?
                            <span className="ml-4 px-2 py-1 text-red-500">{formik.errors.password}</span>
                            : <span className="ml-4 px-2 py-1 text-green-500">That&apos;s the right password!</span>
                        }
                        <br />
                        <input id="password" type="password" placeholder="123456" className="m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('password')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Radio:
                        <br />
                        <label className="inline-flex px-2"><input type="radio" name="radio" value="a" checked={formik.values.radio === 'a'} onChange={formik.handleChange} />&nbsp;a</label>
                        <label className="inline-flex px-2"><input type="radio" name="radio" value="b" checked={formik.values.radio === 'b'} onChange={formik.handleChange} />&nbsp;b</label>
                        <label className="inline-flex px-2"><input type="radio" name="radio" value="c" checked={formik.values.radio === 'c'} onChange={formik.handleChange} />&nbsp;c</label>
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Range:
                        <br />
                        <input type="range" className="m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('range')} />
                    </label>
                </div>
                <div className="grid justify-between px-5 border-x-[1px] items-center">
                    <label>
                        Reset:
                        <br />
                        <input type="reset" name="reset" value="use cases? use normal button instead?" className="bg-[--color-light-1] border m-1 px-2 py-1 rounded-md" onClick={resetForm} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Search:
                        <br />
                        <input type="search" className="m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('search')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Submit:
                        {!formik.touched.submit || Object.keys(formik.errors).length < 1 ?
                            <span className="h-7" /> :
                            <span className="ml-4 px-2 py-1 text-red-500">The form contains invalid fields.</span>
                        }
                        <br />
                        <input type="submit" name="submit" value="use cases? use normal button instead?" className="bg-[--color-light-1] border m-1 px-2 py-1 rounded-md" onClick={handleClick} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Tel:
                        <br />
                        <input type="tel" autoComplete="true" className="m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('tel')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Text:
                        {!formik.touched.text || !formik.errors.text ? null : <span className="ml-4 px-2 py-1 text-red-500">{formik.errors.text}</span>}
                        <br />
                        <input type="text" placeholder="text only" className="m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('text')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Time:
                        <input type="time" className="ml-2 m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('time')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        URL:
                        {!formik.touched.url || !formik.errors.url ? null : <span className="ml-4 px-2 py-1 text-red-500">{formik.errors.url}</span>}
                        <br />
                        <input type="url" placeholder="https://www.google.de" className="m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('url')} />
                    </label>
                </div>
                <div className="grid px-5 border-x-[1px] items-center">
                    <label>
                        Week:
                        <br />
                        <input type="week" className="m-1 px-2 py-1 rounded-md" {...formik.getFieldProps('week')} />
                    </label>
                </div>
                <div className="hidden xl:block px-5 xl:border-x-[1px] items-center" />
                <div className="hidden xl:block px-5 xl:border-x-[1px] items-center" />
            </div>
        </form >
    </>)
}

export default Page