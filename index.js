const { chromium } = require('playwright');

const testCases = [
    { firstName: '', lastName: '', postalCode: '', description: 'Semua field kosong' },
    { firstName: 'Ridho', lastName: '', postalCode: '', description: 'LastName & postalCode kosong' },
    { firstName: 'Ridho', lastName: 'Suhendar', postalCode: '', description: 'Postal Code kosong' },
    { firstName: 'Ridho', lastName: 'Suhendar', postalCode: '12345', description: 'Form Valid' },
];

(async () => {
    const browser = await chromium.launch({ headless: false });

    for (let i = 0; i < testCases.length; i++) {
        const test = testCases[i];
        const page = await browser.newPage();
        console.log(`\n Case #${i + 1}: ${test.description}`);

        // Login dan tambah 1 produk
        await page.goto('https://www.saucedemo.com');
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await page.click('text=Add to cart', { index: 0 });
        await page.click('.shopping_cart_link');
        await page.click('#checkout');

        // Isi form checkout dengan data dari test case
        await page.fill('#first-name', test.firstName);
        await page.fill('#last-name', test.lastName);
        await page.fill('#postal-code', test.postalCode);
        await page.click('#continue');

        // Cek apakah lanjut ke summary atau error muncul
        try {
            await page.waitForSelector('.summary_info', { timeout: 2000 });
            // Klik Finish
            await page.click('#finish');
            await page.waitForSelector('.complete-header', { timeout: 2000 });
            await page.waitForTimeout(2000)
            console.log('Checkout berhasil sampai halaman selesai');
        } catch (err) {
            const errorText = await page.textContent('[data-test="error"]');
            console.log(`Error muncul : ${errorText.trim()}`);
        }

        await page.close();
    }

    await browser.close();
})();
