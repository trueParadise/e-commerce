import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {connect} from 'react-redux'
import axios from 'axios'
import {login} from '../../redux/actions/login'

// UI component
class Login extends Component {
    
    login = (data) => {
        this.props.login(data)
    }

    handleSubmit = (event) => {
        let identity = event.nativeEvent.submitter.id.toString()
        event.preventDefault()
        const { username: { value: username }, password: { value: password } } = this

        if(username === '' || password === ''){
            alert("Email and password should be provided!")
        } else {
            let data = { 'email': username, 'pwd': password, 'identity': identity}
            axios.post('/api/login', data).then(
                response => {
                    if (response.data.status === 0){
                        this.login(response.data.id)
                        if (response.data.identity === 'user'){
                            // this.props.history.goBack()
                            this.props.history.push("/main")
                        } else if (response.data.identity === 'admin'){
                            this.props.history.push("/administrator")
                        }
                    } else if (response.data.status === 1){
                        alert("Email or password is wrong!")
                    } else if (response.data.status === -1){
                        alert("The user is not exist!")
                    }
                },
                error => { console.log('fail: ', error) }
            )
        }
    }

    render() {
        return (
            <div>
                <div className="wrap login_wrap">
                    <div className="content">
                        <div className="logo"></div>
                        <div className="login_box">
                            <div className="login_form">
                                <div className="login_title">Login</div>
                                {/* <div className="login_span"><span>Input your account</span></div> */}
    
                                <form action="#" method="post" onSubmit={this.handleSubmit}>
    
                                    <div className="form_text_ipt">
                                        <input ref={c => this.username = c} name="username" type="text" placeholder="Email"/>
                                    </div>
                                    {/* <div className="ececk_warning"><span>Input your account</span></div> */}
                                    <div className="form_text_ipt">
                                        <input ref={c => this.password = c} name="password" type="password" placeholder="Password"/>
                                    </div>
                                    {/*<div className="ececk_warning"><span>Need password</span></div>*/}
                                    <div className="form_check_ipt">
                                        <div className="right check_right">
                                            <Link to="/reset" style={{marginLeft:300}}>forgot your password?</Link>
                                        </div>
                                    </div>
                                    <div className="form_btn">
                                        <button id="user">Login</button>
                                    </div>
                                    <div className="form_btn">
                                        <button id="admin">Admin</button>
                                    </div>
                                    <div className="form_reg_btn">
                                        {/* <Link to='/register'>Don't have a account?</Link> */}
                                        <span>Don't have a account?</span>
                                        <div className="form_btn">
                                            <Link to='/register'><button>Register</button></Link>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div id="footCon">
                        <li>
                            <p>Copyright © 2021 .All Rights Reserved.</p>
                            <span>Copyright xxxxxxxxx</span>
                        </li>
                    </div>
                </div>
            </div>
        )
    }
}


export default connect(
    state => ({
        isLogin:state.isLogin[0]
    }),
    {
        login
    }
)(Login)
