import React, { Component } from 'react'
import {connect} from 'react-redux'
import axios from 'axios'
import {Link} from 'react-router-dom'
import HeaderBeforeLogin from '../../components/HeaderBeforeLogin'
import HeaderAfterLogin from '../../components/HeaderAfterLogin'
import MainCss from './index.module.css'
const qs = require('querystring');
class Main extends Component {

    state = {
        id:[],
        name:[],
        price:[],
        stock:[],
        picture:[],
        label:[],
        detail:[],
        items: []
    }

    initsate = () => {
        this.setState({
            id:[],
            name:[],
            price:[],
            stock:[],
            picture:[],
            label:[],
            detail:[],
            items: []
        })
    }
    
    search_data = () => {
        return (keyword) => {
            let data = {'keywords': keyword}
            axios.post('/api/search', data).then(
                response => {
                    this.initsate()
                    if (response.data.items.length === 0){
                        alert("Please enter keywords like Men, Coat or Blue!")
                    }
                    this.setState({
                        items: response.data.items.length >=4? response.data.items.slice(0,4) : response.data.items
                    })
                },
                error => {console.log('failed', error)}
            )
        }
    }

    fetch_data = (cat) => {
        let data = {'category':cat, 'userid':this.props.userid}
        axios.post('/api/get_item_by_category', data).then(
            response => {
                this.initsate()
                if (response.data.items.length === 0){
                    alert("These category has no data!")
                }
                this.setState({
                    items: response.data.items.length >=4? response.data.items.slice(0,4) : response.data.items
                })
            },
            error => { console.log('fail: ', error) }
        )
    }

    componentWillReceiveProps(nextProps) {
        const {search} = nextProps.location
        const category = qs.parse(search.slice(1))
        this.fetch_data(category['search'])
    }
    
    componentDidMount() {
        if (this.props.location.state !== undefined && this.props.location.search === '') {
            this.initsate()
            this.setState({
                items: this.props.location.state.state.length >=4? this.props.location.state.state.slice(0,4) : this.props.location.state.state
            })
            return
        } 
        const {search} = this.props.location
        const category = qs.parse(search.slice(1))
        this.fetch_data(category['search'])
    }

    render() {
        return (
            <div>
                {/* <!--header--> */}
                {
                    this.props.isLogin
                    ?<HeaderAfterLogin searchfunc={this.search_data()}/>
                    :<HeaderBeforeLogin searchfunc={this.search_data()}/>
                }
                {/* <!--content--> */}

                <div className={MainCss.contentCon} style={{marginTop:-85}}>
                    <div className={MainCss.t1} style={{marginBottom:60}}>
                        <ol>
                            <li className={MainCss.pict1} style={{height: 470}}>
                                <a></a>
                            </li>
                            <li className={MainCss.pict3} style={{height:600}}>
                                <a style={{marginTop:40, height:500}}></a>
                            </li>
                        </ol>
                    </div>
                    <ol>
                        {
                            this.state.items.map((ele,index)=>{
                                if (this.state.items.length > 0){
                                    return (
                                        <li>
                                            <Link to={`/item_detail?id=${ele['id']}`}>
                                                <img
                                                src={ele['picture'] ?  ele['picture'][0]['base64'] : 'loading..'}
                                                style={{width:'280px',height:'350px',borderRadius:'50%',margin:'0 auto',display:'block'}}
                                                />
                                            </Link>
                                            <p style={{marginLeft:60, marginBottom:30, fontFamily:'Cursive'}}>{ele['name'] ? ele['name'] : 'loading...'}</p>
                                            <div>
                                                <span style={{fontFamily:'Cursive'}}>Recommend</span>
                                            </div>
                                        </li>
                                    )
                                } else if (this.state.items.length === 0){
                                    return(
                                        <p>Has no data!</p>
                                    )
                                }
                            })
                        }
                    </ol>
                    <div className={MainCss.t1}>
                        <ol>
                            <li className={MainCss.pict2}>
                                <div className={MainCss.container}>
                                    <a className={MainCss.pict2_2}></a>
                                    <a className={MainCss.pict2_1}></a>
                                </div>
                            </li>
                            <li className={MainCss.pict4}>
                                <a></a>
                            </li>
                            <li className={MainCss.pict5}>
                                <a></a>
                            </li>
                            <li className={MainCss.pict6}>
                                <a></a>
                            </li>
                        </ol>
                    </div>
                </div>
                {/* <!--footer--> */}
                <div id="footCon">
                    <li>
                        <p>Copyright © 2021 .All Rights Reserved.</p>
                        <span>Copyright Fantastic</span>
                    </li>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        isLogin:state.isLogin[0],
        userid:state.isLogin[1]
    }),
    {}
)(Main)

