import { describe, it, expect, beforeEach } from 'vitest';
import StripeLoader from "../src/StripeLoader.js";
import fs from 'fs';
import oCreds from './creds.json' assert { type: "json" };

beforeEach(async()=>{
    await fs.promises.rm("test", { recursive: true, force: true });
});

describe("Stripe loader is to load from", () => {
    it("downloads a .list of products", async () => {
        let oStripeLoader = new StripeLoader({secretKey:oCreds.secretKey, baseUrl:"https://api.stripe.com"});
        const oCatalogue = await oStripeLoader.fetch();
        expect(oCatalogue.objects.length).toBeGreaterThan(0);
    });
});