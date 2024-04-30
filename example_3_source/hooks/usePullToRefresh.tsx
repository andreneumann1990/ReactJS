// original code copied from:
//      https://github.com/Senbonzakura1234/use-pull-to-refresh
//
// modified to make isDisabled a function;
//
//
// MIT License
// 
// Copyright (c) 2023 Senbonzakura1234
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { useCallback, useEffect, useState } from 'react'

export const DEFAULT_MAXIMUM_PULL_LENGTH = 240
export const DEFAULT_REFRESH_THRESHOLD = 180

export type UsePullToRefreshParams = {
    onRefresh: () => void | Promise<void>
    // default value is 240
    maximumPullLength?: number
    // default value is 180
    refreshThreshold?: number
    isDisabled?: () => boolean
}
export type UsePullToRefreshReturn = {
    isRefreshing: boolean
    pullPosition: number
}
export type UsePullToRefresh = (params: UsePullToRefreshParams) => UsePullToRefreshReturn

const isValid = (maximumPullLength: number, refreshThreshold: number) => maximumPullLength >= refreshThreshold

export const usePullToRefresh: UsePullToRefresh = ({
    onRefresh,
    maximumPullLength = DEFAULT_MAXIMUM_PULL_LENGTH,
    refreshThreshold = DEFAULT_REFRESH_THRESHOLD,
    isDisabled = () => false,
}: UsePullToRefreshParams) => {
    const [pullStartPosition, setPullStartPosition] = useState(0)
    const [pullPosition, setPullPosition] = useState(0)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const onPullStart = useCallback(
        (event: TouchEvent) => {
            if (isDisabled()) return
            const touch = event.targetTouches[0]
            if (touch) setPullStartPosition(touch.screenY)
        },
        [isDisabled],
    )

    const onPulling = useCallback(
        (event: TouchEvent) => {
            if (isDisabled()) return

            // otherwise, the pull-to-scroll can get stuck while scrolling the element; only do one or the other;
            if (pullPosition > 0) {
                if (!event.cancelable) {
                    setPullPosition(0)
                    setPullStartPosition(0)
                    return
                }
                event.preventDefault()
            }

            const touch = event.targetTouches[0]
            if (touch == null) return
            const currentPullLength = pullStartPosition < touch.screenY ? Math.abs(touch.screenY - pullStartPosition) : 0

            // if (currentPullLength <= maximumPullLength && pullStartPosition < window.screen.height / 3)
            if (currentPullLength <= maximumPullLength && pullStartPosition < window.screen.height) {
                setPullPosition(() => currentPullLength)
            }
        },
        [isDisabled, maximumPullLength, pullPosition, pullStartPosition],
    )

    const onEndPull = useCallback(() => {
        if (isDisabled()) return
        setPullPosition(0)
        setPullStartPosition(0)

        if (pullPosition < refreshThreshold) return
        setIsRefreshing(true)

        setTimeout(async () => {
            await onRefresh()
            setIsRefreshing(false)
        }, 500)
    }, [isDisabled, onRefresh, pullPosition, refreshThreshold])

    useEffect(() => {
        // modified;
        if (typeof window === 'undefined') return
        // if (typeof window === 'undefined' || isDisabled()) return

        window.addEventListener('touchstart', onPullStart, { passive: false })
        window.addEventListener('touchmove', onPulling, { passive: false })
        window.addEventListener('touchend', onEndPull, { passive: false })

        return () => {
            window.removeEventListener('touchstart', onPullStart)
            window.removeEventListener('touchmove', onPulling)
            window.removeEventListener('touchend', onEndPull)
        }
    }, [onEndPull, onPullStart, onPulling])

    useEffect(() => {
        if (isValid(maximumPullLength, refreshThreshold) || process.env.NODE_ENV === 'production' || isDisabled()) return
        console.warn(
            'usePullToRefresh',
            `'maximumPullLength' (currently ${maximumPullLength})  should be bigger or equal than 'refreshThreshold' (currently ${refreshThreshold})`,
        )
    }, [isDisabled, maximumPullLength, refreshThreshold])

    return { isRefreshing, pullPosition }
}