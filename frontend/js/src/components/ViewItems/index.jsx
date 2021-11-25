import React, { Component } from 'react'
import { Table, Tag, Space, Layout, Menu} from 'antd';
import axios from "axios";
const { Column, ColumnGroup } = Table;

export default class ViewItems extends Component {
    state = {
        data: []
    }

    componentDidMount() {
        axios.get('/api/item_list').then(
            response => {
                if (response.data.status === 0){
                    const all_items = []
                    let items = response.data.items
                    for (let i = 0; i < items.length; i++) {
                        all_items.push({
                            key: items[i]['id'],
                            name: items[i]['name'],
                            price: items[i]['price'],
                            stock: Object.keys(items[i]['stock']).map((k, v)=>{
                              return `${parseInt(k)}:${parseInt(v)} | `
                            }),
                            tags: [items[i]['label'].split(",")[0], items[i]['label'].split(",")[1]],
                            detail: items[i]['detail'],
                        })
                    }
                    this.setState({
                        data: all_items
                    })
                } else {
                    alert("Fail to check orders of the website!")
                }
            }
        )
    }
    
    delete

    render() {
        return (
            <Table dataSource={this.state.data} pagination={{ pageSize: 10 }} scroll={{ y: 700 }}>
                <Column title="Name" dataIndex="name" key="name"/>
                <Column title="Price" dataIndex="price" key="price" />
                <Column title="Stock" dataIndex="stock" key="stock"/>
                <Column
                  title="Tags"
                  dataIndex="tags"
                  key="tags"
                  render={tags => (
                    <>
                      {tags.map(tag => (
                        <Tag color="blue" key={tag}>
                          {tag}
                        </Tag>
                      ))}
                    </>
                  )}
                />
                <Column title="Detail" dataIndex="detail" key="detail"/>
                <Column
                  title="Action"
                  key="action"
                  render={(text, record) => (
                    <Space size="middle">
                      <a>Delete</a>
                    </Space>
                  )}
                />
            </Table>
        )
    }
}
