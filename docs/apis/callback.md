# CALLBACK API

## 1. redirectGoogleLogin API

> 구글 auth 작업을 하기위해 필요한 api

### URL

api/v1/auth/callback/google/login

### Method

GET

### DataParams

| key           | Description   | Type    |
| :------------ | :-----------: | ------: |
| next          | 다음URL       | string or undefind  |

### Success Response

* HTTP Status code 200

* response
   ```javascript
        {
            redirect: http://localhost:6000/api/v1/auth/callback/google
        }
    ```

## 2. redirectFacebookLogin API

> 페이스북 auth 작업을 하기위해 필요한 api

### URL

api/v1/auth/callback/facebook/login

### Method

GET

### DataParams

| key           | Description   | Type    |
| :------------ | :-----------: | ------: |
| next          | 다음URL       | string or undefind  |

### Success Response

* HTTP Status code 200

* response
   ```javascript
        {
            redirect: http://localhost:6000/api/v1/auth/callback/facebook
        }
    ```


## 3. googleCallback API

> Google Auth Callback API

### URL

api/v1/auth/callback/google

### Method

GET

### DataParams

| key           | Description   | Type    |
| :------------ | :-----------: | ------: |
| code          | 인증코드       | string  |
| state         | url 데이터     | string  |

### Success Response

* HTTP Status code 200

* response
   ```javascript
        {
            redirect: http://localhost:3000/callback?type=google&key=${hash}
        }
    ```

### Error response

* HTTP Status code 401
    
    토큰 or 세션이 안만들어졌을 때
    ```javascript
        {
            status: 401
        }
    ```

    코드 or 액세스 토큰이 안만들어졌을 때
    ```javascript
        {
            status: 401
            redirect: http://localhost:3000/?callback?error=1
        }
    ```

* HTTP Status code 500
    ```javascript
        서버 or 데이터베이스 에러


## 4. facebookCallback API

> Facebook Auth Callback API

### URL

api/v1/auth/callback/facebook

### Method

GET

### DataParams

| key           | Description   | Type    |
| :------------ | :-----------: | ------: |
| code          | 인증코드       | string  |
| state         | url 데이터     | string  |

### Success Response

* HTTP Status code 200

* response
   ```javascript
        {
            redirect: http://localhost:3000/callback?type=facebook&key=${hash}
        }
    ```

### Error response

* HTTP Status code 401
    
    토큰 or 세션이 안만들어졌을 때
    ```javascript
        {
            status: 401
        }
    ```

    코드 or 액세스 토큰이 안만들어졌을 때
    ```javascript
        {
            status: 401
            redirect: http://localhost:3000/?callback?error=1
        }
    ```

* HTTP Status code 500
    ```javascript
        서버 or 데이터베이스 에러

## 5. githubCallback API

> Github Auth Callback API

### URL

api/v1/auth/callback/github

### Method

GET

### DataParams

| key           | Description   | Type    |
| :------------ | :-----------: | ------: |
| code          | 인증코드       | string  |

### Success Response

* HTTP Status code 200

* response
   ```javascript
        {
            redirect: http://localhost:3000/callback?type=github&key=${hash}

        }
    ```

### Error response

* HTTP Status code 401
    
    토큰 or 세션이 안만들어졌을 때
    ```javascript
        {
            status: 401
        }
    ```

    코드 or 액세스 토큰이 안만들어졌을 때
    ```javascript
        {
            status: 401
            redirect: http://localhost:3000/?callback?error=1
        }
    ```

* HTTP Status code 500
    ```javascript
        서버 or 데이터베이스 에러


## 6. getToken API

> 세션에서 액세스 토큰을 가져온다.

### URL

api/v1/auth/callback/token

### Method

GET

### Success Response

* HTTP Status code 200

* response
   ```javascript
        {
            ok: true,
            error: null,
            payload: {
                token: 액세스 토큰값
            }
        }
    ```

### Error response

* HTTP Status code 401
    
    토큰이 안만들어졌을 때
    ```javascript
        {
          ok: false,
          error: {
            name: 'Social Token Error',
            message: '토큰이 존재하지 않습니다'
          },
          payload: null
        }
    ```

    세션이 안만들어졌을 때
    ```javascript
        {
            ok: false,
            error: {
                name: 'Session Error',
                message: '세션이 없습니다.'
            },
            payload: null
        }
    ```

* HTTP Status code 500
    ```javascript
        서버 or 데이터베이스 에러