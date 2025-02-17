import * as cheerio from 'cheerio';
import fs from "node:fs";
import { XMLParser } from 'fast-xml-parser';
import lunr from "lunr"
const info = JSON.parse(await fs.promises.readFile("package.json"));

async function file_get_contents(sUrl) {
    let sTarget = sUrl;
    try {
        await fs.promises.access("dist/index.html");
        sTarget = sUrl.replace(info.homepage || "https://example.com", "dist");
    }catch{
        try{
            await fs.promises.access("index.html");
            sTarget = sUrl.replace(`${info.homepage}/` || "https://example.com/", "");    
        }catch{
            sTarget = sUrl
        }
    }
    if(sTarget.endsWith("/")){
        sTarget += "index.html";
    }
    if(sTarget == sUrl){
        const response = await fetch(sUrl);
        return await response.text;
    }else{
        return await fs.promises.readFile(sTarget);
    }
}

async function indexFile(sFile){
    const sData = await file_get_contents(sFile);
    const $ = cheerio.load(sData);
    const sTitle = $("h1").text().replace(/\s+/g, ' ').trim();
    const sBody = $("main").text().replace(/\s+/g, ' ').trim().replace(sTitle, "");
    // relative url
    const oUrl = new URL(info.homepage || "https://example.com");
    const oRegex = new RegExp(`^.*${oUrl.hostname}`);
    const sTarget = sFile.replace(oRegex, "");    
    return {title: sTitle, body: sBody, id: sTarget};
}

export async function createSearch(outdir) {
    let sitemap = "dist/sitemap.xml";
    try {
        await fs.promises.access(sitemap);
    } catch {
        sitemap = "sitemap.xml"
    }
    const sSitemap = await fs.promises.readFile(sitemap);
    const parser = new XMLParser();
    let aContents = [];
    let oContents = parser.parse(sSitemap);
    try {
        for (const oUrl of oContents.urlset.url) {
            aContents.push(await indexFile(oUrl.loc));
        }
    } catch {
        aContents.push(await indexFile(oContents.urlset.url.loc, this));
    }
    let idx = lunr(function () {
        this.field('title')
        this.field('body')
        for(let item of aContents ){
            this.add({id:item.id,body:item.body, title:item.title});
        }
    });
    await fs.promises.writeFile(`${outdir}/searchindex.json`, JSON.stringify(idx));
}
