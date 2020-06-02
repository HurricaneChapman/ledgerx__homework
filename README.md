Welcome to my version of the LedgerX Live Trade Dashboard!

Written with Typescript, React and love. And the occaisional assistance of a cat, who is not as good with javascript as she thinks she is, but she keeps trying.

Requires https, so when running it locally you're going to get a big scary security warning. Bypass it by going through "advanced" and saying you want to see the site anyway. Nothing scary is actually happening.

Features:
* Uses React Router to allow full back/forward and bookmarking functionality in the contract detail pages.
* Live updating graphs on contract detail pages.
* Responsive, tested on an Android phone.
* Has the required current BTC price in the contract lists, adjusting its place in the order on the fly as the price updates.
* Graphs include an exponential moving average that updates every time the contract data is refreshed. 
* I hope you like blue.

Known quirks:
* Graphs rely on data collected since the most recent page load. This results in a lot of flat, boring lines. If you leave it open for a few minutes you will start to see some movement on some contracts, but most stay relatively flat. If we were graphing larger data sets, this would probably be a lot more interesting, and wouldn't hit the performance problem I saw with the constant data fetching.
* Graphing library maybe isn't the best for a chart that updates data so frequently. Rapid state updates (ie several every few seconds) could be more performant.
* Graphing library also doesn't play that well with typescript. 
* Resizing in Safari with the details pane open can produce odd results that I didn't have time to debug. Works okay in other browsers, and fixes in Safari with a simple page reload.

I learned a lot about options while figuring out what I was representing on this page, and watched the Bitcoin price go from under $9k to over $10k in a few days. Kind of eye-opening. 

Enjoy.

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
