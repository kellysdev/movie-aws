# PopOpolis

The client-side of a CRUD movie application built with React and Bootstrap to be hosted on AWS.  It supports server-side code for a REST API and database built with Node.js, Express.js, MongoDB, and the AWS SDK.

This is a single-page, responsive app with routing, several interface views, and a polished user experience.

## Features

- Users can create an account and login to the app.
- Users can browse a list of movies.
- Users can select a movie for more details.
- Users can add and remove movies from a list of their favorite movies.
- Users can view their account information and their list of favorite movies from a Profile view.
- Users can update their account information.
- Users can upload a profile image (this sets that image as their profile image).
- Users can view images from the bucket their profile image is uploaded to.
- Users can change their profile image.
- Users can loggout of the app and deregister their accounts.

## Dependencies

    "bootstrap": "^5.3.2",
    "prop-types": "^15.8.1",
    "react": "^18.2.0",
    "react-bootstrap": "^2.9.0",
    "react-dom": "^18.2.0",
    "react-router": "^6.16.0",
    "react-router-dom": "^6.16.0"

## Getting Started

To get a local copy up and running, follow these steps:

1. Clone this repository: `git clone https://github.com/kellysdev/movie-aws.git`
2. From the working directory, install the app's dependencies: `npm i`
3. Start the project with `npx parcel src/index.html`

## Link

[You can find the server-side respository here](https://github.com/kellysdev/movie-api)
