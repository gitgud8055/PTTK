import puppeteer from "puppeteer";
async function startBrowser() {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: false,
            args: ["--disable-setuid-sandbox"],
            'ignoreHTTPSErrors': true
        });
    } catch (err) {
        console.log("Could not create a browser instance => : ", err);
        return null;
    }
    return browser;
}

export default startBrowser;

