import { describe, it, expect, beforeEach } from 'vitest';
import ProductLoader from "../src/ProductLoader.js";
import fs from 'fs';

const testFolder = "test2";

beforeEach(async()=>{
    await fs.promises.rm(testFolder, { recursive: true, force: true });
});

describe("Product Loader Creates product pages and data", () => {
    it("creates a list of product pages", async () => {
        const sName = "Test Product";
        let oProductLoader = new ProductLoader({products: [{name: sName}], folder:testFolder});
        await oProductLoader.createProductPages();
        expect(fs.existsSync(`${testFolder}/pages/en/products/${oProductLoader.slugify(sName)}`)).toBe(true);
    });
});