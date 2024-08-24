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