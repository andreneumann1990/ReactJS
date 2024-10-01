import { UserGestureConfig, useGesture } from '@use-gesture/react'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'

export { useClick }

const threshold = 10
let initialX = 0
let initialY = 0
let isClickCanceled = false

function useClick(handleClick: (event: React.PointerEvent) => void, config?: UserGestureConfig): ReactDOMAttributes {
    return useGesture({
        onPointerDown: ({ event }) => {
            initialX = event.clientX
            initialY = event.clientY
            isClickCanceled = false
        },

        onPointerMove: ({ event }) => {
            const dx = event.clientX - initialX
            const dy = event.clientY - initialY
            if (dx * dx + dy * dy <= threshold * threshold) return
            isClickCanceled = true
        },

        onPointerUp: ({ event, args }) => {
            if (isClickCanceled) return
            args[0](event)
        }
    }, config)(handleClick)
}
