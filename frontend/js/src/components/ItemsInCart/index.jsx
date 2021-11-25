import React, { Component } from 'react'
import ItemsInCartCSS from './index.module.css'

export default class ItemsInCart extends Component {

    state = {
        quantity:0
    }
    
    componentDidMount() {
        this.setState({quantity:parseInt(this.props.item.amount)})
    }
    
    increase = () => {
        this.setState({quantity:this.state.quantity+1}, ()=>{
            this.props.onChange(this.props.k, this.state.quantity)
        })
    }
    
    decrease = () => {
        if (this.state.quantity-1 > 0) {
            this.setState({quantity:this.state.quantity-1}, ()=>{
                this.props.onChange(this.props.k, this.state.quantity)
            })
        } else {
            this.props.delete_item(this.props.item.userid, this.props.item.id)()
        }
    }
    
    render() {
        return (
            <>
                <ul className={ItemsInCartCSS.order_lists}>
                    <li className={ItemsInCartCSS.list_chk}>
                        <input 
                        type="radio"
                        checked={this.props.ischeck}
                        onClick={this.props.change_state}
                        style={{margin:'50px 25px'}}/>
                    </li>
                    <li className={ItemsInCartCSS.list_con}>
                        <div className={ItemsInCartCSS.list_text}>{this.props.item.item_name}</div>
                    </li>
                    <li className={ItemsInCartCSS.list_info}>
                        <p>Colour:{' '+this.props.item.item_color}</p>
                        <p>Size:{' '+this.props.item.size}</p>
                    </li>
                    <li className={ItemsInCartCSS.list_price}>
                        <p className={ItemsInCartCSS.price}>{'$'+this.props.item.price}</p>
                    </li>
                    <li className={ItemsInCartCSS.list_amount}>
                        <div className={ItemsInCartCSS.amount_box}>
                            <a className={ItemsInCartCSS.reduce_reSty} onClick={this.decrease}>-</a>
                            <input type="text" value={this.state.quantity} className={ItemsInCartCSS.sum}/>
                            <a className={ItemsInCartCSS.plus}  onClick={this.increase}>+</a>
                        </div>
                    </li>
                    <li className={ItemsInCartCSS.list_sum}>
                        <p className={ItemsInCartCSS.sum_price}>{'$'+this.props.item.price * this.state.quantity}</p>
                    </li>
                    <li className={ItemsInCartCSS.list_op}>
                        <p className={ItemsInCartCSS.del}><a onClick={this.props.delete_item(this.props.item.userid, this.props.item.id)} className={ItemsInCartCSS.delBtn}>Remove Item(s)</a></p>
                    </li>
                </ul>
            </>
        )
    }
}
