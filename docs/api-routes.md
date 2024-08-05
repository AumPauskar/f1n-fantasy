# API routes
These API routes can be tested via a REST client like Postman or Insomnia. The routes are as follows:

1. Database connection testing
    - Route: `/test`
    - Method: `GET`
    - Expected output: Successfully connected to MongoDB
    - Unsuccessful output: Internal server error
    - Example: `http://localhost:5000/test`
2. Adding new users
    - Route: `/api/v1/createusers`
    - Method: `POST`
    - Body: json
        ```json
        {
        "name": "John Doe",
        "passwd": "123"
        }
        ```
    - Expected output: User created
    - Unsuccessful output: 
    - Example: `http://localhost:5000/api/v1/createusers`
3. Getting all users
    - Route: `/api/v1/getusers`
    - Method: `GET`
    - Body: json
        ```json
        {
        "name": "root",
        "passwd": "root"
        }
        ```
    - Expected output: List of all users
        ```json
        [
            {
                "name": "root",
                "passwd": "passed"
            }
        ]
        ```
    - Unsuccessful output: Internal server error
    - Example: `http://localhost:5000/api/v1/getusers`
4. Adding race round details
    - Route: `/api/v1/addraceresults`
    - Method: `POST`
    - Body: json
        ```json
        {
            "name": "root",
            "passwd": "rot",
            "rd": 10,
            "results": [63, 81, 55, 44, 1, 27, 11, 20, 3, 10],
            "dnf": []
        }
        ```
        **Note:** DNF can be an empty array or may be a populated array
    - Expected: `added`
    - Unsuccessful output: Internal server error (500), unauthorized (401), round already exists (409)
    - Example: `http://localhost:5000/api/v1/addraceresult`
5. User predictions
    - Route: `/api/v1/userpredictions`
    - Method: `POST`
    - Body: json
        ```json
        {
            "name": "root",
            "passwd": "root",
            "rd": 10,
            "predictions": [63, 81, 55, 44, 1, 27, 11, 20, 3, 10]
        }
        ```
    - Expected output: `Predictions added`
    - Unsuccessful output: Internal server error (500), unauthorized (401), round already exists (409)
    - Example: `http://localhost:5000/api/v1/userpredictions`
6. Validating user predictions (in progress)
    - Route: `/api/v1/validatepredictions`
    - Method: `POST`
    - Body: json
        ```json
        {
            "name": "root",
            "passwd": "root",
            "rd": 10
        }
        ```
    - Expected output: `Validated`
    - Unsuccessful output: Internal server error (500), unauthorized (401), round already exists (409)
    - Additional notes: 
    - Example: `http://localhost:5000/api/v1/validatepredictions`
7. Getting all race results
    - Route: `/api/v1/checkallraceresults`
    - Method: `GET`
    - Expected output: List of all results arranged with rounds
8. Updating user predictions
    - Route: `/api/v1/updatepredictions`
    - Method: `POST`
    - Body: json
        ```json
        {
            "name": "root",
            "passwd": "root",
            "rd": 10,
            "predictions": [1, 4, 16, 81, 55, 44, 63, 11, 18, 22]
        }
        ```
    - Expected output: `Predictions updated`
    - Unsuccessful output: Internal server error (500), unauthorized (401), round already exists (409)
    - Example: `http://localhost:5000/api/v1/updatepredictions`
9. Getting user predictions
    - Route: `/api/v1/userpredictions`
    - Method: `GET`
    - Body: json
        ```json
        {
            "name": "John Doe",
            "passwd": "123",
            "rd": "10"
        }
        ```
10. Validate predictions and give points (under progress)
    - Route: `/api/v1/validatepredictions`
    - Method: `GET`
    - Body: json
        ```json
        {
            "name": "John Doe",
            "passwd": "123",
            "rd": "10"
        }
        ```