
import startBrowser from "./browser.js";
import scrapeAll from "./pageController.js";

//Start the browser and create a browser instance
let browserInstance = startBrowser();

// Pass the browser instance to the scraper controller
if (browserInstance) scrapeAll(browserInstance)
