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
        return sName.replace(/\ /g, "_");
    }
    createProductPages(){
        const oConfig = JSON.parse(fs.readFileSync(`${this.folder}/package.json`));
        let aLanguages = oConfig["io_github_diy-pwa_languages"];
        for(let sLanguage of aLanguages){
            for(let product of this.products){
                // need to pull other language and description from metadata
                if(product.metadata && product.metadata[`${sLanguage}_name`]){
                    product.name = product.metadata[`${sLanguage}_name`];
                }
                if(product.metadata && product.metadata[`${sLanguage}_description`]){
                    product.description = product.metadata[`${sLanguage}_description`];
                }
                const sFolderName = `${this.folder}/pages/${sLanguage}/products/${this.slugify(product.name)}`;
                fs.mkdirSync(sFolderName, { recursive: true });
                fs.writeFileSync(`${sFolderName}/product.json`, JSON.stringify(product));
                fs.writeFileSync(`${sFolderName}/index.page.jsx`, 
`import Product from '../../../../components/Product.mdx';
import oProduct from './product.json' assert { type: 'json' };
const documentProps = {
    title: oProduct.name,
    description: oProduct.description,
    lang: oProduct.language,
    dir: 'ltr'
  };

function Page(props){
    return(
        <Product data={oProduct} />
    )
}

export { Page, documentProps }
`
                );
            }    
        }
    }
}