import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import { connect } from 'react-redux'
import {logout} from '../../redux/actions/login'

class HeaderAfterLoginOfAdmin extends Component {

    logout =() => {
        this.props.logout('')
    }

    render() {
        return (
            <div className="headCon">
            	<div>
                    <p><Link to="/main">Admin page</Link></p>
                    <ol>
                        {/*<Link to="/userinfo">My account</Link>*/}
                        {/*<Link to="/shoppingCar">MY cart</Link>*/}
            			<Link onClick={this.logout} to='/main'>Log out</Link>
                    </ol>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        isLogin:state.isLogin[0]
    }),
    {logout}
)(HeaderAfterLoginOfAdmin)
