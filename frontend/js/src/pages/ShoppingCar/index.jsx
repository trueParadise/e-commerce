import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import ItemsInCart from '../../components/ItemsInCart'
import HeaderAfterLogin from '../../components/HeaderAfterLogin'
import ShoppingCartCSS from './index.module.css'


class ShoppingCar extends Component {

    state = {
        Items:[],
        Check:[],
        Num:[]
    }
    
    change_checked_state = (i, status) => {
        return () => {
            // this.state.Check[i] = ! status
            let check = this.state.Check
            check[i] = ! status
            this.setState({Check: check})
            this.setState({Check:this.state.Check})
        }
    }
    
    componentDidMount() {
        let data = {'id':this.props.isLogin[1]}
        axios.post('/api/my_cart', data).then(
            response => {
                var num = []
                for (let i = 0; i < response.data.cart.length; i++){
                    num.push(parseInt(response.data.cart[i].amount))
                }
                this.setState({
                    Items:[...response.data.cart], 
                    Check: Array(response.data.cart.length).fill(false),
                    Num: num
                })
            },
            error => { console.log('fail', error)}
        )
    }
    
    delete_item = (userId, cartId) => {
        return () => {
            if(window.confirm('Are you sure you want to delete this item?')) {
                let data_1 = {
                    cartid:cartId,
                    userid:userId
                }
                axios.post('/api/del_cart', data_1).then(
                    response => {
                        console.log('/api/del_cart', response.data)
                    },
                    error => {console.log('fail', error)}
                )
                
                let data = {'id':this.props.isLogin[1]}
                axios.post('/api/my_cart', data).then(
                    response => {
                        console.log('/api/my_cart', response.data.cart)
                        this.setState({Items:[...response.data.cart]})
                    },
                    error => {console.log('fail', error)}
                )
            }
        }
    }
    
    count = (arr) => {
        return () => {
            let c = 0
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === true) {
                    c += 1
                }
            }
            return c
        }
    }
    
    sum = (arr) => {
        
        return () => {
            let s = 0
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === true) {
                    s = s + parseInt(this.state.Items[i].price) * this.state.Num[i]
                }
            }
            return s
        }
    }
    
    get_child_data = (i, state) => {
        let arr = this.state.Num
        arr[i] = state
        this.setState({Num:arr})
    }
    
    pay = () => {
        return () => {
            let n = 0
            let index = 0
            for (let i = 0; i < this.state.Check.length; i++) {
                if (this.state.Check[i] === true) {
                    n += 1
                    index = i
                }
            }
            if (n > 1) {
                alert('You have to checkout item one by one.')
                return 
            } 
            let data = {
                'userid': this.state.Items[index]['userid'],
                'cartid': this.state.Items[index]['id'],
                'itemid': this.state.Items[index]['itemid'],
                'amount': this.state.Num[index],
                'size': this.state.Items[index]['size'],
                'totalPrice': this.sum(this.state.Check)(),
            }
            axios.post('/api/payment', data).then(
                response => {
                    if (response.data.status === 0) {
                        alert("Purchase at a discounted price!")
                        
                        let data_1 = {'id':this.props.isLogin[1]}
                        axios.post('/api/my_cart', data_1).then(
                            response => {
                                var num = []
                                for (let i = 0; i < response.data.cart.length; i++){
                                    num.push(parseInt(response.data.cart[i].amount))
                                }
                                this.setState({
                                    Items:[...response.data.cart], 
                                    Check: Array(response.data.cart.length).fill(false),
                                    Num: num
                                })
                            },
                            error => { console.log('fail', error)}
                        )
                        
                    } else if (response.data.status === -1) {
                        alert("Apologize for lacking of stock! We will replenish stock as soon as possible!")
                    } else {
                        alert("Fail to purchase item!")
                    }
                },
                error => {console.log('failed', error)}
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
                {/* 页头 */}
                <HeaderAfterLogin searchfunc={this.search_data()}/>
                <div id={ShoppingCartCSS.contentCon}>
                	<ul>
                    	<li>
                            <span></span>
                        </li>
                    </ul>
                    <br/>
                    <br/>
                    <section className={ShoppingCartCSS.cartMain}>
                        <div className={ShoppingCartCSS.cartMain_hd}>
                            <ul className={ShoppingCartCSS.order_lists + ' ' + ShoppingCartCSS.cartTop}> 
                                <li className={ShoppingCartCSS.list_chk}>
                                    <input type="checkbox" id="all" className="whole_check"/>
                                    <label for="all"></label>
                                    Select
                                </li>
                                <li className={ShoppingCartCSS.list_con}>Item information</li>
                                <li className={ShoppingCartCSS.list_info}>Item Detail</li>
                                <li className={ShoppingCartCSS.list_price}>Unit Price</li>
                                <li className={ShoppingCartCSS.list_amount}>Quantity</li>
                                <li className={ShoppingCartCSS.list_sum}>Total</li>
                                <li className={ShoppingCartCSS.list_op}>Operation</li>
                            </ul>
                        </div>
                        {/* 物品 */}
                        <div className={ShoppingCartCSS.cartBox}>
                            <div className={ShoppingCartCSS.order_content}>
                                {
                                    this.state.Items.map((item, i) => {
                                        return (<ItemsInCart
                                        k={i} 
                                        item={item} 
                                        ischeck={this.state.Check[i]} 
                                        delete_item={this.delete_item} 
                                        onChange={this.get_child_data}
                                        change_state={this.change_checked_state(i, this.state.Check[i])}/>
                                        )
                                    })
                                }
                            </div>
                        </div>
        
                        {/* <!-- 付款--> */}
                        <div className={ShoppingCartCSS.bar_wrapper}>
                            <div className={ShoppingCartCSS.bar_right}>
                                <div className={ShoppingCartCSS.piece}>Items have selected<strong className={ShoppingCartCSS.piece_num}>{ 
                                    this.count(this.state.Check)() 
                                }</strong></div>
                                <div className={ShoppingCartCSS.totalMoney}>Total: <strong className={ShoppingCartCSS.total_text}>{this.sum(this.state.Check)()}</strong></div>
                                <button style={{margin:'0px 0px 10px 10px', width:'80px', height:'48px', fontSize:20}} onClick={this.pay()}>Pay</button>
                            </div>
                        </div>
                    </section>
                    <section className={ShoppingCartCSS.model_bg}></section>
                    <section className={ShoppingCartCSS.my_model}>
                        <p className={ShoppingCartCSS.title}>Delete Items<span className={ShoppingCartCSS.closeModel}>X</span></p>
                        <p>Are you sure you want to delete this item?</p>
                        <div className={ShoppingCartCSS.opBtn}><a className={ShoppingCartCSS.dialog_sure}>Yes</a><a className={ShoppingCartCSS.dialog_close}>Close</a></div>
                    </section>
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
)(ShoppingCar)
