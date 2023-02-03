# flickr-app-test

## Getting Started
The flickr-app microservice communicates to flickr and retrieves photos, 

An interface is setup in `src/interfaces/IConfig.ts` where any configuration used by the application must be defined. This prevents using `any` within the application ultimately making it more clear what can be used.

Required configuration can be found in `config/default.js` as well as `src/interfaces/IConfig`

## API Authentication
The APIs are authenticated via Auth0. The APIs will throw authentication error when accessing without bearer token.

### Local development

Install required packages: `npm install`

Run Unit and Integration tests:

```bash
npm test
```

Build and run locally:

```bash
# Start in development mode:
FLICKR_API_KEY=********** npm run start:dev
```
The flickr api key has to be generated.Please see below instruction for creating flickr api key.
https://www.flickr.com/services/api/misc.api_keys.html

Postman Collection:
The postman collection is part of the codebase. Import it into postman for testing the api locally.

### Environment Variables

The following environment variables are not required but can be passed in to run the application:

- `FLICKR_API_KEY`

## Build & Deploy

To run: `npm start`

## Running

```bash
npm start
```

## System Testing

To run system testing, you will need to have the following:

- Installed __node modules__ via: `npm install`

Once these dependencies are installed and running, run: `npm run test:st`

## Conventions
### Directory structure

```bash
 /
 |- config/              # Config file per environment. For running in containerised environment, set NODE_ENV
 |- src/api/middlewares/ # Contains any custom middleware functions to use with Express
 |- src/api/routes/      # Contains all routes for the application
 |- src/api/schemas/     # Contains all schemas that are used to validate requests to any routes
 |- src/components/      # Contains components of the application necessary for the application to function
 |- src/services/        # Contains the business logic
 |- src/interfaces/
 |- src/utils/           # Miscellaneous helper functions
 |- test/                # For integration and system tests
 |- src/App.ts           # Boilerplate setup to start/stop the components of the application
 |- src/server.ts        # Code to run application as a stand-alone service.
 |- src/index.ts         # Entrypoint to startup the application
```

### Filenames
* Classes - <PascalCase>.ts
* Interfaces - I<PascalCase>.ts (Do prefix with I)
* Unit Tests - <PascalCase>.unit.test.ts
* Integration Tests - <PascalCase>.int.test.ts, place in test/integration/
* System Tests - <PascalCase>.st.test.ts, place in test/st/
