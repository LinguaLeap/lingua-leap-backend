
# Lingua Leap BackEnd

Restful API developed for Lingua Leap

## Installation and Run

```bash 
  npm install
  ( for local ) npm run dev
```
    
## API Usage

# Auth

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /auth/me | `GET` | Empty | Check auth. |
| /auth/login | `POST` | { "email": "johndoe@google.com", "password": "p4ssw0rd" } | Login with email and password. |
| /auth/register | `POST` | { "familyName": "Doe", "givenName": "John", "emails": [ { "value": "johndoe@google.com" } ], "gender": 1, "birthDate": "2023-12-26T03:57:58.026+00:00", "country": 1, "password": "p4ssw0rd", "mainLanguage": "EN", "otherLanguages": [ { "language": "IT", "level": 2 } ] } | Register with email and pass. |
| /auth/update | `PUT` | { "familyName": "Doe", "givenName": "John", "gender": 1, "birthDate": "2023-12-26T03:57:58.026+00:00", "country": 1, "password": "p4ssw0rd", "mainLanguage": "EN", "otherLanguages": [ { "language": "IT", "level": 2 } ] } | Update your user. |


# Users

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /user/:id | `GET` | Empty | Get the user's info. |
| /users:page | `GET` | Empty | Get users list. |
| /users:page | `POST` | { "displayName": "John Doe", "familyName": "John", "givenName": "Doe", "gender": 1, "birthDate": "2023-12-23T23:19:24.368+00:00", "country": 1, "mainLanguage": "TR", "otherLanguages": [ { "language": "EN", "level": 1 } ] } | Search in users list. |


# Chat

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /chat | `GET` | Empty | Get the list of conversations of own account. |
| /chat | `POST` | { "conversationId": "eff2q344234", "page": 1 } | Get messages of the conversation. |


