import Stripe from 'stripe';
import fetch from 'node-fetch';
import fs from 'fs';

export default class{
    constructor(init)
    {
        if (typeof (init) != "undefined") {
            Object.assign(this, init)
        }
        this.stripe = new Stripe(this.secretKey);
    }
    async fetch(){
        let oJson = await this.stripe.products.list();
        return this.catalogueList = oJson.data;
    }
}