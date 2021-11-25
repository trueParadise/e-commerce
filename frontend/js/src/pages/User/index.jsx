import React, { Component } from 'react'
// import PubSub from 'pubsub-js'
import axios from 'axios'
import {connect} from 'react-redux'
import { Switch, NavLink, Route, Redirect } from 'react-router-dom'
import HeaderAfterLogin from '../../components/HeaderAfterLogin'
import UserInfo from '../../components/UserInfo'
import YourOrder from '../../components/YourOrders'

class User extends Component {
    state = {
        userid:'',
        email:'',
        name:'',
        address:'',
        gender:'',
        interest:'',
        pict:''
    }
    
    

    componentDidMount() {
        let data = {'userid':this.props.userid}
        axios.post('/api/user_info', data).then(
            response => {
                if (response.data.status === 0) {
                    this.setState({
                        name: response.data.user.name,
                        email: response.data.user.email,
                        address: response.data.user.address,
                        interest: response.data.user.interest,
                        gender: response.data.user.gender,
                        pict: response.data.user.picture
                    }, () => {
                        document.getElementById("info").click()
                    })
                } else {
                    alert("Check info of user failed!")
                }
            },
            error => { console.log('fail: ', error) }
        )
    }
    
    upload_photo = (e) => {
        if (e.target.files[0]['name'].split('.').at(-1) !== 'jpeg' &&
            e.target.files[0]['name'].split('.').at(-1) !== 'png'
            ) 
        {
            alert('please upload picture png or jpeg!')
            return 
        }
        var file = e.target.files[0]
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
            this.setState({pict: reader.result})
            let data = {
                'id': this.props.userid,
                'base64': reader.result
            }
            axios.post('/api/update_photo', data).then(
                response => {
                    // console.log('bbb', response.data)
                },
                error => {
                    console.log('failed', error)
                }
            )  
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        }
    }
    
    

    handleSubmit = () => {
        return (receive) => {
            let {
                username:{value:username},
                address:{value:address},
                interest_1:{value:interest_1},
                interest_2:{value:interest_2},
                gender:{value:gender}
            } = receive
            console.log(username, address)
            if(username === ''){
                username = this.state.name
            }
            if(address === ''){
                address = this.state.address
            }
            if(gender === '#'){
                gender = this.state.gender
            }
            if(interest_1 === '#'){
                interest_1 = this.state.interest[0]
            }
            if(interest_2 === '#'){
                interest_2 = this.state.interest[1]
            }
            let data = {
                'id': this.props.userid,
                'name':username,
                'email':this.state.email,
                'interest': [interest_1,interest_2].toString(),
                'address':address,
                'gender':gender
            }
            let Interest = (data.interest).split(',')
    
            // let Gender = this.state.gender
    
            console.log('Edit_data: ',data)
    
            axios.post('/api/update_profile', data).then(
                response => {
                	// console.log(response.data)
                    if (response.data.status === 0) {
                        // this.props.history.push("/login")
                        this.setState({
                            name: data.name,
                            // email: data.email,
                            gender: data.gender,
                            interest: Interest,
                            address:data.address
                        })
                        // console.log(this.state)
                        alert('Update successfully!')
                    } else if (response.data.status === 1) {
                        alert('Updated failed')
                    }
                },
                error => { console.log('fail: ', error) }
            )
        }
    }
    
    search_data = () => {
        return (keyword) => {
            let data = {'keywords': keyword}
            axios.post('/api/search', data).then(
                response => {
                    if (response.data.items.length === 0){
                        alert("Please enter keywords like Men, Coat or Blue!")
                    }
                    else {
                        console.log('???',response.data.items)
                        this.props.history.push({
                            pathname: '/main',
                            state: { state: response.data.items}
                        })
                    }
                },
                error => {console.log('failed', error)}
            )
        }
    }
    
    
    render() {
        return (
            <div>
                <HeaderAfterLogin searchfunc={this.search_data()}/>
                <div id="contentCon">
                	<div className="left">
                        <img src={this.state.pict} style={{width:'100px',height:'100px',borderRadius:'50%',margin:'50px 85px auto',display:'block'}}/>
                    	
                        <p>{this.state.name}</p>
                        <label for="uploadImage" style={{color:'black', background:'#D3D3D3', width:'100px', height:'25px'}}>Upload file</label>
                        <input type="file" id="uploadImage" hidden="hidden" onChange={this.upload_photo}/>
                        
                        
                        <br/>
                        <span></span>
                        <ul>
                        	<li><NavLink id='info' to={{pathname:'/userinfo/baseinfo', fun:{handleSubmit:this.handleSubmit()}, state:{info:{...this.state}}}} activeClassName="my">User Info</NavLink></li>
                            <li><NavLink activeClassName="my" to="/userinfo/myorder">My order</NavLink></li>
                        </ul>
                    </div>
                    
                    <Switch>
                        <Route path='/userinfo/baseinfo' component={UserInfo}/>
                        <Route path='/userinfo/myorder' component={YourOrder}/>
                        <Redirect to='/userinfo/baseinfo'></Redirect>
                    </Switch>
                    
                    {/* <!--footer--> */}
                    <div id="footCon">
                        <li>
                            <p>Copyright © 2021 .All Rights Reserved.</p>
                            <span>Copyright Fantastic</span>
                        </li>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        userid:state.isLogin[1]
    }),
    {}
)(User)

