import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import qs from 'querystring'
import HeaderAfterLogin from "../../components/HeaderAfterLogin";
import HeaderBeforeLogin from "../../components/HeaderBeforeLogin"

class Item extends Component{
    state = {
        id: '',
        name: '',
        detail: '',
        label: '',
        type: '',
        picture: [{'url':'', 'base64':''}, {'url':'', 'base64':''}, {'url':'', 'base64':''}, {'url':'', 'base64':''}, {'url':'', 'base64':''}],
        price: '',
        stock: [],
        size: [],
        purchase_amount: '1',
    }

    componentDidMount() {
        let {search} = this.props.location
        let id = qs.parse(search.slice(1)).id
        axios.get('/api/item/'+id).then(
            response => {
                if (response.data.status === 0) {
                    let size = []
                    for (let key in response.data.item.stock){
                        if (response.data.item.stock.hasOwnProperty(key)){
                           size.push(key)
                        }
                    }
                    this.setState({
                        detail: response.data.item.detail,
                        id: id,
                        label: response.data.item.label.split(','),
                        name: response.data.item.name,
                        picture: [...response.data.item.picture],
                        price: response.data.item.price,
                        stock: response.data.item.stock,
                        type: response.data.item.type,
                        size: size
                    })
                } else {
                    alert("Fail to acquire item detail!")
                }
            }
        )
    }

    increase = () => {
        if (parseInt(this.state.purchase_amount) + 1 <= 10){
            this.setState({
                purchase_amount: (parseInt(this.state.purchase_amount) + 1).toString()
            })
        }
    }

    decrease = () => {
        if (parseInt(this.state.purchase_amount) - 1 >= 1){
            this.setState({
                purchase_amount: (parseInt(this.state.purchase_amount) - 1).toString()
            })
        }
    }

    prop = (name) => {
        return (obj) => {
            return obj[name];
        };
    }

    map = (fn, list) => {
        let ret = [];
        for (let i = 0; i < list.length; ++i) {
            ret[i] = fn(list[i]);
        }
        return ret;
    }

    is_login = () => {
        if (this.props.isLogin[0] === false) {
            return false
        }
        return true
    }

    add_to_cart = () => {
        if (this.is_login() === false) {
            this.props.history.push("/login")
            return
        }
        let AllSize = document.getElementsByTagName("option")
        let select = this.map(this.prop('selected'), AllSize)
        let size = this.map(this.prop('innerHTML'), AllSize)
        let needSize = ''
        for (let i = 0; i < select.length; i++){
            if (select[i] === true){
                needSize = size[i]
                break
            }
        }
        let data = {
            'userid': this.props.isLogin[1],
            'itemid': this.state.id,
            'size': needSize,
            'amount': this.state.purchase_amount,
            'price': this.state.price,
            'item_color': this.state.label[1],
            'item_name': this.state.name
        }
        axios.post('/api/add_cart', data).then(
            response => {
                if (response.data.status === 0){
                    alert("The item has been added to your cart!")
                } else if (response.data.status === -1){
                    alert("Apologize for lacking of stock! We will replenish stock as soon as possible!")
                } else {
                    alert("Fail to add item to cart!")
                }
            }
        )
    }

    payment = () => {
        if (this.is_login() === false) {
            this.props.history.push("/login")
            return
        }
        let AllSize = document.getElementsByTagName("option")
        let select = this.map(this.prop('selected'), AllSize)
        let size = this.map(this.prop('innerHTML'), AllSize)
        let needSize = ''
        for (let i = 0; i < select.length; i++){
            if (select[i] === true){
                needSize = size[i]
                break
            }
        }
        let data = {
            'userid': this.props.isLogin[1],
            'itemid': this.state.id,
            'size': needSize,
            'amount': this.state.purchase_amount,
            'totalPrice': (parseInt(this.state.price) * parseInt(this.state.purchase_amount)).toString()
        }
        axios.post('/api/payment', data).then(
            response => {
                if (response.data.status === 0){
                    console.log('@',response.data)
                    alert("Purchase at a discounted price!")
                } else if (response.data.status === -1){
                    alert("Apologize for lacking of stock! We will replenish stock as soon as possible!")
                } else {
                    alert("Fail to purchase item!")
                }
            }
        )
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
                {/* <!--header--> */}
                {
                    this.props.isLogin[0]
                    ?<HeaderAfterLogin searchfunc={this.search_data()}/>
                    :<HeaderBeforeLogin searchfunc={this.search_data()}/>
                }
                {/* <HeaderAfterLogin/> */}
                <div id="contentCon">
                    <ul>
                        <li>{this.state.type}'s wear</li>
                    </ul>
                    <div id="show">
                        <div>
                            <ul>
                                <li><img src={this.state.picture ?  this.state.picture[1]['base64'] : 'loading..'} style={{width:124, height:114}}/></li>
                                <li className="pic02"><img src={this.state.picture ?  this.state.picture[2]['base64'] : 'loading..'} style={{width:124, height:114}}/></li>
                                <li className="pic03"><img src={this.state.picture ?  this.state.picture[3]['base64'] : 'loading..'} style={{width:124, height:114}}/></li>
                                <li className="pic04"><img src={this.state.picture ?  this.state.picture[4]['base64'] : 'loading..'} style={{width:124, height:114}}/></li>
                            </ul>
                            <ol><img src={this.state.picture ?  this.state.picture[0]['base64'] : 'loading..'} style={{width:486, height:486}}/></ol>
                        </div>
                        <div className="right">
                            <p>{this.state.name}</p>
                            <div>
                                <ul>
                                    <span></span>
                                    <h2>${this.state.price}</h2>
                                </ul>
                                <ol></ol>
                                <li>
                                    <p>{this.state.label[0]}</p>
                                    <p>{this.state.label[1]}</p>
                                </li>
                            </div>
                            <ul>
                                <select>
                                    {
                                        this.state.size.map((ele,index)=>{
                                            return(
                                              <option key={index} selected=''>{ele}</option>
                                            )
                                        })
                                   }
                                </select>
                            </ul>
                            <ul>
                                <div id='Amount'>
                                    <input style={{ cursor: "pointer" }} type="button" value='-' onClick={this.decrease}/>
                                    <input id='num' type="button" value={this.state.purchase_amount}/>
                                    <input style={{ cursor: "pointer" }} type="button" value='+' onClick={this.increase}/>
                                </div>
                            </ul>
                            <ul>
                                <a className="buy" onClick={this.payment}>Pay now</a>
                                <a className="car" onClick={this.add_to_cart}>Add to cart</a>
                            </ul>
                        </div>
                    </div>
                    <div id="details">
                        <ul>
                            <div>
                            <p>CLOTHES</p>
                                <span></span>
                            </div>
                            <p>D&nbsp;e&nbsp;t&nbsp;a&nbsp;i&nbsp;l&nbsp;s</p>
                            <span></span>
                        </ul>
                        <ol>
                            <li>
                                <div>
                                    <p>Name</p>
                                    <span>{this.state.name}</span>
                                </div>
                            </li>
                            <li>
                                <div className="text02">
                                    <p>Brand</p>
                                    <span>Fantastic</span>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>Colour</p>
                                    <span>{this.state.label[1]}</span>
                                </div>
                            </li>
                            <li>
                            <div>
                                <p>Raw Material</p>
                                <span>Pure Cotton</span>
                            </div>
                            </li>
                        </ol>
                    </div>
                    <div id="origin">
                        <ul>
                            <div>
                                <p>CLOTHES</p>
                                <span></span>
                            </div>
                            <p>O&nbsp;r&nbsp;i&nbsp;g&nbsp;i&nbsp;n</p>
                            <span></span>
                        </ul>
                        <ol>
                            <li><img src={this.state.picture ?  this.state.picture[0]['base64'] : 'loading..'} style={{width:550, height:600}}/></li>
                            <div style={{fontFamily:'Cursive'}}>{this.state.detail}</div>
                        </ol>
                    </div>
                    <div id="show">
                        <ul>
                            <div>
                            <p>CLOTHES</p>
                                <span></span>
                            </div>
                            <p>S&nbsp;h&nbsp;o&nbsp;w</p>
                            <span></span>
                        </ul>
                        <ol>
                            <li><img src={this.state.picture ?  this.state.picture[0]['base64'] : 'loading..'} style={{width:550, height:600, marginLeft:325}}/></li>
                            <div>
                                <li><img src={this.state.picture ?  this.state.picture[1]['base64'] : 'loading..'} style={{width:450, height:500,marginLeft:75,marginRight:75}}/></li>
                                <span><img src={this.state.picture ?  this.state.picture[2]['base64'] : 'loading..'} style={{width:450, height:500,marginLeft:75,marginRight:75}}/></span>
                                <ul><img src={this.state.picture ?  this.state.picture[3]['base64'] : 'loading..'} style={{width:450, height:500,marginLeft:75,marginRight:75}}/></ul>
                                <a><img src={this.state.picture ?  this.state.picture[4]['base64'] : 'loading..'} style={{width:450, height:500,marginLeft:75,marginRight:75}}/></a>
                            </div>
                        </ol>
                    </div>
                    <div id="bactop">
                        <p><a href="#top">TOP</a></p>
                    </div>
                </div>
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
        isLogin:state.isLogin
    }),
    {}
)(Item)

