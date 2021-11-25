import {createStore, combineReducers} from 'redux'
import {persistStore, persistReducer} from 'redux-persist'
import storageSession from 'redux-persist/lib/storage/session'
import loginReducer from './reducers/login'

const storageConfig = {
    key: 'root',
    storage:storageSession,
    blacklist: [] 
}


const allReducer = combineReducers({
    isLogin:loginReducer
})

const myPersistReducer = persistReducer(storageConfig, allReducer)

const store = createStore(myPersistReducer)

export const persistor = persistStore(store)
export default store
