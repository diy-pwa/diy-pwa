import { describe, it, expect, beforeEach } from 'vitest';
import ProductLoader from "../src/ProductLoader.js";
import ZipLoader from "../src/ZipLoader.js";
import fs from 'fs';

const testFolder = "test2";

beforeEach(async()=>{
    await fs.promises.rm(testFolder, { recursive: true, force: true });
});

describe("Product Loader Creates product pages and data", () => {
    it("creates a list of product pages", async () => {
        let oZipLoader = new ZipLoader();
        await oZipLoader.load("https://github.com/diy-pwa/coming-soon/archive/refs/heads/main.zip", testFolder);
        await oZipLoader.unzip();

        const sName = "Test Product";
        const sFrenchName = "Tester le produit";
        let oProductLoader = new ProductLoader({products: [{name: sName, description: "this is a test product", metadata:{fr_name: sFrenchName, fr_description: "c'est un produit test"}}], folder:testFolder});
        await oProductLoader.createProductPages();
        expect(fs.existsSync(`${testFolder}/pages/en/products/${oProductLoader.slugify(sName)}`)).toBe(true);
        expect(fs.existsSync(`${testFolder}/pages/fr/products/${oProductLoader.slugify(sFrenchName)}`)).toBe(true);
        expect(fs.existsSync(`${testFolder}/pages/en/products/${oProductLoader.slugify(sName)}/product.json`)).toBe(true);
        expect(fs.existsSync(`${testFolder}/pages/fr/products/${oProductLoader.slugify(sFrenchName)}/product.json`)).toBe(true);
        expect(fs.existsSync(`${testFolder}/pages/en/products/${oProductLoader.slugify(sName)}/index.page.jsx`)).toBe(true);
        expect(fs.existsSync(`${testFolder}/pages/fr/products/${oProductLoader.slugify(sFrenchName)}/index.page.jsx`)).toBe(true);
    });
});