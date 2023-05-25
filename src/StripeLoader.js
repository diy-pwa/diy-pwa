import Stripe from 'stripe';

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
        this.catalogueList = oJson.data;
        for(const oProduct of this.catalogueList){
            oProduct.price = await this.stripe.prices.retrieve(
                oProduct.default_price
              );
        }
        return this.catalogueList;
    }
}