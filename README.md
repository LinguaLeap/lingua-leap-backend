
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

# User

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /user/:id | `GET` | Empty | Get the user's info. |

# Users

| Route | HTTP Verb	 | POST body	 | Description	 |
| --- | --- | --- | --- |
| /users:page | `GET` | Empty | Get users list. |
| /users:page | `POST` | { "displayName": "John Doe", "familyName": "John", "givenName": "Doe", "gender": 1, "birthDate": "2023-12-23T23:19:24.368+00:00", "country": 1, "mainLanguage": "TR", "otherLanguages": [ { "language": "EN", "level": 1 } ] } | Search in users list. |


