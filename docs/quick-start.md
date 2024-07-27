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
    sudo docker -v
    ```
    Output should be similar to
    ```bash
    $ sudo docker -v
    Docker version 27.0.3, build 7d4bcd8
    ```
6. Pull mondoDB image from docker hub
    ```bash
    sudo docker pull mongo
    ```
7. Run the mongoDB image
    ```bash
    sudo docker run -d -p 27017:27017 --name f1mongo mongo
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