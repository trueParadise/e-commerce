import math
import random

from index import *
from flask import Flask, redirect, jsonify
from flask import request
from flask.templating import render_template
import json
import time

app = Flask(__name__)


@app.route('/')
@app.route('/login', methods=['POST'])
def login():  # Login function
    email = request.json.get('email')
    password = request.json.get('pwd')
    identity = request.json.get('identity')

    login_db = LoginController()
    action = actionController()
    res = {}

    try:
        login_user = login_db.login(email, password)
        login_id = login_user['localId']
        print(login_id)
        # res['status'] = 0  # success
        # res['id'] = login_id
        print(identity)
        if identity == 'admin':
            if action.checkuser(login_id, 'Admin'):
                res = {'status': 0, 'id': login_id, 'identity': 'admin'}  # success
            else:
                res['status'] = -1  # the admin is not in the Admin Collection
        elif identity == 'user':
            if action.checkuser(login_id, 'User'):
                res = {'status': 0, 'id': login_id, 'identity': 'user'}  # success
            else:
                res['status'] = -1  # the user is not in the User Collection
    except:
        res['status'] = 1  # fail
    return jsonify(res)


@app.route('/user_register', methods=['POST'])
def user_register():  # Register function
    name = request.json.get('name')
    email = request.json.get('email')
    password = request.json.get('pwd')
    interest = list(request.json.get('interest').split(','))  # 格式为 pants,red 的字符串
    address = request.json.get('address')
    gender = request.json.get('gender')
    register_user = LoginController()
    action = actionController()
    res = {}
    try:
        registered = register_user.register(email, password)
        registered_id = registered['localId']
        res['status'] = 0  # success
        res['id'] = registered_id
    except:
        res['status'] = -1  # fail user has already registered
        return jsonify(res)

    add_user_action = actionController()
    # Add user in 'User' collection and update Platform
    try:
        # Add new user to User collection
        add_user_action.addUser(registered_id, email, password, name, gender, interest, address)
        # Update Platform collection: the number of user
        origin_platform = action.select_DB('Platform', '1')
        origin_user = origin_platform['totalUsers']
        print("Origin number of user: ", origin_user)
        update_data = {'id': '1', 'totalUsers': str(int(origin_user) + 1)}
        print("New number of user: ", str(int(origin_user) + 1))
        action.update('Platform', update_data)
        res['status'] = 0  # success
        res['id'] = registered_id
    except:
        res['status'] = 1  # adding user fail
    return jsonify(res)


@app.route('/reset_pwd', methods=['POST'])
def reset_pwd():  # Reset password function
    password = request.json.get('pwd')
    email = request.json.get('email')
    action = LoginController()
    try:
        action.resetpwd(email)
        res = {'status': 0}
    except:
        res = {'status': 1}
        return jsonify(res)

    # Getting the user id of this user
    userid = actionController().select_user_by_email(email)

    # Update the User collection
    data = {'id': userid, 'pwd': password}
    update_pwd_action = actionController()
    try:
        update_pwd_action.update('User', data)
        res = {'status': 0, 'id': userid}
    except:
        res = {'status': 1}

    return jsonify(res)


@app.route('/user_info', methods=['POST'])
def each_user():  # Selecting the User's info
    userid = request.json.get('userid')
    action = actionController()
    try:
        user_info = action.select_DB('User', userid)
        res = {'status': 0, 'user': user_info}
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/admin_info', methods=['POST'])
def each_admin():  # Selecting the Admin's info
    admin_id = request.json.get('adminid')
    action = actionController()
    try:
        admin_info = action.select_DB('Admin', admin_id)
        res = {'status': 0, 'admin': admin_info}
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/user_list', methods=['GET'])
def user_list():  # Listing all users
    user_action = actionController()
    try:
        data = user_action.list_all('User')
        res = {'status': 0,
               'users': data
               }
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/update_profile', methods=['POST'])
def update_profile():  # Editing the User's info
    update_data = {'id': request.json.get('id'),
                   'name': request.json.get('name'),
                   'interest': list(request.json.get('interest').split(',')),  # 格式为 pants,red 的字符串
                   'address': request.json.get('address'),
                   'gender': request.json.get('gender')
                   }
    update_action = actionController()
    try:
        update_action.update('User', update_data)
        res = {'status': 0, 'id': update_data['id']}  # success
    except:
        res = {'status': 1}  # fail
    return jsonify(res)


@app.route('/update_photo', methods=['POST'])
def update_photo():  # Uploading user's photo
    update_data = {
        'id': request.json.get('id'),
        'picture': request.json.get('base64')
    }
    print(update_data)
    update_action = actionController()

    try:
        update_action.update('User', update_data)
        res = {'status': 0, 'id': update_data['id']}
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/my_order', methods=['POST'])
def my_order():  # Checking the User's orders
    user_id = request.json.get('id')
    sub_doc = 'Order'
    action = actionController()
    try:
        data = action.select_sub_User(sub_doc, user_id)
        new_data = []
        for i in data:
            tmp = action.select_DB('Item', i['itemid'])
            if tmp:
                tmp['colour'] = tmp['label'].split(",")[1]
                tmp['label_1'] = tmp['label'].split(",")[0]
                i['item_info'] = tmp
                new_data.append(i)
        res = {'status': 0,
               'id': user_id,
               'order': new_data
               }
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/my_cart', methods=['POST'])
def my_cart():  # Checking the User's cart
    user_id = request.json.get('id')
    print(user_id)
    sub_doc = 'Cart'
    action = actionController()
    try:
        data = action.select_sub_User(sub_doc, user_id)
        res = {'status': 0,
               'id': user_id,
               'cart': data
               }
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/my_review', methods=['POST'])
def my_review():  # Checking the User's review
    user_id = request.json.get('id')
    sub_col = 'Review'
    action = actionController()
    try:
        data = action.select_sub_User(sub_col, user_id)
        res = {'status': 0,
               'id': user_id,
               'review': data
               }
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/item_list', methods=['GET'])
def item_list():  # Selecting all items' info
    item_action = actionController()
    try:
        data = item_action.list_all('Item')
        res = {'status': 0,
               'items': data}
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/item/<string:itemid>', methods=['GET'])
def each_item(itemid):  # Selecting specific Item info
    action = actionController()
    try:
        item_detail = action.select_DB('Item', itemid)
        res = {'status': 0, 'item': item_detail}
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/add_cart', methods=['POST'])
def add_cart():  # Adding the User's cart
    user_id = request.json.get('userid')
    add_data = {'userid': request.json.get('userid'),
                'itemid': request.json.get('itemid'),
                'amount': request.json.get('amount'),
                'size': request.json.get('size'),
                'price': request.json.get('price'),
                'item_color': request.json.get('item_color'),
                'item_name': request.json.get('item_name')
                }
    cart_action = actionController()

    # Checking stock of this Item
    try:
        amount = cart_action.select_DB('Item', add_data['itemid'])['stock'][add_data['size']]
        print("Item amount: ", amount, "Add amount: ", add_data['amount'])
        # print(int(amount) < int(add_data['amount']))
        if int(amount) < int(add_data['amount']):
            raise Exception('understock')
    except Exception as e:
        print(e)
        res = {'status': -1}  # understock
        return jsonify(res)

    # Adding Item into Cart
    try:
        cart_id, _ = cart_action.addSubColOfUser('Cart', user_id, add_data)
        res = {'status': 0, 'cartid': cart_id}
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/del_cart', methods=['POST'])
def del_cart():  # Deleting cart of user
    cartid = request.json.get('cartid')
    userid = request.json.get('userid')

    action = actionController()
    try:
        cart_id = action.delCart(userid, cartid)
        res = {'status': 0, 'del_cart_id': cart_id}  # Success
    except:
        res = {'status': 1}  # Fail
    return jsonify(res)


@app.route('/payment', methods=['POST'])
def payment():  # Purchasing some items
    purchase_data = {
                     'cartid': request.json.get('cartid'),
                     'userid': request.json.get('userid'),
                     'itemid': request.json.get('itemid'),
                     'time': time.strftime("%Y/%m/%d %H:%M:%S"),
                     'amount': request.json.get('amount'),
                     'size': request.json.get('size'),
                     'totalPrice': request.json.get('totalPrice')
                     }

    discount = random.uniform(0.7, 0.9)
    purchase_data['totalPrice'] = math.ceil(int(purchase_data['totalPrice']) * discount)

    print(purchase_data)

    if purchase_data['cartid'] is None:
        print("None")
        purchase_data['cartid'] = '-1'  # Means that the item was purchased from item detail page directly

    user_id = request.json.get('userid')
    order_action = actionController()

    # Checking stock of this Item
    try:
        amount = order_action.select_DB('Item', purchase_data['itemid'])['stock'][purchase_data['size']]
        print("Item amount: ", amount, "Add amount: ", purchase_data['amount'])
        if int(amount) < int(purchase_data['amount']):
            raise Exception('understock')
    except Exception as e:
        print(e)
        res = {'status': -1}  # understock
        return jsonify(res)

    try:
        # Adding this order to User's Order Collection
        # Updating Platform total sales
        order_id, all_order_id = order_action.addSubColOfUser('Order', user_id, purchase_data)
        order_action.update('Platform', {'id': '1', 'totalOrders': '1', 'totalSales': purchase_data['totalPrice']}, 'order')
        # Deleting this order from cart if this order is in user's cart
        if purchase_data['cartid'] != '-1':
            order_action.delCart(user_id, purchase_data['cartid'])
        # Updating stock of this item
        select_item = order_action.select_DB('Item', purchase_data['itemid'])
        origin_stock = select_item['stock']
        print("select origin: ", origin_stock)
        origin_stock[purchase_data['size']] = str(int(origin_stock[purchase_data['size']]) - int(purchase_data['amount']))
        order_action.update('Item', {'id': purchase_data['itemid'], 'stock': origin_stock})
        print("after update: ", origin_stock)
        res = {'status': 0, 'orderid': order_id, 'all_order_id': all_order_id}
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/add_review', methods=['POST'])
def add_review():  # Adding the User's review
    add_data = {'orderid': request.json.get('orderid'),
                'userid': request.json.get('userid'),
                'itemid': request.json.get('itemid'),
                'time': time.strftime("%Y/%m/%d %H:%M:%S"),
                'rating': request.json.get('rating'),
                'comment': request.json.get('comment')
                }

    user_id = request.json.get('userid')
    review_action = actionController()
    try:
        review_id, all_review_id = review_action.addSubColOfUser('Review', user_id, add_data)
        res = {'status': 0, 'reviewid': review_id, 'all_review_id': all_review_id}
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/add_new_item', methods=['POST'])
def new_item():  # Adding new Item
    data = {'detail': request.json.get('detail'),
            'label': request.json.get('label'),
            'name': request.json.get('name'),
            'picture': request.json.get('picture'),
            'price': request.json.get('price'),
            'stock': helperController().trans(request.json.get('stock')),  # format 160:19,165:10,170:5
            'type': request.json.get('type')
            }
    # print("Add item images: ", data['picture'])
    add_action = actionController()
    img_save = ImgController(data['picture'])

    try:
        # print(1)
        item_id, totalitem = add_action.addItem(data)
        # print("itemid: ", item_id)
        add_action.update('Platform', {'id': '1', 'totalItems': totalitem, 'currentID': item_id})
        print("return: ", item_id, totalitem)
        r = img_save.upload_img()
        res = {'status': 0, 'itemid': item_id, 'images': r}
    except Exception as e:
        print(e)
        res = {'status': 1}
    return jsonify(res)


@app.route('/edit_item', methods=['POST'])
def edit_item():  # Editing Item
    itemid = request.json.get('itemid')
    if_del = request.json.get('delete')
    # print(if_del)
    edit_data = {
            'detail': request.json.get('detail'),
            'label': request.json.get('label'),
            'name': request.json.get('name'),
            # 'picture': request.json.get('picture'),
            'price': request.json.get('price'),
            'stock': helperController().trans(request.json.get('stock')),  # 格式为 160:19,165:10,170:5 的字符串
            'type': request.json.get('type')
            }
    print(edit_data)
    data = {}
    for i in edit_data:
        if edit_data[i]:
            data[i] = edit_data[i]
    print(data)
    action = actionController()
    if if_del == 'TRUE':
        try:
            new = action.delItem(itemid)
            action.update('Platform', {'id': '1', 'totalItems': new})
            res = {'status': 0, 'del_itemid': itemid}
        except:
            res = {'status': 1}
    else:
        try:
            action.editItem(itemid, data)
            res = {'status': 0, 'edit_itemid': itemid}
        except:
            res = {'status': 1}

    return jsonify(res)


@app.route('/all_orders', methods=['GET'])
def all_orders():  # Selecting all orders of platform
    action = actionController()
    try:
        data = action.list_all('AllOrder')
        res = {'status': 0, 'orders': data}
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/all_reviews', methods=['POST'])
def all_reviews():  # Selecting all reviews of one item
    itemid = request.json.get('itemid')
    action = actionController()
    try:
        data = action.list_all('AllReview')
        r_d = []
        for i in data:
            if i['itemid'] == itemid:
                r_d.append(i)
        res = {'status': 0, 'itemid': itemid, 'reviews': r_d}
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/view_income', methods=['GET'])
def view_income():  # Viewing income of our website
    action = actionController()
    try:
        data = action.list_all('Platform')
        res = {'status': 0, 'sales_situation': data}
    except:
        res = {'status': 1}
    return jsonify(res)


@app.route('/upload_img', methods=['POST'])
def upload_img():  # Uploading images to Storage and saving images path in Item Collection
    print("Upload Images")
    img = request.files.get("upload_img")
    print(img)
    return jsonify({'status': 0})
    # img_controller = ImgController(img)
    # try:
    #     if img_controller.upload_img():
    #         images_path = img_controller.upload_img()
    #         res = {'status': 0, 'images_path': images_path}  # Success
    #     else:
    #         res = {'status': 1}  # Fail
    # except:
    #     res = {'status': 1}  # Fail
    # return jsonify(res)


@app.route('/get_item_by_category', methods=['POST'])
def get_item_by_category():
    category = request.json.get('category')
    userid = request.json.get('userid')
    print(category, userid)
    action = actionController()
    try:
        items = action.list_all('Item', category=category, userid=userid)
        print("Number of: ", len(items))
        res = {'status': 0, 'items': items}
    except Exception as e:
        print(e)
        res = {'status': 1}  # Fail
    return jsonify(res)


@app.route('/search', methods=['POST'])
def search():
    keys = {'typeof': ['men', 'women', 'children', 'maternal', 'infant'],
            'category': ['T-shirt', 'Dress', 'Sweater', 'Coat', 'Skirt', 'Shirt', 'Baby', 'Pants', 'Hat'],
            'color': ['Red', 'Black', 'Blue', 'White', 'Pink', 'Yellow', 'Green', 'Grey']}
    keywords = request.json.get('keywords').split()
    print("keywords: ", keywords)
    search_action = actionController()
    typeof, category, color = '', '', ''
    for i in keywords:
        if i.lower() in keys['typeof']:
            typeof = i.lower()
        elif i.capitalize() in keys['category']:
            if i.capitalize() == 'Shirt':
                category = 'T-shirt'
            elif i.capitalize() == 'Baby':
                category = 'Baby-Clothes'
            else:
                category = i.capitalize()
        elif i.capitalize() in keys['color']:
            color = i.capitalize()
    try:
        items = search_action.select_item_by_keywords(typeof=typeof, category=category, color=color)
        print("Number: ", len(items))
        res = {'status': 0, 'items': items}
    except:
        res = {'status': 1}  # Fail
    return jsonify(res)


@app.route("/helper_1", methods=['GET'])
def helper_1():  # Used to create Men,Women,Children,Maternal & infant from Item Collection
    action = actionController()
    try:
        action.helper_1()
        res = {'status': 0}
    except Exception as e:
        print(e)
        res = {'status': 1}
    return jsonify(res)


@app.route("/helper_2", methods=['GET'])
def helper_2():  # Used to convert png to base64
    action = actionController()
    try:
        action.helper_2()
        res = {'status': 0}
    except Exception as e:
        print(e)
        res = {'status': 1}
    return jsonify(res)


if __name__ == '__main__':
    dbController().initfireadmin()
    app.run('127.0.0.1', port=5000, debug=True)
