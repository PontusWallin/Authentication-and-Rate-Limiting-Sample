# Authentication and Rate Limiting Sample Application

This is a nestjs web application which demonstrates how to implement JWT-based authentication guards and custom made rate limiting guards on to REST endpoints.
## How to use it
Set up the Redis container by running the docker-compose.yml file.

Launch the application from your IDE, or using console commands. The application will run port 3000.

Use any web browser and navigate to http://localhost:3000/api/ to interact with the application using a Swagger RESTful API interface. 

The available endpoints are:

/public/hello - Displays a public message.

/private/hello - Displays a private message. IF you are authenticated with a JWT token.

/auth/token - Generates and sends out the JWT you need for calling /private/hello

### How the rate limiting works.
public endpoints (/auth/token, /public/hello) will block your IP-address if you make more than 200 request in one hour.
private endpoints (/private/hello) will your JWT token if you make more than 100 request in one hour.

One hour after your first request, your IP/Token will unblocked again.

The exact values can be changed from config.env
