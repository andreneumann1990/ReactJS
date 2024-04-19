import { useDropdownMenuStoreArray } from '../components/atoms/DropdownMenu'
import { useLayoutStore } from '../components/layout/Layout'
import { useMainStore } from '../components/layout/Main'
import { useSidenavStore } from '../components/layout/Sidenav'
import { useTopnavStore } from '../components/layout/Topnav'
import { GlobalState } from '../constants/types'

export { useGlobalStore }

function useGlobalStore(): GlobalState {
    return {
        dropdownMenuStateArray: useDropdownMenuStoreArray.map((store) => store()),
        layoutState: useLayoutStore(),
        mainState: useMainStore(),
        sidenavState: useSidenavStore(),
        topnavState: useTopnavStore(),
    }
}