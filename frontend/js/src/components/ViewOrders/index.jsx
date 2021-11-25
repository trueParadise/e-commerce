import React, { Component } from 'react'
import { Table} from 'antd';
import axios from "axios";
const { Column} = Table;

// const data = []
// for (let i = 0; i < 20; i++){
//   data.push({
//     key: i,
//     order_number: 12345,
//     user_account: 98712,
//     status: 'shipping',
//     items: ['clothes', 'T-shirts'],
//     payment_time:"2021-09-19 16:23:11",
//   })
// }


export default class ViewOrder extends Component {
    state = {
        data: []
    }

    componentDidMount() {
        axios.get('/api/all_orders').then(
            response => {
                if (response.data.status === 0){
                    let orders = response.data.orders
                    const all_orders = []
                    for (let i = 0; i < orders.length; i++) {
                        all_orders.push({
                            key: orders[i]['id'],
                            order_number: orders[i]['id'],
                            user_account: orders[i]['userid'],
                            size: orders[i]['size'],
                            item_price: orders[i]['totalPrice'],
                            payment_time: orders[i]['time'],
                        })
                    }
                    this.setState({
                        data: all_orders
                    })
                } else {
                    alert("Fail to check orders of the website!")
                }
            }
        )
    }

    render() {
        return (
            <Table dataSource={this.state.data} pagination={{ pageSize: 10 }} scroll={{ y: 700 }}>
                <Column title="Order Number" dataIndex="order_number" key="order_number"/>
                <Column title="User Account" dataIndex="user_account" key="user_account" />
                <Column title="Size" dataIndex="size" key="size"/>
                <Column
                  title="Item Price"
                  dataIndex="item_price"
                  key="item_price"
                  // render={tags => (
                  //   <>
                  //     {tags.map(tag => (
                  //       <Tag color="blue" key={tag}>
                  //         {tag}
                  //       </Tag>
                  //     ))}
                  //   </>
                  // )}
                />
                <Column title="payment Time" dataIndex="payment_time" key="payment_time"/>
                {/*<Column*/}
                {/*  title="Action"*/}
                {/*  key="action"*/}
                {/*  render={(text, record) => (*/}
                {/*    <Space size="middle">*/}
                {/*      <a>Delete</a>*/}
                {/*    </Space>*/}
                {/*  )}*/}
                {/*/>*/}
            </Table>
        )
    }
}
