import {LOGIN, LOGOUT} from '../constant'

const initState = [false, '']
export default function loginReducer(preState=initState, action) {
    const {type, data} = action
    let obj = [...preState]
    switch(type) {
        case LOGIN:
            obj[0] = !obj[0]
            obj[1] = data
            return obj
        case LOGOUT:
            obj[0] = !obj[0]
            obj[1] = data
            return obj
        default:
            return preState
    }
}

