import React, { Component } from 'react'
import YourOrderCss from './index.module.css'
import axios from "axios";
import {connect} from 'react-redux'
import { Modal} from 'antd';
import { Rate } from 'antd';
import { Input } from 'antd';

const { TextArea } = Input;


class YourOrder extends Component {
    state = {
        my_orders: [],
        isShow: false,
        value:0,
        order_id:'',
        item_id:'',
        comment:''
    }

    componentDidMount() {
        let data = {'id': this.props.userid}
        axios.post('/api/my_order', data).then(
            response => {
                if (response.data.status === 0){
                    if(response.data.order.length === 0) {
                        alert("You don't have order!")
                    }
                    console.log('@@', response.data)
                    this.setState({
                        my_orders: response.data.order
                    })
                } else {
                    alert("Fail to check my orders!")
                }
            }
        )
    }


    handleOk = () => {
        let data = {
            'userid': this.props.userid,
            'itemid': this.state.item_id,
            'orderid': this.state.order_id,
            'rating': this.state.value,
            'comment': this.state.comment
        }
        console.log('aaa',data)
        this.setState({isShow:false, value:0})
        axios.post('/api/add_review', data).then(
            response => {
                if (response.data.status === 0) {
                    alert('rating successfully!')
                } else if (response.data.status === 1) {
                    alert('rating failed')
                }
            },
            error => {console.log('fail: ', error)}
        )
    };

    handleCancel = () => {
        this.setState({isShow:false, value:0})
    };

    handleChange = (value) => {
        this.setState({value})
    }



    add_comment = (order_id, item_id) => {
        return () => {
            this.setState({isShow:true, order_id, item_id})
        }
    }

    getInput = (input) => {
        this.setState({comment:input})
    }

    render() {
        return (
            <div className={YourOrderCss.contentCon}>
                <div className={YourOrderCss.right}>
                <>
                  <Modal title="Comment" visible={this.state.isShow} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <TextArea rows={4} onChange={e => this.getInput(e.target.value)}/>
                    <Rate value={this.state.value} onChange={this.handleChange}/>
                  </Modal>
                </>
                	<ul>
                    	<li className={YourOrderCss.all}>All order</li>
                    </ul>
                    {
                        this.state.my_orders.map((ele,index)=>{
                            return(
                                <div>
                                    <ol>
                                        <p>{ele['time']}&nbsp;&nbsp;&nbsp;&nbsp;Order number: {ele['id']}</p>
                                        <a href="#"></a>
                                    </ol>
                                    <div>
                                        <li>
                                            <img
                                                src={ele['item_info']['picture'] ?  ele['item_info']['picture'][0]['base64'] : 'loading..'}
                        	                    style={{width:'150px',height:'160px',margin:'auto',display:'block'}}
                                            />
                                        </li>
                                        <ul>
                                            <li style={{width:'35%'}}>
                                                <p>{ele['item_info']['name']}</p>
                                                <span>colour: {ele['item_info']['colour']}</span>
                                            </li>
                                            <li style={{width:'5%'}} className={YourOrderCss.price}>${ele['item_info']['price']}.00</li>
                                            <li style={{width:'5%'}} className={YourOrderCss.price}>x{ele['amount']}</li>
                                            <button style={{width:'25%', marginTop: '70px', marginRight: '20px'}} onClick={this.add_comment(ele['id'], ele['itemid'])}>comment</button>
                                        </ul>
                                    </div>
                                </div>
                            )
                        })
                    }
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
)(YourOrder)