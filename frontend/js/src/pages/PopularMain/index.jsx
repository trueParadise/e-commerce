import React, { Component } from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import HeaderAfterLogin from '../../components/HeaderAfterLogin'
import HeaderBeforeLogin from '../../components/HeaderBeforeLogin'

class PopularMain extends Component {

    state = {
        keyword:'',
        id:[],
        name:[],
        price:[],
        stock:[],
        picture:[],
        label:[],
        detail:[]
    }
    
    initsate = () => {
        this.setState({
            keyword:'',
            id:[],
            name:[],
            price:[],
            stock:[],
            picture:[],
            label:[],
            detail:[]
        })
    }
    
    fetch_data = (cat) => {
        let data = {'category':cat}
        axios.post('/api/get_item_by_category', data).then(
            response => {
                this.initsate()
                for(let i = 0; i < response.data.items.length; i++) {
                    this.setState(prevState =>(
                        {
                            keyword:cat,
                            id: [...prevState.id, response.data.items[i].id],
                            name: [...prevState.name, response.data.items[i].name],
                            price: [...prevState.price, response.data.items[i].price],
                            stock: [...prevState.stock, response.data.items[i].stock],
                            picture: [...prevState.picture, response.data.items[i].picture],
                            label: [...prevState.label, response.data.items[i].label],
                            detail: [...prevState.detail, response.data.items[i].detail],
                        }
                    ))
                }
            },
            error => { console.log('fail: ', error) }
        )
    }

    componentDidMount() {
        this.fetch_data('Women')
    }
    
    
    
    render() {
        return (
            <div>
                {/* <!--header--> */}
                {
                    this.props.isLogin
                    ?<HeaderAfterLogin/>
                    :<HeaderBeforeLogin/>
                }
                
                
            </div>
        )
    }
}


export default connect(
    state => ({
        isLogin:state.isLogin[0]
    }),
    {}
)(PopularMain)