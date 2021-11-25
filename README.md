<!-- # Fantastic-9900
# capstone-project-9900-h18c-fantastic

### cd frontend/js && npm install (just use this command in first time)
### cd ../../backend && python app.py
### cd ../frontend/js && npm start
 -->
# User Manual
## API requirement
### • Python 3.7.10
### • NPM 6.14.15
### • Node.js v16.13.0
### • pip 21.1.2
### • React 17.0.2
### • HTML5
### • Ant-Design 4.16.13
### • Git

## Setup for git 
In order to implement this project, we need to do the setup of git. There are two method to initialize git:
### • SSH
	git clone git@github.com:COMP3900-9900-Capstone-Project/capstoneproject-comp9900-h18c-fantastic.git 
### • HTTP
	git clone https://github.com/COMP3900-9900-Capstone-Project/capstoneproject-comp9900-h18c-fantastic.git 

## Running steps
### Firstly, we need to install the required API.
1. First, you need to install React, NPM and Node.js to ensure that the program can be used normally.
2. React: You can download react by visiting  Node.js (reactjs.org) if you do not install it.
3. Or you can also directly use the react CDN Library of static file CDN by:
   <script src="https://unpkg.com/react@16/umd/react.development.js"></script> 
   <script src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
   But it not recommended.
4. Node.js: You can download react by visiting Node.js (nodejs.org) if you do not install it.
### Then, you need to you need to install Python and the packages which are required:
1. Download python 3.6 from the official website: https://www.python.org and install it with instruction.
2. Required Packages: flask, pyrebase, firebase_admin, json, base64.
### After installing the required APIs, we need to download the project from the Github. Then unzip the code file and the file structure is as shown in the figure below:
### ![image](https://user-images.githubusercontent.com/38883171/141735064-70fef182-c27b-4807-b955-a3923d7b5b02.png)
### There is the method to deploy project on server.
1. After downloading the source code, we need to open Terminal firstly.
2. Install all packages we need by running: pip install -r requirement.txt
3. Use “cd” to enter “backend” and run: python app.py
4. Then, open another terminal and “cd” to “frontend/js” and then input “npm install” and “npm start”
5. And now you could see the website on your browser

## Necessary installation packages 
### In the writing process, due to the use of integrated writing plug-ins, after the installation of node.js and react, you need to install some necessary plug-ins through terminal to ensure normal use. These include:
1. Ant-Design: $ npm install antd –save
2. Ant-Design/chart: $ npm install @ant-design/charts
3. Ant-Design/icons: $ npm install --save @ant-design/icons

## Operation results
### When you finish the operation above, the correct display should be: 
1. The terminal runs normally, and,
2. The web page automatically jumps to the editable web page of react, where localhost is 3000.
 ![image](https://user-images.githubusercontent.com/38883171/141735085-bc5e3cdc-e19e-425e-ad48-84ad9dfc234e.png)

## Information available for testing 
1. User information for testing is:
   (1) Email: fff@fantastic.com
   (2) Password: 123fff
#### Hint: If you want to test the “Reset Password” function, you need to register a new account by using real email.
2. Admin information for testing is:
   (1) Email: admin_1@fantastic.com
   (2) Password: 123456
### If there are any problem when running our project, you could email anyone of our team.
