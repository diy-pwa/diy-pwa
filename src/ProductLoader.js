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
                const sFolderName = `${this.folder}/pages/${sLanguage}/products/${this.slugify(product.name)}`;
                fs.mkdirSync(sFolderName, { recursive: true });
                fs.writeFileSync(`${sFolderName}/product.json`, JSON.stringify(product));
                fs.writeFileSync(`${sFolderName}/index.page.mdx`, 
`import Product from '../../../components/Product.mdx';
import oProduct from './product.json' assert {type: 'json'};

<Product data={oProduct} />`
                );
            }    
        }
    }
}