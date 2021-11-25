import React, { Component } from 'react'
import {Route, Switch, Redirect, Link} from 'react-router-dom'
import { Layout, Menu} from 'antd';
import DashboardCss from './index.module.css'
import HeaderAfterLoginOfAdmin from "../../components/HeaderAfterLoginOfAdmin"
import EditableTable from '../../components/EditbleViewItems'
import ViewRevenue from '../../components/ViewRevenue';
import ViewOrder from '../../components/ViewOrders'
import AddItems from '../../components/AddItems'
import ViewAllUser from '../../components/ViewAllUsers'

import {
    MoneyCollectOutlined,
    DiffOutlined,
    PieChartOutlined,
    ContainerOutlined,
    UserOutlined
  } from '@ant-design/icons';

const { Header, Footer, Sider, Content } = Layout;


export default class Dashboard extends Component { 
    render() {
        return (
            <div>
                <Layout>
                  <Sider style={{
                    overflow: 'auto',
                    height: '100vh',
                    position: 'fixed',
                    left: 0,
                  }}>
                    <div className={DashboardCss.logo} />
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1" icon={<ContainerOutlined />}>
                            <Link to='/administrator/view_items'>View Items</Link>
                        </Menu.Item>
                        <Menu.Item key="2" icon={<UserOutlined />}>
                            <Link to='/administrator/view_allusers'>View Users</Link>
                        </Menu.Item>
                        <Menu.Item key="3" icon={<DiffOutlined />}>
                            <Link to='/administrator/add_items'>Add Items</Link>
                        </Menu.Item>
                        <Menu.Item key="4" icon={<PieChartOutlined />}>
                            <Link to='/administrator/view_revenue'>View Revenue</Link>
                        </Menu.Item>
                        <Menu.Item key="5" icon={<MoneyCollectOutlined />}>
                            <Link to='/administrator/view_orders'>View Orders</Link>
                        </Menu.Item>
                    </Menu>
                  </Sider>
                  <Layout className="site-layout" style={{ marginLeft: 200 }}>
                    <Header 
                    className="site-layout-background" 
                    style={{ position: 'fixed', zIndex: 1, width: '100%' }}
                    >
                    <HeaderAfterLoginOfAdmin/>
                    </Header>
                    <Content style={{ margin: '100px 50px 0', overflow: 'initial' }}>
                      <Switch>
                        <Route path='/administrator/view_items' component={EditableTable}/>
                        <Route path='/administrator/add_items' component={AddItems}/>
                        <Route path='/administrator/view_revenue' component={ViewRevenue}/>
                        <Route path='/administrator/view_orders' component={ViewOrder}/>
                        <Route path='/administrator/view_allusers' component={ViewAllUser}/>
                        <Redirect to='/administrator/view_items'></Redirect>
                      </Switch> 
                    </Content>
                    <Footer style={{ textAlign: 'center'}}>Fantastic</Footer>
                  </Layout>
                </Layout>
            </div>
        )
    }
}
