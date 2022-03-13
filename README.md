
# Realtime Chat Aapp

A realtime chat app built using React.js, Node.js and Socket.io. With proper authentication and added functionalities like Groupchat etc.



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
| `name`    | `string` | **Required**.|
| `email`   | `string` | **Required**, **Unique**. |
| `password ` | `string` | **Required**, **Atleast 8 characters long**. |
| `image` | `string` | Optional |

#### User Login

```http
  POST /login
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `email`| `string` | **Required**.            |
| `password`| `string` | **Required**.            |

#### Resend Confirmation Email

```http
  POST /resend
```

| Parameter | Type     | Description   |
| :-------- | :------- | :-------------|
| `email`| `string` | **Required**. |

#### Account Confirmation 

```http
  GET /confirm/:confirmationCode
```
Confirmation Code is already appended when user gets the email to confirm the Account



