import ZipLoader from "./ZipLoader.js";
import { NodePHP } from '@rhildred/php-wasm-node';
import { AsyncDatabase } from "promised-sqlite3";
import express from 'express';
import * as cheerio from 'cheerio';

const CORSPROXY = "https://wp-now-corsproxy.rhildred.workers.dev/corsproxy";

export default class {
    constructor(ini) {
        if (ini) {
            Object.assign(this, ini);
        }
        this.outDir = this.outDir || ".";
    }
    async build(sPath) {
        if (!this.fs.existsSync("wp-includes")) {
            const oZipLoader = new ZipLoader({fs: this.fs});
            await oZipLoader.load(`${CORSPROXY}/wordpress.org/latest.zip`, this.outDir);
            oZipLoader.remove("wp-content");
            await oZipLoader.unzip();
        }
        let sConfig = (await this.fs.promises.readFile(`${this.outDir}/wp-config-sample.php`)).toString();
        sConfig = `<?php 
define('USE_FETCH_FOR_REQUESTS',true);
define('WP_HOME','http://localhost:8000');
define('WP_SITEURL','http://localhost:8000');
define('WP_DEBUG_LOG',true);
define('WP_DEBUG_DISPLAY',false);
define( 'CONCATENATE_SCRIPTS', false );?>        
` + sConfig;
        await this.fs.promises.writeFile(`${this.outDir}/wp-config.php`, sConfig);
        await this.fs.promises.rm(`${this.outDir}/dist`, { recursive: true, force: true });
        await this.copyFolders(`${this.outDir}/wp-content`, `${this.outDir}/dist/wp-content`);
        console.log("wrote dist/wp-content");
        await this.copyFolders(`${this.outDir}/wp-includes`, `${this.outDir}/dist/wp-includes`);
        console.log("wrote dist/wp-includes");
        this.db = await AsyncDatabase.open(`${this.outDir}/wp-content/database/.ht.sqlite`);
        await this.load("", sPath);
        const rows = await this.db.all(`SELECT post_name AS path
        FROM wp_posts WHERE post_type in ('PAGE','POST') and post_status = 'publish'`);
        for (let row of rows) {
            await this.load(row.path, sPath);
        }
        await this.db.close();
    }
    async preview(sPath) {
        this.build(sPath)
        const app = express();
        if (sPath) {
            app.get("/", (req, res) => {
                res.redirect(`/${sPath}`);
            });
            app.use(`/${sPath}`, express.static(`${this.outDir}/dist`));
        } else {
            app.use(express.static("dist"));
        }
        return app;

    }
    async load(sPath, sOutPath) {
        const data = {
            url: `/${sPath == "" ? "" : sPath + "/"}`,
            headers: {},
            method: 'GET',
            files: {},
            body: '',
        };
        const resp = await this.getContents(data, sOutPath);
        if(resp.resp.httpStatusCode == 200){
            if (!this.fs.existsSync(`${this.outDir}/dist/${sPath}`)) {
                await this.fs.promises.mkdir(`${this.outDir}/dist/${sPath}`, { recursive: true });
            }
            await this.fs.promises.writeFile(`${this.outDir}/dist/${sPath}/index.html`, resp.contents);
            console.log(`wrote dist${data.url}index.html`);
        }else{
            const location = resp.resp.headers.location;
            console.log(`${data.url} gave a status code of ${resp.resp.httpStatusCode} Location: ${location}`);
        }
    }
    async copyFolders(src, dest) {
        await this.fs.promises.mkdir(dest, { recursive: true });
        const aDir = await this.fs.promises.readdir(src, { withFileTypes: true });
        for (let sPath of aDir) {
            if (sPath.isDirectory()) {
                await this.copyFolders(`${src}/${sPath.name}`, `${dest}/${sPath.name}`);
            } else if (!sPath.name.match(/(php|sqlite|htaccess)$/)) {
                await this.fs.promises.copyFile(`${src}/${sPath.name}`, `${dest}/${sPath.name}`);
            }
        }
    }
    async getPhpInstance() {
        if (!this.php) {
            const requestHandler = {
                documentRoot: `${process.cwd()}/${this.outDir}`,
                absoluteUrl: "http://localhost:8000"
            };
            this.php = await NodePHP.load('8.0', {
                requestHandler: requestHandler
            });
            await this.php.useHostFilesystem();
        }
        return this.php;
    }
    async getContents(data, sPath) {
        const php = await this.getPhpInstance();
        return new Promise((resolve) => {
            php.request(data).then(async (resp) => {
                if (resp.headers["content-type"] && resp.headers["content-type"][0].match(/(css|javascript|json|html)/)) {
                    const contents = await this.getRelative(resp.text, sPath);
                    resolve({ resp: resp, contents: contents });
                }else{
                    resolve({ resp: resp, contents: resp.bytes });
                }
            })
        });
    }
    async getRelative(canonical, sPath) {
        // need to also deal with http:\\/\\/127.0.0.1:8000\\/ escaped??? in json
        let rc = canonical.replace(/(http|https):[\/\\]+(localhost|127.0.0.1|playground\.wordpress\.net\/scope|diy-pwa\.com\/scope):\d+\.?\d*[\/\\]*/g, sPath ? `/${sPath}/` : "/");
        rc = rc.replace(/http:/g, "https:");
        const $ = cheerio.load(rc);
        const aHrefs = $('a');
        for(const ref of aHrefs){
            const href = ref.attribs.href;
            if(!href){
                continue;
            }
            const pageid = Number(href.replace(/\/\?p[a-z_]*=/, ""));
            if(pageid){
                const row  = await this.db.get(`SELECT post_name FROM wp_posts WHERE ID = ${pageid}`);
                ref.attribs.href = `/${row.post_name}/`;
            }
        }
        return $.html();
    }

}