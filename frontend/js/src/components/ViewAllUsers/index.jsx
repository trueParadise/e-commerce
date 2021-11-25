import React, { Component } from 'react'
import { Table, Tag } from 'antd';
import axios from "axios";
const { Column } = Table;

export default class ViewAllUser extends Component {
    state = {
        data: []
    }

    componentDidMount() {
        axios.get('/api/user_list').then(
            response => {
                if (response.data.status === 0){
                    const all_users = []
                    let users = response.data.users
                    for (let i = 0; i < users.length; i++) {
                        all_users.push({
                            name: users[i]['name'],
                            gender: users[i]['gender'],
                            address: users[i]['address'],
                            email: users[i]['email'],
                            tags: [...users[i]['interest']],
                            id: users[i]['id'],
                        })
                    }
                    this.setState({
                        data: all_users
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
                <Column title="Name" dataIndex="name" key="name"/>
                <Column title="Gender" dataIndex="gender" key="gender" />
                <Column title="Address" dataIndex="address" key="address"/>
                <Column title="Email" dataIndex="email" key="email"/>
                <Column
                  title="Interest"
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
                <Column title="UserId" dataIndex="id" key="id"/>
            </Table>
        )
    }
}
