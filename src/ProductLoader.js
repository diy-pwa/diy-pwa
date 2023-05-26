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
        const oConfig = JSON.parse(fs.readFileSync(`${this.folder}/package.json`));
        let aLanguages = oConfig["io_github_diy-pwa_languages"];
        for(let sLanguage of aLanguages){
            for(let product of this.products){
                const sFolderName = this.slugify(product.name);
                fs.mkdirSync(`${this.folder}/pages/${sLanguage}/products/${sFolderName}`, { recursive: true });
            }    
        }
    }
}