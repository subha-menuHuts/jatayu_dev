import { StackActions, DrawerActions, CommonActions } from '@react-navigation/native'

let _navigator

function setTopLevelNavigator(r) {
    _navigator = r
}

function navigate(routeName, params) {
    _navigator.useDispatch(
        CommonActions.navigate({
            name: routeName,
            params: params
        })
    )
}

function replace(routeName, params) {
    _navigator.useDispatch(
        StackActions.replace({
            name: routeName,
            params: params
        })
    )
}

function openDrawer() {
    _navigator.useDispatch(DrawerActions.openDrawer())
}
function closeDrawer() {
    _navigator.useDispatch(DrawerActions.closeDrawer())
}

function back() {
    _navigator.useDispatch(CommonActions.goBack())
}

const NavigationService = {
    navigate,
    setTopLevelNavigator,
    openDrawer,
    closeDrawer,
    back,
    replace
}

export default NavigationService
