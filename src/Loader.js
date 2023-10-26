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
`# Simple workflow for deploying static content to GitHub Pages
name: Deploy to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ['master']

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets the GITHUB_TOKEN permissions to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow one concurrent deployment
concurrency:
  group: 'pages'
  cancel-in-progress: true
  
env:
  VITE_BASE: /\${{github.event.repository.name}}/

jobs:
  # Single deploy job since we're just deploying
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: latest
      - run: pnpm i --fix-lockfile # Fix version differences
      - name: Set up Node
        uses: actions/setup-node@v3
        with:
          node-version: lts/*
          cache: 'pnpm'
      - name: Install dependencies
        run: npm i -g @antfu/ni && ni
      - name: Build
        run: npx vite build
      - name: Pages subfolder fix
        run: cp -r dist /tmp/vslite && mv /tmp/vslite dist/vslite
      - name: Setup Pages
        uses: actions/configure-pages@v3
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          # Upload dist repository
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
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