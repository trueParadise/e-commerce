import React, { Component } from 'react'
import axios from 'axios'
import '../../App.css'
import {Link} from "react-router-dom";

export default class Reset extends Component {
    
    handleSubmit = (event) => {
        event.preventDefault()
        const {
            email:{value:email},
            password:{value:password},
            repassword:{value:repassword}
        } = this

        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (password === '' || repassword === '' || email === ''){
        	alert("Some information is empty!")
		} else if (! re.test(email)){
        	alert("The mailbox format is incorrect!")
		} else if (password.length < 6){
        	alert("The password must be larger than six characters!")
		} else if (password !== repassword){
        	alert("Re-password should be same with the new password!")
		} else {
            let data = {
                'email':email,
                'pwd':password
            }

            axios.post('/api/reset_pwd', data).then(
                response => {
                    if (response.data.status === 0) {
                        alert('Please check your email.')
                        this.props.history.push('/login')
                    } else if (response.data.status === 1) {
                        alert('fail to reset password.')
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
                                <div className="login_title">Reset your password</div>
                                <form action="#" method="post" onSubmit={this.handleSubmit}>
                                    {/* <div className="form_text_ipt">
                                        <input ref={c => this.username = c} name="username" type="text" placeholder="Account Name"/>
                                    </div> */}

                                    <div className="form_text_ipt">
                                        <input ref={c => this.email = c} name="email" type="text" placeholder="E-mail"/>
                                    </div>

                                    <div className="form_text_ipt">
                                        <input ref={c => this.password = c} name="password" type="password" placeholder="New password"/>
                                    </div>

                                    <div className="form_text_ipt">
                                        <input ref={c => this.repassword = c} name="repassword" type="password" placeholder="Repeat password"/>
                                    </div>

                                    <div className="form_btn">
                                        <button>Submit</button>
                                    </div>
                                    <div className="form_btn">
										<Link to='/login'><button>Login</button></Link>
									</div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
