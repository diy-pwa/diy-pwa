import { describe, it, expect, beforeEach } from 'vitest';
import Dev from "../src/Dev.js";
import request from 'supertest';

describe("tests for a dev mode",()=>{
    it("looks for a special url", async()=>{
        const oDev = new Dev();
        const res = await request(oDev.app).get("/test");
        expect(res.status).toBe(200);
    });
    it("gets the README", async()=>{
        const oDev = new Dev();
        const res = await request(oDev.app).get("README.md");
        expect(res.status).toBe(200);
    })
})