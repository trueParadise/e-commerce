import React from 'react'
import {BrowserRouter, Route, Switch, Redirect} from 'react-router-dom'
import User from './pages/User'
import Login from './pages/Login'
import Reset  from './pages/Reset'
import Register from './pages/Register'
import Main from './pages/Main'
import Dashboard from './pages/Dashboard'
import Item from './pages/Item'
import ShoppingCar from './pages/ShoppingCar'
import './App.css'

function App() {
    return (
        <div>
         <React.StrictMode>
            <BrowserRouter>
            {/* register route */}
                <Switch> 
                    <Route path='/main' component={Main}/>
                    <Route path='/login' component={Login}/>
                    <Route path='/reset' component={Reset}/>
                    <Route path='/register' component={Register}/>
                    <Route path='/userinfo' component={User}/>
                    <Route path='/administrator' component={Dashboard}/>
                    <Route path='/item_detail' component={Item}/>
                    <Route path='/shoppingCar' component={ShoppingCar}/>
                    <Redirect to='/main?search=Women'></Redirect>
                </Switch>
            </BrowserRouter>
         </React.StrictMode>   
        </div>
    )
}

export default App