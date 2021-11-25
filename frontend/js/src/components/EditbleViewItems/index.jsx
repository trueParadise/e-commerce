import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Input, InputNumber, Popconfirm, Form, Typography } from 'antd';

const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      Name: '',
      Price: '',
      Label: '',
      Stock: '',
      Detail: '',
      ...record,
    });
    setEditingKey(record.key);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      

      if (index > -1) {
        const item = newData[index];
        let modify_list = []
        let obj = {}
        obj['delete'] = 'False'
        modify_list.push(obj)
        Object.keys(item).map((k, v)=>{
            if (item[k] !== row[k]) {
                obj = {}
                if (k === 'key') {
                    obj[k] = item[k]
                } else if(k === 'stock') {
                    obj[k] = row[k].replace(/ \| /g, ',')
                } else {
                    obj[k] = row[k]
                }
                modify_list.push(obj)
            }
        })
        if (modify_list.length > 2) {
            let data_sent = {}
            for (let i = 0; i < modify_list.length; i++) {
                for (let k in modify_list[i]) {
                    if (k === 'key') {
                        data_sent['itemid'] = modify_list[i][k]
                    } else {
                        data_sent[k] = modify_list[i][k]
                    }
                    
                }
            }
            axios.post('/api/edit_item', data_sent).then(
                response => {
                    if (response.data.status === 0) {
                        alert('Edition sucessful')
                    } else {
                        alert('Edition failed')
                    }
                },
                error => {console.log('fail', error)}
            )
        }
        
        newData.splice(index, 1, { ...item, ...row });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };
  
  const remove = (record) => {
    let data_sent = {
        delete: "TRUE",
        itemid: record.key
    }
    axios.post('/api/edit_item', data_sent).then(
        response => {
            // console.log('aaa', response.data)
            if (response.data.status === 0) {
                alert('Delete sucessful')
                
                
                const all_items = []
                axios.get('/api/item_list').then(
                    response => {
                        let ret_data = response.data.items
                        for (let i = 0; i < ret_data.length; i++) {
                            let stock = ret_data[i]['stock']
                            let str = ''
                            let j = 0
                            for (let k in stock) {
                                if (j === Object.keys(stock).length - 1) {
                                    str += `${parseInt(k)}:${parseInt(stock[k])}`
                                } else {
                                    str += `${parseInt(k)}:${parseInt(stock[k])} | `
                                }
                                j += 1
                            }
                            all_items.push({
                                key: ret_data[i]['id'],
                                name: ret_data[i]['name'],
                                price: ret_data[i]['price'],
                                label: ret_data[i]['label'],
                                stock: str,
                                detail: ret_data[i]['detail'],
                            })
                        }
                        setData([...all_items])
                    },
                    error => {console.log('fail',error)}
                )
                
                
                
            } else {
                alert('Delete failed')
            }
        },
        error => {console.log('failed', error)},
    ) 
  };

  useEffect(() => {
    const all_items = []
    axios.get('/api/item_list').then(
        response => {
            let ret_data = response.data.items
            for (let i = 0; i < ret_data.length; i++) {
                let stock = ret_data[i]['stock']
                let str = ''
                let j = 0
                for (let k in stock) {
                    if (j === Object.keys(stock).length - 1) {
                        str += `${parseInt(k)}:${parseInt(stock[k])}`
                    } else {
                        str += `${parseInt(k)}:${parseInt(stock[k])} | `
                    }
                    j += 1
                }
                all_items.push({
                    key: ret_data[i]['id'],
                    name: ret_data[i]['name'],
                    price: ret_data[i]['price'],
                    label: ret_data[i]['label'],
                    stock: str,
                    detail: ret_data[i]['detail'],
                })
            }
            setData([...all_items])
        },
        error => {console.log('fail',error)}
    )
  },[data.length])


  const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: '12.5%',
        editable: true,
    },
    {
        title: 'Price',
        dataIndex: 'price',
        width: '12.5%',
        editable: true,
    },
    {
      title: 'Label',
      dataIndex: 'label',
      width: '12.5%',
      editable: true,
    },
    {
        title: 'Stock',
        dataIndex: 'stock',
        width: '12.5%',
        editable: true,
    },
    {
        title: 'Detail',
        dataIndex: 'detail',
        width: '12.5%',
        editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
        <>
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit<p>&nbsp;</p>
          </Typography.Link>
          <Typography.Link disabled={editingKey !== ''} onClick={() => remove(record)}>
            Remove
          </Typography.Link>
        </>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
  );
};

export default EditableTable