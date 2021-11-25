import {LOGIN, LOGOUT} from '../constant'

export const login = (data) => {
    return {type:LOGIN, data:data}
}

export const logout = (data) => {
    return {type:LOGOUT, data:data}
}