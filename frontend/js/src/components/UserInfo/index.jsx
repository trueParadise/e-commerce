import React, { Component } from 'react'



export default class UserInfo extends Component {
    
    handleSubmit = (event) => {
        event.preventDefault()
        this.props.location.fun.handleSubmit(this)
    }
    
    render() {
        return (
            <div className="right">
            	<ul>
            		<p>User Info</p>
                    <span></span>
                </ul>
                <div>
                    <ol>
                        <li>Name</li>
                        <li>Address</li>
                        <li>Gender</li>
                        <li>E-mail address</li>
                        <li>Interest</li>
                    </ol>
                    <ul>
                        <form action="#" method="post"  onSubmit={this.handleSubmit}>
                            <div>
                                <input ref = {c => this.username = c} type="text" placeholder={(this.props.location.state !== undefined) ? this.props.location.state.info.name : 'loading...'}/>
                            </div>
                            <div>
                                <input ref = {c => this.address = c} type="text" placeholder={(this.props.location.state !== undefined) ? this.props.location.state.info.address : 'loading...'}/>
                            </div>
                            <ol>
                                <select ref={c => this.gender = c}>
                                    <option value="#">{(this.props.location.state !== undefined) ? this.props.location.state.info.gender : 'loading...'}</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </ol>
                            <p ref={c => this.email = c}>{(this.props.location.state !== undefined) ? this.props.location.state.info.email : 'loading...'}</p>
                            <li>
                                <span>Interest 1</span>
                                <select ref={c => this.interest_1 = c}>
                                    <option value="#">{(this.props.location.state !== undefined) ? this.props.location.state.info.interest[0] : 'loading...'}</option>
                                    <option value="T-shrit">T-shrit</option>
                                    <option value="Dress">Dress</option>
                                    <option value="Sweater">Sweater</option>
                                    <option value="Coat">Coat</option>
                                    <option value="Skirt">Skirt</option>
                                </select>
                                <span>       </span>
                                <span>Interest 2</span>
                                <select ref={c => this.interest_2 = c}>
                                    <option value="#">{(this.props.location.state !== undefined) ? this.props.location.state.info.interest[1] : 'loading...'}</option>
                                    <option value="Red">Red</option>
                                    <option value="Yellow">Yellow</option>
                                    <option value="Pink">Pink</option>
                                    <option value="White">White</option>
                                    <option value="Blue">Blue</option>
                                    <option value="Black">Black</option>
                                    <option value="Green">Green</option>
                                </select>
                            </li>
                            <button>Save</button>
                        </form>
                    </ul>
                </div>
                <span></span>
            </div>
        )
    }
}


