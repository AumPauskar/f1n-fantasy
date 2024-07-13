# Quick start

## Installation
1. Find the repository on GitHub and clone it to your local machine.
    ```bash
    git clone https://github.com/AumPauskar/f1n-fantasy.git
    ```
2. Change the directory to the cloned repository.
    ```bash
    cd f1n-fantasy
    ```
3. Ensure you have the latest node and npm packages
    ```bash
    node -v
    npm -v
    ```
    Output should be similar to
    ```bash
    $ node -v
    v20.12.2
    $ npm -v
    10.5.0
    ```
4. Install the required packages.
    ```bash
    cd backend/
    npm i
    ```
5. Ensure that docker is installed
    ```bash
    docker -v
    ```
    Output should be similar to
    ```bash
    $ docker -v
    Docker version 27.0.3, build 7d4bcd8
    ```
6. Pull mondoDB image from docker hub
    ```bash
    docker pull mongo
    ```
7. Run the mongoDB image
    ```bash
    docker run -d -p 27017:27017 --name f1mongo mongo
    ```
8. Start the backend server
    ```bash
    npm run dev
    ```
9. Changes in the mongodb database can be found like this
    ```bash
    sudo docker exec -it f1mongo mongosh
    ```
10. (Optional) If you want to run the backend program via docker
    ```bash
    sudo docker build -t f1n-backend .
    sudo docker run -p 5000:5000 f1n-backend
    ```

## Testing API routes
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