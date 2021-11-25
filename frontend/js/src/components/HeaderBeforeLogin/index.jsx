
import React, { Component } from 'react'
import {Link, NavLink} from 'react-router-dom'
import HeaderBeforeLoginCss from './index.module.css'

export default class HeaderBeforeLogin extends Component {

    get_data = (e) => {
        if (e.key === 'Enter') {
            this.props.searchfunc(this.input_data.value)
        }
    }

    render() {
        return (
        	<div className={HeaderBeforeLoginCss.headCon}>
            	<div>
                	<p>Main page</p>
                    <ol>
                        <Link to="/login" style={{fontFamily:'Cursive', height:17}}>Login</Link>
                        <Link to="/register" style={{fontFamily:'Cursive', height:17}}>register</Link>
                    </ol>
                </div>
                <ul>
                    <a><li>Fantastic</li></a>
                    <ol>
                    <p className={HeaderBeforeLoginCss.search}>
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