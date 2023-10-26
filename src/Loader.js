import ZipLoader from "./ZipLoader.js";
import StripeLoader from "./StripeLoader.js";
import ProductLoader from "./ProductLoader.js";

import fs from 'fs';

export default class{
    constructor(init)
    {
        this.argv = process.argv;
        if (typeof (init) != "undefined") {
            Object.assign(this, init)
        }else{          
            this.dest = "."
        }
        this.commands = {
            convert: async ()=>{
                const oContents = JSON.parse(fs.readFileSync(`${this.dest}/package.json`).toString());
                let isChanged = false;
                for(const sDependency of Object.keys(oContents.dependencies)){
                    if(sDependency == "parcel-bundler"){
                        isChanged = true;
                        delete oContents.dependencies[sDependency];
                        oContents.devDependencies.vite = "latest";
                        oContents.scripts.start = oContents.scripts.dev = "vite dev";
                        oContents.scripts.build = "vite build";
                    }
                }
                if(isChanged){
                    fs.writeFileSync(`${this.dest}/package.json`, JSON.stringify(oContents, null, 2));
                }
                if(!fs.existsSync(`${this.dest}/.gitignore`)){
                    fs.writeFileSync(`${this.dest}/.gitignore`, 
`.env
node_modules
dist
package-lock.json
`);
                }
                if(!fs.existsSync(`${this.dest}/.github/workflows/pages.yml`)){
                    fs.mkdirSync(`${this.dest}/.github/workflows/`, { recursive: true });
                    fs.writeFileSync(`${this.dest}/.github/workflows/pages.yml`,
`# Created by MichaelCurrin
# https://gist.github.com/MichaelCurrin/a698731096f78240f653faf9a9127cba

name: Build and deploy 

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout 🛎️
        uses: actions/checkout@master
        with:
          persist-credentials: false
          submodules: true  # TODO remove this if not using submodules in Hexo

      - name: Install 🔧
        run: npm install

      - name: Build 🏗️
        run: |
          npm run build
      - name: Deploy to GH Pages 🚀
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: \${{ secrets.GITHUB_TOKEN }}
          publish_dir: dist
`);
                }
            },
            create: async ()=>{
                const oZipLoader = new ZipLoader();
                await oZipLoader.load("https://corsproxy-dqo.pages.dev/corsproxy/github.com/diy-pwa/coming-soon/archive/refs/heads/main.zip", this.dest);
                await oZipLoader.unzip();
                return 0;
            },
            fetch: async ()=>{
                let sCatalogue = this.argv[3];
                let oCatalogue = null;
                switch(sCatalogue){
                    case "stripe":
                        let oStripeLoader = new StripeLoader({secretKey:this.sSecret, baseUrl:"https://api.stripe.com"});
                        oCatalogue = await oStripeLoader.fetch();
                        break;
                    default:
                        throw new Error("unimplemented");

                }
                let oProductLoader = new ProductLoader({products: oCatalogue, folder: "."});
                await oProductLoader.createProductPages();
                return 0;
            },
            scrape: async ()=>{
                try{
                    var sUrl = this.argv[3].replace("://", "%3A%2F%2F");
                }catch(e){
                    console.log(`
usage:
    diy-pwa scraper <url to scrape from>
                    `);
                }
                const oZipLoader = new ZipLoader();
                await oZipLoader.load(`https://corsproxy-dqo.pages.dev/scraper/${sUrl}`, this.dest);
                await oZipLoader.unzip();
                return 0;
            },
        }
    }
    async runCommand(sCommandFolder){
        let nExitCode = 0;
        if(typeof(this.commands[this.argv[2]]) != "undefined"){
            nExitCode = await this.commands[this.argv[2]](sCommandFolder);
        }else{
            nExitCode = 2; //(not found I feel)
            console.log(`
usage:
    diy-pwa <command> <subcommand>
            `);
        }
        return nExitCode;
    }
}