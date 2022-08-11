# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

# jbook

A CLI (Command-line Interface) designed to be installed on your machine to launch an interactive development environment for writing and documenting code inside your browser.
It is like a Jupyter Notebook, but for Javascript.

This ReadMe is the process to build the app.

## Three Big Challenges

1. Code will be provided to Preview as a string. We have to execute it safely.
2. This code might have advanced JS syntax in it (like JSX) that your browser can't execute.
3. The code might have import statements for other JS files or CSS. We have to deal with those import statements before executing the code.

## Problem 2

Problem 2 can be solved if we can get Babel working in our React app.

**Transpiling option 1:**
We send the user's code from our React app to a Backend API Server where we can run Babel and transpile the user's code there and send back an immediate response with that transpiled code.

**Transpiling option 2:**
Using an in-browser transpiler. We would take the user's code, throw it into the transpiler and immediately get out a transpiled result. Which in theory would be safe to execute inside of the user's brower as all the advanced JS syntax (like JSX) would be removed.

## Problem 3

Javascript Modules
: Javascript file that makes some values available to other files and/or consumes values from other files.

There are several different module systems. The two I will be focusing on are **commonJS** and **ES Modules**.

Bundler
: Reads the contents of the entry file (like index,js). It automatically finds all the different require/import/export statements and finds all the modules on our hard drives. Then links these files together into a single output file with all values being correctly communicated around.

We want a bundler that works _slightly differently_. Rather than trying to find a module on our hard drive when a user writes out an import statement, we want our _slightly different_ bundler instead to find the module directly from NPM and directly get the source code for that module and include it inside of our output bundle.

**Bundling option 1:**
We send the user's code from our React app to a Backend API Server that is going to be running Webpack. Webpack will process the code and find an import statement that might not be installed locally on the server. This would usually throw an error. However we can override this error using npm-install-webpack-plugin. It will automatically install the module directly from NPM on the API Server and allow Webpack to continue on with the bundling process as usual. Then, we send back the bundled code to our React app to execute it.

However, this process doesn't make much sense. It means that we will be installing module, after module, after module on our server over time. With that in mind, I can think of two other solutions.

**Bundling option 2:**
Almost identical in nature to the first option, we have a backend API running Webpack. Whenever Webpack finds an import statement, we intercept that statement by writing our own custom plug-in. Whenever someone tries to import something, we make a request ourselves to the NPM registry, get the source code for the module and return it to Webpack to continue with the bundling process. The difference is that we are not going to actively save the dependency on our local machine / server. Instead, we reach out every single time to the NPM registry whenever someone tries to import a module . Then, we send back the bundled code to our React app to execute it.

**Bundling option 3:**
Implementing the bundling process into our React application. No backend API, which should speed up the process of running the user's code. It is now up to the user's machine to reach out to npm and download an individual file instead of having tons of requests coming from our server.

**Pros and Cons:**
Remote | Local |
|:--------:| -------------:|
| We can cache downloaded NPM modules to bundle code faster| Removes an extra request to the API server - faster code execution |
| Will work better for useres with slow devices or limited internet connections | We don't have to maintain an API server |
| | Less complexity - no moving code back and forth

For our case, Local is the better option. However, the problem is that webpack doesn't work in the browser.

## In conclusion

As Babel can run in the browser but Webpack can not, we will be using ESBuild replacing both. It can transpile and bundle our code in the browser.

## ESBuild

When we bundle, ESBuild tries to find dependencies on your hard drive. However, we're running ESBuild in the browser. There is no file system access.
As it stands, ESBuild will throw an error as soon as we tell it to bundle anything.

Therefore, when a user writes an import statement for an NPM module, we want to intercept that process of ESBuild trying to figure out what path on your file system it should look at. So, we will fetch the url for the module ourselves from the NPM registry and provide it back directly into ESBuild.
For this, we will be using **unpkg**.

## Problem 1

Considerations around code execution:

- User-provided code might throw errors and cause our program to crash --> solved if we execute a user's code in an iframe

- User-provided code might mutate the DOM, causing our program to crash --> solved if we execute a user's code in an iframe

- A user might accidentally run code provided by another malicious user --> solved if we execute a user's code in an iframe with durect communication disabled

Using iframe
Direct access between frames is allowed when the iframe element does not have a 'sandbox' property, or has a 'sanbox="allow-same-origin" property, and we fetch the parent HTML doc and the frame GTML doc from the exact same domain, port, and protocol (http vs https).
