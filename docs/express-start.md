# Express start

A short step-by-step guide to get you started with the whole setup.

## Software to be installed
1. Docker and docker-compose
2. Node and npm

## Steps to start the project
1. Clone the repository
    ```bash
    git clone https://github.com/AumPauskar/f1n-fantasy.git
    ```
2. Change the directory to the cloned repository
    ```bash
    cd f1n-fantasy
    ```
3. Ensure you have the latest node and npm packages
    ```bash
    node -v
    npm -v
    ```
4. Ensure that docker and docker-compose is installed
    ```bash
    sudo docker -v
    sudo docker-compose -v
    ```
5. Install the packages
    ```bash
    cd backend/
    npm i
    cd ../frontend/
    npm i
    ```
6. Pull the mongoDB image from docker hub
    ```bash
    sudo docker pull mongo
    ```
7. Create a `.env` file in the backend directory with the following content
    (work pending)
8. Run the docker-compose file (project home directory)
    ```bash
    sudo docker-compose up
    ```
9. The frontend can be accessed at `localhost:3000` and the backend at `localhost:5000`

## Creating the `.env` file
1. Create a `.env` file in the backend directory (backend/.env)
2. Add the content (and change the bits listed below) to the file
    ```env
    MONGO_URL=mongodb://localhost:27017
    PORT=5000
    JWT_SECRET=secret
    CURRENT_ROUND=14
    CURRENT_ROUND_START_DATE=23-08-2024
    CURRENT_ROUND_END_DATE=25-08-2024
    CURRENT_ROUND_DESCRIPTION=Dutch GP
    ```
    - `MONGO_URL`: The URL of the mongoDB database (not recommended to change if you are using docker to host the database)
    - `PORT`: The port on which the backend server will run (not recommended to change)
    - `JWT_SECRET`: The secret key used to sign the JWT tokens (change this to a random string, anything will work)
    - `CURRENT_ROUND`: The current round of the F1 season (change this to the current round of the season)
    - `CURRENT_ROUND_START_DATE`: The start date of the current round (change this to the start date of the current round)
    - `CURRENT_ROUND_END_DATE`: The end date of the current round (change this to the end date of the current round)
    - `CURRENT_ROUND_DESCRIPTION`: The description of the current round (change this to a short description of the current round)