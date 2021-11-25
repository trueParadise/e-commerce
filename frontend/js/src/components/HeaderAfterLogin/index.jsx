

import React, { Component } from 'react'
import {Link, NavLink} from 'react-router-dom'
import { connect } from 'react-redux'
import {logout} from '../../redux/actions/login'
import HeaderAfterLoginCss from './index.module.css'



class HeaderAfterLogin extends Component {

    logout =() => {
        this.props.logout('')
    }

    get_data = (e) => {
        let keyword = this.input_data.value
        if (e.key === 'Enter') {
            this.props.searchfunc(keyword)
        }
    }

    render() {
        return (
            <div className={HeaderAfterLoginCss.headCon}>
            	<div>
                    <p><Link to="/main">Main page</Link></p>
                    <ol>
                        <Link to="/userinfo" style={{fontFamily:'Cursive', height:17}}>My account</Link>
                        <Link to="/shoppingCar" style={{fontFamily:'Cursive', height:17}}>MY cart</Link>
            			<Link onClick={this.logout} to='/main' style={{fontFamily:'Cursive', height:17}}>Log out</Link>
                    </ol>
                </div>
                <ul>
                    <a><li>Fantastic</li></a>
                    <ol>
                    <p className={HeaderAfterLoginCss.search}>
                    <input ref={c => this.input_data = c} type='text' placeholder="Search" onKeyDown={this.get_data} /></p>
                        <li><NavLink to="/main?search=Popular" style={{fontFamily:'Cursive', fontSize:17}}>Pick of the week</NavLink></li>
                        <li><NavLink to="/main?search=Men" style={{fontFamily:'Cursive', fontSize:17}}>Man’s wear</NavLink></li>
                        <li><NavLink to="/main?search=Women" style={{fontFamily:'Cursive', fontSize:17}}>Woman’s wear</NavLink></li>
                        <li><NavLink to="/main?search=Children" style={{fontFamily:'Cursive', fontSize:17}}>Children’s wear</NavLink></li>
                        <li><NavLink to="/main?search=Maternal_infant" style={{fontFamily:'Cursive', fontSize:17}}>Maternal & infant</NavLink></li>
                    </ol>
                </ul>

            </div>
        )
    }
}

export default connect(
    state => ({
        isLogin:state.isLogin[0]
    }),
    {logout}
)(HeaderAfterLogin)