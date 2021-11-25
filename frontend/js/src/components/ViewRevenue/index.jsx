import React, { Component } from 'react'
import axios from 'axios'
import { Column  } from '@ant-design/charts';


// let data = [
//     {
//       type: 'totalUsers',
//       number: parseInt('38'),
//     },
//     {
//       type: 'totalItems',
//       number: parseInt('54'),
//     },
//     {
//       type: 'totalOrders',
//       number: parseInt('153'),
//     },
//     {
//       type: 'totalSales',
//       number: parseInt('37'),
//     },
// ];
//
// const config = {
//     data,
//     xField: 'type',
//     yField: 'number',
//     label: {
//       position: 'middle',
//       style: {
//         fill: '#FFFFFF',
//         opacity: 0.6,
//       },
//     },
//     meta: {
//       type: { alias: 'Category' },
//       number: { alias: 'Data' },
//     },
// };
const data = []

export default class ViewRevenue extends Component {

    state = {
        data: [],
        config: {}
    }

    componentDidMount() {
        axios.get('/api/view_income').then(
            response => {
                if (response.data.status === 0){
                    let sales = response.data.sales_situation[0]
                    data.push(
                        {
                            type: 'totalUsers',
                            number: parseInt(sales['totalUsers'])
                        }
                    )
                    data.push(
                        {
                            type: 'totalItems',
                            number: parseInt(sales['totalItems'])
                        }
                    )
                    data.push(
                        {
                            type: 'totalOrders',
                            number: parseInt(sales['totalOrders'])
                        }
                    )
                } else {
                    alert("Fail to check revenue of our website!")
                }
            }
        )
    }

    render() {
        const config = {
            data: data,
            xField: 'type',
            yField: 'number',
            label: {
                position: 'middle',
                style: {
                    fill: '#FFFFFF',
                    opacity: 0.6,
                },
            },
            meta: {
                type: { alias: 'Category' },
                number: { alias: 'Data' },
            },
        };
        return (
            <div style={{ margin: '100px 50px 0'}}>
                <h3 style={{ textAlign: 'center'}}>Situation</h3>
                {/*<Line {...config} />*/}
                <Column {...config} />
            </div>
        )
    }
}
