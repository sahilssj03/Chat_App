
# Realtime Chat App

A realtime chat app built using React.js, Node.js and Socket.io. With proper authentication and added functionalities like Groupchat etc.

## Website Link

- [https://ag-chat-app.netlify.app](https://ag-chat-app.netlify.app/)

## Authors

- [Anuj](https://github.com/Anuj1p)
- [Gaurav Yadav](https://github.com/theydvgaurav)


## API Reference

#### Register a user

```http
  POST /register
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name`    | `string` | Name of the user. **Required**.|
| `email`   | `string` | Email of the user. **Required**, **Unique**. |
| `password ` | `string` | Password of the user. **Required**, **Atleast 8 characters long**. |
| `image` | `string` | Image of the user. **Optional** |

#### User Login

```http
  POST /login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`| `string` |  Email of the user. **Required**.            |
| `password`| `string` |  Password of the user. **Required**.            |

#### Resend Confirmation Email

```http
  POST /resend
```

| Parameter | Type     | Description   |
| :-------- | :------- | :-------------|
| `email`| `string` |  Email of the user. **Required**. |

#### Account Confirmation 

```http
  GET /confirm/:confirmationCode
```
Confirmation Code is already appended when user gets the email to confirm the Account

### Get All Users By Search

#### Bearer Token Required

```http
  GET /users?search=
```

| Query Parameter | Type     | Description                |
| :---------------| :------- | :------------------------- |
| `search`        | `string` | Name or Email of the user to search them. **Optional**|

### Create A New Chat

#### Bearer Token Required

```http
  POST /chat
```

| Parameter | Type     | Description                |
| :---------------| :------- | :------------------------- |
| `id`        | `string` | Id of the user with whom the user wants to chat with. **Required**|

### Fetch All Chats 

#### Bearer Token Required

```http
  GET /chat
```
### Create A Group

#### Bearer Token Required
#### Group is just a chat only having an admin and more than 2 users

```http
  POST /group
```

| Parameter | Type     | Description                |
| :---------------| :------- | :------------------------- |
| `name`        | `string` | Name of the Group. **Required**|
| `users`        | `string` | Array of UserIds having atleast 2 values, also in string format **Required**|


### Rename A Group

#### Bearer Token Required and only possible if admin

```http
  PUT /rename
```

| Parameter | Type     | Description                |
| :---------------| :------- | :------------------------- |
| `name`        | `string` | Updated Name of the Group. **Required**|
| `id`        | `string` | Id of the group. **Required**|


### Add To Group

#### Bearer Token Required and only possible if admin

```http
  PUT /groupadd
```

| Parameter | Type     | Description                |
| :---------------| :------- | :------------------------- |
| `user`        | `string` | Id of the user to be added. **Required**|
| `id`        | `string` | Id of the group. **Required**|


### Remove From Group

#### Bearer Token Required and only possible if admin

```http
  PUT /groupremove
```

| Parameter | Type     | Description                |
| :---------------| :------- | :------------------------- |
| `user`        | `string` | Id of the user to be removed. **Required**|
| `id`        | `string` | Id of the group. **Required**|

### Get All Messages

#### Bearer Token Required and only possible if admin

```http
  GET /:chatId
```
### Send A Message

#### Bearer Token Required and only possible if admin

```http
  POST /message
```

| Parameter | Type     | Description                |
| :---------------| :------- | :------------------------- |
| `chatId`        | `string` | Id of the chat, which the message is a part of. **Required**|
| `content`        | `string` | Content of the message. **Required**|


