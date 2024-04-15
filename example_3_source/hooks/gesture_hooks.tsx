import { useGesture } from '@use-gesture/react'
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types'

export { useClick }

const threshold = 10
let initial_x = 0
let initial_y = 0

function useClick(handleClick: (event: PointerEvent) => void) {
    const onClick: (handleClick: (event: PointerEvent) => void) => ReactDOMAttributes = useGesture({
        onPointerDown: ({ event }) => {
            initial_x = event.clientX
            initial_y = event.clientY
        },

        onPointerUp: ({ event, args }) => {
            const dx = event.clientX - initial_x
            const dy = event.clientY - initial_y
            if (dx * dx + dy * dy > threshold * threshold) return
            args[0](event)
        }
    })
    return onClick(handleClick)
}