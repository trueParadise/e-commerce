import base64

import pyrebase
import firebase_admin
import json
from firebase_admin import firestore, credentials
from PIL import Image


class dbController:  # Used to initialize the database configuration
    def __init__(self):
        pass

    def initfirebase(self):  # Pyrebase used to implement login, register and reset password
        config = ''
        with open('configuration.json') as config_file:
            data = json.load(config_file)
            config = data.get("pyrebaseconfig")
        self.pyrebase = pyrebase.initialize_app(config[0])
        return self.pyrebase

    def initfireadmin(self):  # firebase-admin used to operate database
        config = ''
        with open('configuration.json') as config_file:
            data = json.load(config_file)
            config = data.get("fireadminconfig")
        cred = credentials.Certificate(config[1].get("adk"))
        self.fireadmin = firebase_admin.initialize_app(cred, config[0])
        return self.fireadmin


class LoginController:
    def __init__(self):
        self.pyrebase = dbController().initfirebase()
        self.auth = self.pyrebase.auth()

    def login(self, email, password):  # Login
        return self.auth.sign_in_with_email_and_password(email, password)

    def register(self, email, password):  # Register
        return self.auth.create_user_with_email_and_password(email, password)

    def resetpwd(self, email):  # Reset pwd
        return self.auth.send_password_reset_email(email)


class ImgController:  # Functions for uploading images
    def __init__(self, img):
        self.storage = dbController().initfirebase().storage()
        self.img = img

    def upload_img(self):
        # print("backend: ", self.img)
        # 存进Storage并且返回路径 并存储路径在Item中
        print("upload: ", len(self.img), "images")
        allId = []
        for i in self.img:
            path = "/Item/" + i['uid'] + ".png"
            print(path)
            b_of_image = i['thumbUrl'].split('base64,')[1]
            img = base64.b64decode(b_of_image)
            self.storage.child(path).put(img)
            allId.append(i['uid'])
        return allId


class actionController:  # Functions for operating db
    # Checking user is in database or not
    def checkuser(self, userid, collection):
        content_userid = firestore.client().collection(collection).document(userid)
        # print(content_userid.get().to_dict())
        if content_userid.get().exists:
            return True
        else:
            return False

    # Adding User into database
    def addUser(self, userid, email, pwd, name, gender, interest, address):
        action = firestore.client().collection('User').document(userid)
        picture = ''
        if gender == 'Male':
            with open("../frontend/js/src/images/male_photo.png", 'rb') as f:
                picture = 'data:image/png;base64,' + base64.b64encode(f.read()).decode()
        elif gender == 'Female':
            with open("../frontend/js/src/images/female_photo.png", 'rb') as f:
                picture = 'data:image/png;base64,' + base64.b64encode(f.read()).decode()
        res = action.set({
            'id': userid,
            'name': name,
            'email': email,
            'pwd': pwd,
            'gender': gender,
            'interest': interest,
            'address': address,
            'picture': picture,
            'wallet': '0'
        })
        return res

    # Adding sub-collections of User: Cart, Order and Review
    def addSubColOfUser(self, sub_col, userid, add_data):
        db_action = firestore.client()
        action = db_action.collection('User').document(userid)
        # sub_action = action.collection(sub_col).get()
        # sub_doc_id = len(sub_action) + 1
        # print(len(sub_action))
        sub_col_data = action.collection(sub_col).stream()
        sub_doc_id = '0'
        flag = 0
        update_data = {}
        for i in sub_col_data:
            # print(i.to_dict())
            if int(i.to_dict()['id']) > int(sub_doc_id):
                sub_doc_id = i.to_dict()['id']
            if sub_col == 'Cart' and i.to_dict()['itemid'] == add_data['itemid'] and i.to_dict()['size'] == add_data[
                'size']:
                flag = 1
                update_data = i.to_dict()
        sub_doc_id = str(int(sub_doc_id) + 1)
        print(sub_doc_id)
        if sub_col == 'Cart' and flag == 1:
            update_data['amount'] = str(int(update_data['amount']) + int(add_data['amount']))
            sub_doc_id = update_data['id']
            print(update_data)
            update = action.collection(sub_col).document(sub_doc_id).update(update_data)
        else:
            add_action = action.collection(sub_col).document(sub_doc_id)
            add_data['id'] = sub_doc_id
            add_action.set(add_data)
        newid = 0
        if sub_col == 'Order' or sub_col == 'Review':
            col = "All" + sub_col
            newid = str(len(db_action.collection(col).get()) + 1)
            add_data['id'] = newid
            db_action.collection(col).document(newid).set(add_data)
        return sub_doc_id, newid

    # Adding Item into database and update Platform
    def addItem(self, data):
        action = firestore.client()
        total_item = str(int(action.collection('Platform').document('1').get().to_dict()['totalItems']) + 1)
        current_item = action.collection('Platform').document('1').get()
        item_id = str(int(current_item.to_dict()['currentID']) + 1)
        data['id'] = item_id
        # print("before picturea", data)
        pictures = data['picture']
        save_pictures = []
        for i in pictures:
            save_pictures.append({'url': "gs://fantistic-44830.appspot.com/Item/"+i['uid']+'.png', 'base64': i['thumbUrl']})
        # print("save pictures: ", save_pictures)
        data['picture'] = save_pictures
        add_action = action.collection('Item').document(item_id)
        add_action.set(data)
        add_to_category_col = action.collection(data['type']).document(item_id).set(data)
        return item_id, total_item

    # Editing Item in database
    def editItem(self, itemid, data):
        action = firestore.client().collection('Item').document(itemid)
        category = firestore.client().collection('Item').document(itemid).get().to_dict()['type']
        print(category)
        # data['id'] = itemid
        action.update(data)
        firestore.client().collection(category).document(itemid).update(data)

    # Deleting user from database
    def delItem(self, itemid):
        category = firestore.client().collection('Item').document(itemid).get().to_dict()['type']
        firestore.client().collection('Item').document(itemid).delete()
        print(category)
        firestore.client().collection(category).document(itemid).delete()
        # print(5)
        print(int(firestore.client().collection('Platform').document('1').get().to_dict()['totalItems']))
        change = int(firestore.client().collection('Platform').document('1').get().to_dict()['totalItems']) - 1
        # print(6)
        change = str(change)
        return change

    # Updating database according to collection and document
    def update(self, doc, update_data, spec=None):
        if spec and spec == 'order':
            check_action = firestore.client().collection('Platform').document('1')
            new_orders = int(check_action.get().to_dict()['totalOrders']) + int(update_data['totalOrders'])
            new_sales = int(check_action.get().to_dict()['totalSales']) + int(update_data['totalSales'])
            update_data['totalOrders'] = str(new_orders)
            update_data['totalSales'] = str(new_sales)
        update_id = update_data['id']
        update_action = firestore.client().collection(doc).document(update_id)
        update_action.update(update_data)

    # Deleting something from User's Cart
    def delCart(self, userid, cartid):
        res = firestore.client().collection('User').document(userid).collection('Cart').document(cartid).delete()
        return cartid

    # Selecting sub-collection of User in database: Cart, Order and Review
    def select_sub_User(self, sub_col, userid):
        select_action = firestore.client().collection('User').document(userid)
        data = select_action.collection(sub_col).stream()
        # print(data)
        res = []
        if data:
            for i in data:
                res.append(i.to_dict())
        return res

    # Listing out all Items
    def list_all(self, col, category=None, userid=None):
        if category and col == "Item":
            if category == 'Popular' and userid:
                res = []
                all_orders = [i.to_dict()['itemid'] for i in firestore.client().collection('AllOrder').get()]
                all_user_orders = [i.to_dict()['itemid'] for i in firestore.client().collection('User').document(userid).collection('Order').get()]
                items = [i.to_dict() for i in firestore.client().collection(col).get()]
                all_items = [{i['id']: i['type'], 'id': i['id']} for i in items]
                all_items_id = [i['id'] for i in all_items]
                all_items_type = {}
                for i in all_items:
                    all_items_type[i['id']] = i[i['id']]
                # print(all_items_type)
                score = {'Men': 0, 'Women': 0, 'Children': 0, 'Maternal & infant': 0}
                # print(all_orders, all_user_orders, all_items, all_items_id)
                for i in all_orders:
                    if i in all_items_id:
                        score[all_items_type[i]] += 1
                for i in all_user_orders:
                    if i in all_items_id:
                        score[all_items_type[i]] += 4
                score = sorted(score.items(), key=lambda x: x[1], reverse=True)
                score = [i[0] for i in score]
                print(score)
                tmp = {'Men': 0, 'Women': 0, 'Children': 0, 'Maternal & infant': 0}
                tmp_index = 0
                for i in items:
                    if i['type'] == score[0] and tmp[score[0]] == 0:
                        res.append(i)
                        tmp[score[0]] = 1
                    elif i['type'] == score[1] and tmp[score[1]] == 0:
                        res.append(i)
                        tmp[score[1]] = 1
                    elif i['type'] == score[2] and tmp[score[2]] == 0:
                        res.append(i)
                        tmp[score[2]] = 1
                    elif tmp[score[0]] == 1 and tmp[score[1]] == 1 and tmp[score[2]] == 1:
                        tmp_index = items.index(i)
                        break
                res.append(items[tmp_index + 1])
                return res
                # items = firestore.client().collection(col).stream()
                # res = []
                # index = 0
                # for i in items:
                #     if index == 4:
                #         break
                #     res.append(i.to_dict())
                #     index += 1
                # return res
            elif category == 'Maternal_infant':
                category = 'Maternal & infant'
                items = firestore.client().collection(category).stream()
                res = []
                for i in items:
                    res.append(i.to_dict())
                    # if i.to_dict()['type'] == category and i.to_dict()['picture']:
                    #     res.append(i.to_dict())
                return res
            else:
                items = firestore.client().collection(category).stream()
                res = []
                for i in items:
                    res.append(i.to_dict())
                # items = firestore.client().collection(col).stream()
                # res = []
                # for i in items:
                #     if i.to_dict()['type'] == category and i.to_dict()['picture']:
                #         res.append(i.to_dict())
                return res
        else:
            data = firestore.client().collection(col).stream()
            res = []
            for i in data:
                res.append(i.to_dict())
            return res

    # Selecting info from database according to collection and document
    def select_DB(self, col, doc_id):
        select_action = firestore.client().collection(col).document(doc_id)
        res = select_action.get().to_dict()
        return res

    # Selecting user by using email
    def select_user_by_email(self, email):
        data = firestore.client().collection('User').stream()
        res_id = ''
        for i in data:
            temp = i.to_dict()
            if temp['email'] == email:
                res_id = temp['id']
                break
        return res_id

    # Selecting item by using type, category and color
    def select_item_by_keywords(self, typeof=None, category=None, color=None):
        print(typeof, category, color)
        select_item = firestore.client().collection('Item').stream()
        res = []
        if typeof:
            if category and color:
                for i in select_item:
                    if typeof in i.to_dict()['type'].lower() and category in i.to_dict()['label'] and \
                            color in i.to_dict()['label']:
                        res.append(i.to_dict())
            else:
                if category:
                    for i in select_item:
                        if typeof in i.to_dict()['type'].lower() and category in i.to_dict()['label']:
                            res.append(i.to_dict())
                elif color:
                    for i in select_item:
                        if typeof in i.to_dict()['type'].lower() and color in i.to_dict()['label']:
                            res.append(i.to_dict())
                else:
                    for i in select_item:
                        if typeof in i.to_dict()['type'].lower():
                            res.append(i.to_dict())
        else:
            if category and color:
                for i in select_item:
                    if category in i.to_dict()['label'] and \
                            color in i.to_dict()['label']:
                        res.append(i.to_dict())
            else:
                if category:
                    for i in select_item:
                        if category in i.to_dict()['label']:
                            res.append(i.to_dict())
                elif color:
                    for i in select_item:
                        if color in i.to_dict()['label']:
                            res.append(i.to_dict())
        return res

    def helper_1(self):  # Used to create Men,Women,Children,Maternal & infant from Item Collection
        items = firestore.client().collection('Item').stream()
        Men, Women, Children, maternal_infant = [], [], [], []
        for i in items:
            if i.to_dict()['type'] == 'Men':
                Men.append(i.to_dict())
            elif i.to_dict()['type'] == 'Women':
                Women.append(i.to_dict())
            elif i.to_dict()['type'] == 'Children':
                Children.append(i.to_dict())
            elif i.to_dict()['type'] == 'Maternal & infant':
                maternal_infant.append(i.to_dict())
        # print(1, len(Men), len(Women), len(Children), len(maternal_infant))
        new_men = firestore.client().collection('Men')
        new_women = firestore.client().collection('Women')
        new_children = firestore.client().collection('Children')
        new_maternal_infant = firestore.client().collection('Maternal & infant')
        for i in Men:
            new_men.document(i['id']).set(i)
        for i in Women:
            new_women.document(i['id']).set(i)
        for i in Children:
            new_children.document(i['id']).set(i)
        for i in maternal_infant:
            new_maternal_infant.document(i['id']).set(i)

    def helper_2(self):  # Used to convert png to base64 and saved to user's picture
        action = firestore.client().collection('User').stream()
        base64_data_male = ''
        base64_data_female = ''
        with open("../../images/User/male_photo.png", 'rb') as f:
            base64_data_male = 'data:image/png;base64,' + base64.b64encode(f.read()).decode()
        with open("../../images/User/female_photo.png", 'rb') as f:
            base64_data_female = 'data:image/png;base64,' + base64.b64encode(f.read()).decode()
        print(base64_data_male)
        print(base64_data_female)
        for i in action:
            if i.to_dict()['gender'].capitalize() == 'Male':
                firestore.client().collection('User').document(i.to_dict()['id']).update({'picture': base64_data_male})
            elif i.to_dict()['gender'].capitalize() == 'Female':
                firestore.client().collection('User').document(i.to_dict()['id']).update({'picture': base64_data_female})




class helperController:
    # the function to process dict input data
    def trans(self, s):
        if s:
            s1 = s.split(',')
            s2 = [tuple(i.split(':')) for i in s1]
            return dict(s2)
        else:
            return None
