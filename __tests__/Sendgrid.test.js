import { describe, it, expect, beforeEach } from 'vitest';
import Sendgrid from "../src/Sendgrid.js";
import oCreds from './creds.json' assert { type: "json" };

describe("Sendgrid to send email from contact form", () => {
    it("sends an email", async () => {
        let oSendgrid = new Sendgrid({accessToken:oCreds.accessToken, to:"rhildred@gmail.com", from: "rhildred@salesucation.com", template_id: "d-f512978006da4454a0a39c0b49d97781", dynamic_template_data: {name:"Rich Hildred", email:"rhildred@gmail.com", message:"hi there"}});
        const rc = await oSendgrid.email();
        expect(rc.status).toBe(202);
    });
});