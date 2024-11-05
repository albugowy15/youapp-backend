# YouApp - Backend Technical Test

## Routes

### Auth

#### Register

- path: `/auth/register`
- method: `POST`
- body:
  ```json
  {
    "email": "johndoe@mail.com",
    "username": "johndoe",
    "password": "password",
    "confifm_password": "confifm_password"
  }
  ```
- status code: 201
- response body:
  ```json
  {
    "status_code": 201,
    "message": "Created"
  }
  ```

#### Login

- path: `/auth/login`
- method: `POST`
- body:
  ```json
  {
    "identifier": "johndoe@mail.com",
    "password": "password"
  }
  ```
- status code: 200
- response body:
  ```json
  {
    "status_code": 201,
    "message": "OK",
    "data": {
      "access_token": "jwt-token",
      "refresh_token": "refresh_token",
      "exp": 16261626121
    }
  }
  ```

### Profile

#### Get user profile

- path: `/user/profile`
- method: `GET`
- status code: 200
- response body:
  ```json
  {
    "status_code": 200,
    "message": "OK",
    "data": {
      "about": {
        "profile_picture": "imagekey",
        "display_name": "John Doe",
        "gender": "male",
        "birthday": "28-02-1999",
        "horoscope": "Virgo",
        "zodiac": "Pig",
        "height_cm": 176,
        "weight_kg": 65
      },
      "interests": ["Music", "Basketball", "Fitness"]
    }
  }
  ```

#### Update user profile

- path: `/user/profile`
- method: `PATCH`
- body:

  ```json
  {
    "about": {
      "profile_picture": "imagekey",
      "display_name": "John Doe",
      "gender": "male",
      "birthday": "28-02-1999",
      "horoscope": "Virgo",
      "zodiac": "Pig",
      "height_cm": 176,
      "weight_kg": 65
    },
    "interests": ["Music", "Basketball", "Fitness"]
  }
  ```

- status code: 200
- response body:
  ```json
  {
    "status_code": 200,
    "message": "OK"
  }
  ```
