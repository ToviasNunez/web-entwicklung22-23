## Software description

## Run the local backend server

npm run start:server

## Run the frontend server

ng serve

## Backend folder

### controllers

##### posts :  export --> create Post , get Post , get post from Id , update Post , delete Post

#### users: export -> create user , user login  , module.export (re,res,next)

### middleware

#### token: import jsonwebtoken

#### file: MIME_TYPE_MAP  , storage  --> using multer

### models folder

#### post.js  --> postSchemma --> add to mongoose.Schema

#### app.js -> userSchema -> add to mongoose.Schema

### router

#### Post:  route to create post link (token verification), get post , get post from id , update post link,

delete post link

#### User :  route to the signup and login link

### app:  connect to mongoose , uploaded th image , reques and set head access , export the post and user route

### package.json: for to deploy the app

### server.js: run the backend serve request

## Frontend

### app

#### auth  -- authetication user

##### login. -> user can log after be signed up with username and password

##### signup .> user can signup with the unique user name and password

##### auth-data-model  --> interface  value user name and password.

##### auth-interceptor-> handle the res http client and server , authorization token

##### auth-routing -> routing the LoginComponent and the  SignupComponent throght the RouterModule.forChild(routes)

##### auth-guard -> can Activate ,  control that user dosent acces the link direcct throght the browser, in case that it are not authticate will send to the login router

##### auth-module -> longinComponent , SignupComponent

##### auth.services ->  get token , get auth status listener as observer , get status user listener as observer , get if the user is authenticate, create use , login user  , logout  , save data in local store from the browser, clear the local data automatic auth user will be delete after 1 hour , get the authetication data , set the time of the authentication will validate. get the user id, get the user name

#### error -> handle error --> create the own display dialog from error

#### footer -->

#### header -->

#### posts

##### create post. -> read all the vaule from the html and json data , on save the post will be check if it a update o a new post

##### show list of posts: show the list of the post and the changes that the list ocurred

##### post.model -> interface from the post

##### posts.module -->

##### posts.service --> get the post , post per page  , get update post as observer  , get post from id , add new post , update existent post edelete post

#### angular materil module

#### app routing module , list from post , create post , edit post , user load children

#### app module

#### error interceptor: -> intercep error from the http req.

### assets -> json local data
