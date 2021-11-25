import React, { Component } from 'react'
import axios from 'axios'
import {Link} from "react-router-dom";

export default class Register extends Component {
    handleSubmit = (event) => {
        event.preventDefault()
        const {
        username:{value:username},
        password:{value:password},
        repassword:{value:repassword},
        email:{value:email},
        address:{value:address},
        interest_1:{value:interest_1},
        interest_2:{value:interest_2},
        gender:{value:gender}
        } = this

		const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

		if (username === '' || password === '' || repassword === '' || email === '' || address === '' || interest_1 === '' || interest_2 === '' || gender === ''){
        	alert("Some information is empty!")
		} else if (! re.test(email)){
        	alert("The mailbox format is incorrect!")
		} else if (password.length < 6){
        	alert("The password must be larger than six characters!")
		} else if (password !== repassword){
        	alert("Re-password should be same with the new password!")
		} else {
        	let data = {
				'name':username,
				'email':email,
				'pwd':password,
				'interest': [interest_1,interest_2].toString(),
				'address':address,
				'gender':gender
			}

        	axios.post('/api/user_register', data).then(
				response => {
					if (response.data.status === 0) {
						this.props.history.push("/login")
					} else if (response.data.status === 1) {
						alert('Registered failed')
					} else if(response.data.status === -1) {
						alert('Your email has been registered')
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
								<div className="login_title">Register</div>
								<form action="#" method="post"  onSubmit={this.handleSubmit}>
									<div className="form_text_ipt">
										<input ref = {c => this.username = c} name="username" type="text" placeholder="Account Name"/>
									</div>
									{/*<div className="ececk_warning"><span>Input your account</span></div>*/}
									
									<div className="form_text_ipt">
										<input ref = {c => this.email = c} name="email" type="text" placeholder="E-mail address"/>
									</div>
									
									{/*<div className="ececk_warning"><span>Input your e-mail address</span></div>*/}
									
									<div className="form_text_ipt">
										<input ref = {c => this.password = c} name="password" type="password" placeholder="Password"/>
									</div>
									{/*<div className="ececk_warning"><span>Input your password</span></div>*/}
									
									<div className="form_text_ipt">
										<input ref = {c => this.repassword = c} name="repassword" type="password" placeholder="Repeat your password"/>
									</div>
									{/*<div className="ececk_warning"><span>Input your password</span></div>*/}
									
									<div className="form_text_ipt">
										<input ref = {c => this.address = c} name="address" type="text" placeholder="address"/>
									</div>
									{/*<div className="ececk_warning"><span>Input your address</span></div>*/}
									{/* <div className="form_select"> */}
								
									<div className="select_span">
									
										<span>Interest 1</span>
										<select ref={c => this.interest_1 = c}>
											<option value="T-shrit">T-shrit</option>
											<option value="Dress">Dress</option>
											<option value="Sweater">Sweater</option>
											<option value="Coat">Coat</option>
											<option value="Skirt">Skirt</option>
											<option value="Pants">Pants</option>
											<option value="Hat">Hat</option>
											<option value="Baby-Clothes">Baby-Clothes</option>
										</select>
									
										<span>Interest 2</span>
										<select ref={c => this.interest_2 = c}>
											<option value="Red">Red</option>
											<option value="Yellow">Yellow</option>
											<option value="Pink">Pink</option>
											<option value="White">White</option>
											<option value="Blue">Blue</option>
											<option value="Black">Black</option>
											<option value="Green">Green</option>
											<option value="Grey">Grey</option>
										</select>
									</div>
									
									<div className="select">
									<span>Gender</span>
										<select ref={c => this.gender = c}>
											<option value="Male">Male</option>
											<option value="Female">Female</option>
											{/* <option name="gender" type="radio"/><label>Male</label>
											<option name="gender" type="radio" className="woman"/><label>Female</label> */}
										</select>
									</div>
									<div className="form_btn">
										<button>Register</button>
									</div>
									<div className="form_btn">
										<Link to='/login'><button>Login</button></Link>
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
