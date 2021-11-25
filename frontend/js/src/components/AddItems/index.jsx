import React, { Component } from 'react'
import axios from 'axios'
import {connect} from 'react-redux'
import { Upload, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
// import UploadImages from "../UploadImages"

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

class AddItems extends Component {
    state = {
        admin_id: this.props.admin_id,
        email: '',
        name: '',
        users: [],
        orders: [],
        income: [],
        items: [],
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: []
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
        // console.log(this.state)
    };

    handleChange = ({ fileList }) => this.setState({ fileList }, ()=>{
        // console.log("change: ", this.state)
    });

    componentDidMount() {
        let data = {'adminid':this.props.admin_id}
        // console.log('admin id: ', data)
        axios.post('/api/admin_info', data).then(
            response => {
                if (response.data.status === 0) {
                    // console.log('Data from backend: ', response.data)
                    this.setState({
                        name: response.data.admin.name,
                        email: response.data.admin.email
                    })
                    // console.log("State: ", this.state)
                } else {
                    alert("Check info of admin failed!")
                }
            },
            error => { console.log('fail: ', error) }
        )
    }

    // New Item
    handleSubmit = (event) => {
        event.preventDefault()
        let {
            name: {value: name},
            detail: {value: detail},
            price: {value: price},
            label_1: {value: label_1},
            label_2: {value: label_2},
            // picture: {value: picture},
            type: {value: type},
            stock: {value: stock},
        } = this

        let data = {
            'name': name,
            'detail':detail,
            'price':price,
            'label': [label_1,label_2].toString(),
            'picture': this.state.fileList,
            'type': type,
            'stock': stock,
        }
        // console.log("Data: ", data)
        axios.post('/api/add_new_item', data).then(
            response => {
                if (response.data.status === 0){
                    // console.log("itemid: ", response.data.itemid)
                    alert("Add successfully!")
                }else {
                    alert("Fail to add!")
                }
            },
            error => { console.log('fail: ', error) }
        )
    }


    render() {
        const { previewVisible, previewImage, fileList, previewTitle } = this.state;
        const uploadButton = (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        );
        return (
            <div>
                <div id="contentCon">

                    {/*                Add New Item                */}
                    <div className="right">
                        <ul>
                            <p>Add Items</p>
                            <span></span>
                        </ul>
                        <div>
                            <ol>
                                <li>Name</li>
                                <li>Description</li>
                                <li>Type</li>
                                <li>Price</li>
                                <li>Stock</li>
                                <li>Label</li>
                                <li>Picture</li>
                                {/*<li>Classification</li>*/}
                            </ol>
                            <ul>
                                <form action="#" method="post" onSubmit={this.handleSubmit}>
                                    <div>
                                        <input ref = {c => this.name = c} type="text" placeholder="Enter Item Name"/>
                                    </div>
                                    <div>
                                        <input ref = {c => this.detail = c} type="text" placeholder="Enter Item Detail"/>
                                    </div>
                                    {/*<div><input ref = {c => this.type = c} type="text" placeholder="Enter Item type: like Men"/></div>*/}
                                    <ol>
                                        <select ref={c => this.type = c}>
                                            <option value="Men">Men</option>
                                            <option value="Women">Women</option>
                                            <option value="Children">Children</option>
                                            <option value="Maternal & infant">Maternal & infant</option>
                                        </select>
                                    </ol>
                                    <div>
                                        <input ref = {c => this.price = c} type="text" placeholder="Enter Item Price"/>
                                    </div>
                                    <div>
                                        <input ref = {c => this.stock = c} type="text" placeholder="Like: 160:19,165:10,170:5"/>
                                    </div>
                                    <li>
                                        <span>Label 1</span>
                                        <select ref={c => this.label_1 = c}>
                                            <option value="T-shrit">T-shrit</option>
                                            <option value="Dress">Dress</option>
                                            <option value="Sweater">Sweater</option>
                                            <option value="Coat">Coat</option>
                                            <option value="Skirt">Skirt</option>
                                            <option value="Pants">Pants</option>
                                            <option value="Hat">Hat</option>
                                            <option value="Baby-Clothes">Baby-Clothes</option>
                                        </select>
                                        <span>       </span>
                                        <span>Label 2</span>
                                        <select ref={c => this.label_2 = c}>
                                            <option value="Red">Red</option>
                                            <option value="Yellow">Yellow</option>
                                            <option value="Pink">Pink</option>
                                            <option value="White">White</option>
                                            <option value="Blue">Blue</option>
                                            <option value="Black">Black</option>
                                            <option value="Green">Green</option>
                                            <option value="Grey">Grey</option>
                                        </select>
                                    </li>
                                    <div>
                                        <Upload
                                            ref={c => this.fileList = c}
                                            name={'upload_img'}
                                            action={'/api/upload_img'}
                                            listType="picture-card"
                                            fileList={fileList}
                                            onPreview={this.handlePreview}
                                            onChange={this.handleChange}
                                        >
                                            {fileList.length >= 8 ? null : uploadButton}
                                        </Upload>
                                        <Modal
                                            visible={previewVisible}
                                            title={previewTitle}
                                            footer={null}
                                            onCancel={this.handleCancel}
                                        >
                                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                        </Modal>
                                    </div>
                                    <button>Upload</button>
                                </form>
                            </ul>
                        </div>
                        <span></span>
                    </div>
                    <div className="right">
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        admin_id:state.isLogin[1]
    }),
    {}
)(AddItems)