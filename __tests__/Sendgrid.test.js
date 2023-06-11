import { describe, it, expect } from 'vitest';
import request from 'supertest';
import createApp from './ExpressFixture.js';

describe("tests email cloudflare worker", ()=>{
    it("sends email json encoding", async () =>{
        const app = createApp();
        const res = await request(app)
        .post('/api/contact')
        .send({name: "Rich Hildred", email:"rhildred@gmail.com", message:"Hi there from json."})
        .set('Content-Type', 'application/json')
        .set('Accept', 'application/json');
        if(res.status != 202){
            console.log(res.body);
        }
        expect(res.status).toBe(202);
    });
    it("sends email application/x-www-form-urlencoded encoding", async () =>{
        const app = createApp();
        const res = await request(app)
        .post('/api/contact')
        .send("name=Rich&email=rhildred%40gmail.com&message=Hi+there+from+Rich+from+form")
        .set('Content-Type', 'application/x-www-form-urlencoded')
        .set('Accept', 'application/x-www-form-urlencoded');
        if(res.status != 202){
            console.log(res.body);
        }
        expect(res.status).toBe(202);
    });
})