// loads from a list of products fetched by SquareLoader.js or StripeLoader.js
import fs from 'fs';

export default class{
    constructor(init)
    {
        if (typeof (init) != "undefined") {
            Object.assign(this, init)
        }
    }
    slugify(sName){
        return sName.replace(" ", "_");
    }
    createProductPages(){
        for(let product of this.products){
            const sFolderName = this.slugify(product.name);
            fs.mkdirSync(`${this.folder}/pages/en/products/${sFolderName}`, { recursive: true });
        }
    }
}