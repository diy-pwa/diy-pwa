import express from 'express';
import path from 'path';
import SitemapPlugin from './SitemapPlugin.js';

export default class{
    constructor(){
        this.app = express();
        this.app.get("/test", async (req, res)=>{
            res.send("Rich was here!")
        });
        this.app.use(express.static(path.resolve(".")));
        const oSitemap = SitemapPlugin();
        oSitemap.configResolved({root:process.cwd(),publicDir:process.cwd()});
    }
}