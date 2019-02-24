# AUTH API

## 1. localRegister API

> 입력받은 data로 User를 생성한다.

### URL

api/v1/auth/register/local


### Method

POST

### DataParams

| key           | Description   | Type    |
| :------------ | :-----------: | ------: |
| username      | 유저명         | string  |
| email         | 이메일         | string  |
| password      | 비밀번호       | string  |


### Success Response

* HTTP Status code 200

* response
    ```javascript
    { 
        ok: true
        error: null
        payload: {
            user: {
                id: 유저의 uuid값,
                username: 유저의 유저명,
                thumbnail: 썸네일
            },
            access_token: jwt 토큰값,
            refresh_token: jwt 토큰값
        }
    }
    ```

### Error response

* HTTP Status code 400
    
    데이터 파라미터 유효성 검사 실패
    ```javascript
        {
            ok: false,
            error: {
                name: "유효성 검사 오류",
                message: Joi error message
            payload: null
        }
    ```
* HTTP Status code 409
    ```javascript
        {
            ok: false,
            error: {
                name: 'DUPLICATED_ACCOUNT',
                message: 'email' 또는 'username'
            }
            payload: null
        }
    ```
* HTTP Status code 500
    ```javascript
        서버 or 데이터베이스 에러
    ```


## 2. checkExists API

> 요청한 데이터가 이미 존재하는 값이인지 확인하고 그 값을 boolean 형태로 반환

### Method

GET api/v1/auth/exists/:key(email|username)/:value

### DataParams

| key           | Description   | Type    |
| :------------ | :-----------: | ------: |
| key           | 이메일 or 유저명 타입 | string  |
| value         | 데이터         | string  |

### Success Response

* HTTP Status code 200

* response
    ```javascript
    { 
        ok: true
        error: null
        payload: {
            exists: true or false
        }
    }
    ```

### Error response

* HTTP Status code 500
    ```javascript
        서버 or 데이터베이스 에러
    ```


## 3. localLogin API

> 유저가 로그인하는 API입니다.

### URL

api/v1/auth/login/local


### Method

POST

### DataParams

| key           | Description   | Type    |
| :------------ | :-----------: | ------: |
| email         | 이메일         | string  |
| password      | 비밀번호       | string  |


### Success Response

* HTTP Status code 200

* response
    ```javascript
    { 
        ok: true
        error: null
        payload: {
            user: {
                id: 유저의 uuid값,
                username: 유저의 유저명,
                thumbnail: 썸네일
            },
            access_token: jwt 토큰값,
            refresh_token: jwt 토큰값
        }
    }
    ```

### Error response

* HTTP Status code 400
    
    데이터 파라미터 유효성 검사 실패
    ```javascript
        {
            ok: false,
            error: {
                name: "유효성 검사 오류",
                message: Joi error message
            payload: null
        }
    ```
* HTTP Status code 403
    비밀번호가 틀린경우 or 계정이 존재하지 않는 경우
    ```javascript
        {
            ok: false,
            error: {
                name: 'ERROR EXIST',
                message: '계정을 찾을 수 없습니다.' 또는 '비밀 번호가 일치하지 않습니다.'
            }
            payload: null
        }
    ```
* HTTP Status code 401
    유저의 프로필 생성이 안된 경우
    ```javascript
        {
            ok: false,
            error: {
                name: 'ERROR PROFILE',
                message: '유저 프로필이 존재하지 않습니다. 다시 가입해주세요'
            }
            payload: null
        }
    ```

* HTTP Status code 500
    ```javascript
        서버 or 데이터베이스 에러
    ```

## 4. sendEmail API

> 이메일이 실제 존재하는 이메일인지 확인하는 API

### URL

api/v1/auth/sendEmail

### Method

POST

### DataParams

| key           | Description   | Type    |
| :------------ | :-----------: | ------: |
| email         | 이메일         | string  |


### Success Response

* HTTP Status code 200

* response
    ```javascript
    { 
        ok: true
        error: null
        payload: {
            code
        }
    }
    ```

### Error response

* HTTP Status code 400
    
    데이터 파라미터 유효성 검사 실패
    ```javascript
        {
            ok: false,
            error: {
                name: "유효성 검사 오류",
                message: Joi error message
            payload: null
        }
    ```

* HTTP Status code 500
    ```javascript
        서버 or 데이터베이스 에러
    ```

## 5. checkCode API

> 발급한 코드가 실제로 서버측에서 발급한 코드인지 확인하느 API

### URL

api/v1/auth/sendEmail/check/:code

### Method

GET

### DataParams

| key           | Description   | Type    |
| :------------ | :-----------: | ------: |
| code          | 이메일 인증코드| string  |


### Success Response

* HTTP Status code 200

* response
    ```javascript
    { 
        ok: true
        error: null
        payload: {
            exists: true
        }
    }
    ```

### Error response

* HTTP Status code 400
    
    데이터 파라미터 유효성 검사 실패
    ```javascript
        {
            ok: false,
            error: {
                name: "유효성 검사 오류",
                message: Joi error message
            payload: null
        }
    ```

* HTTP Status code 409
    
    존재하지 않는 코드
    ```javascript
        {
            ok: false,
            error: {
                name: 'ERROR CERTIFICATION',
                message: '인증 코드가 발급 되지않은 이메일입니다.'
            }
            payload: {
                exists: false
            }
        }
    ```

* HTTP Status code 500
    ```javascript
        서버 or 데이터베이스 에러
    ```

## 5. logout API

> 서버에서 로그아웃하는 api

### URL

api/v1/auth/logout

### Method

POST

### DataParams


### Success Response

* HTTP Status code 200
