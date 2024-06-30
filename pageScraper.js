import fs from "fs/promises";
const scraperObject = {
    url: 'https://www.vietnambooking.com/hotel/vietnam/khach-san-vung-tau.html?q=1&ht=4,5',
    async scraperItem(browser, link) {
        return new Promise(async (resolve, reject) => {
            try {
                let dataObj = {
                    "userRef": "666abbf9339e0667cc139c70",
                    "createdAt": {
                        "$date": "2024-06-20T10:05:00.326Z"
                    },
                    "updatedAt": {
                        "$date": "2024-06-20T10:05:00.326Z"
                    },
                    "__v": 0
                };
                let newPage = await browser.newPage();
                console.log(`Navigating to ${link}...`);
                await newPage.goto(link, { timeout: 10000 }).catch(e => { });
                await newPage.waitForSelector('.box-system-room-inner', { timeout: 10000 }).catch(e => { });
                dataObj['name'] = await newPage.$eval('.box-title.hotel-title>h1', text => text.textContent).catch(() => "");
                dataObj['type'] = await newPage.$eval('.box-title.hotel-type', text => text.textContent).catch(() => "");
                dataObj['description'] = await newPage.$eval('.content-introduce', text => text.textContent.trim()).catch(() => "");
                dataObj['address'] = await newPage.$eval('.box-address.hotel-address', text => text.textContent).catch(() => "");
                dataObj['regularPrice'] = await newPage.$eval('.price-old>.old>.old', text => text.textContent).catch(() => "");
                dataObj['discountPrice'] = await newPage.$eval('.price-medium', text => text.textContent).catch(() => "");
                dataObj['smoking'] = await newPage.$eval('.ficon.ficon-non-smoking-room', () => false).catch(() => true);
                dataObj['bar'] = await newPage.$eval('.ficon.ficon-mini-bar', () => false).catch(() => true);
                dataObj['wifi'] = await newPage.$eval('.ficon.ficon-wifi', () => false).catch(() => true);
                dataObj['parking'] = await newPage.$eval('.ficon.ficon-garden', () => false).catch(() => true);
                const regularPrice = dataObj['regularPrice'];
                const discountPrice = dataObj['discountPrice'];
                dataObj['offer'] = (regularPrice && discountPrice && regularPrice != discountPrice) ? true : false;
                dataObj['imageUrls'] = await newPage.$$eval('.box-item-content img', imgs => imgs.map(img => img.src)).catch(() => []);
                dataObj['ratings'] = await newPage.$$eval('.fa.fa-star', stars => stars.length).catch(() => 0);
                dataObj['numReviews'] = 0;
                dataObj['reviews'] = [];
                resolve(dataObj);
                await newPage.close();
            } catch (err) {
                reject(err);
            }
        });
    },
    async scraper(browser) {
        let page = await browser.newPage();
        console.log(`Navigating to ${this.url}...`);
        // Navigate to the selected page
        await page.goto(this.url);
        // Wait for the required DOM to be rendered
        await page.waitForSelector('.hotel-cat-box-list-data');
        // Get the link to all the required books
        let urls = await page.$$eval('.hotel-cat-box-list-data ul > li', links => {
            // Extract the links from the data
            links = links.map(el => el.querySelector('.box-content > a').href)
            return links;
        });
        for (let i = 0; i < urls.length; i++) {
            let currentPageData = await this.scraperItem(browser, urls[i]);
            console.log('currentPageData', currentPageData);
            await fs.appendFile('listing.json', JSON.stringify(currentPageData, null, 2) + ',\n');
        }
    }
}

export default scraperObject;
