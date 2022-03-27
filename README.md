# Full stack project

## Requirements

This project requires Node 16 or above, npm, and Postgres database. The project was developed using PostgresSql 14.2.

## Setting up

This is a mono-repo project. Each directory in /packages/ contains a package.

The frontend is developed in [React](https://reactjs.org/).

The backend is developed in [NestJS](https://nestjs.com/).

See their respective documentation for more information.

All following commands are run from the root of the project.

-   ### Install dependencies:

    ```
    npm install
    ```

-   ### Configure environment variables:

    The backend server requires some environment variables to be set. See the
    sample [`.env` file](./packages/server/.env.sample) for more information.

    Environment variables can be provided in a `.env`
    file at the root of the server package

-   ### Configure database:

    The app expects the database to have some tables created. Load the
    [`ddl.sql` file](./packages/server/schema/ddl.sql) into your database.

-   ### Start the backend server:

    ```
    npm run start:server
    ```

-   ### Start the frontend server:
    In another terminal:
    ```
    npm run start:client
    ```

## Deployment

[Docker](https://www.docker.com/) is the recommended deployment method.

- ### Build the Docker image:

    A [Dockerfile](./Dockerfile) is provided at the root of the project.

    Build the image with:

    ```
    docker build . -t app
    ```

    Change the tag as needed.

- ### Run the Docker image:

    A working example [docker-compose.yml](./deploy/docker-compose.yml) is provided. 

    Provide the schema files in the Postgres volume, and change the environment variables as needed.

    Start the deployment with:

    ```
    docker-compose up -d
    ```
