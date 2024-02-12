import { NodePHP } from '@php-wasm/node';
import fs from 'fs';
import { AsyncDatabase } from "promised-sqlite3";
import ZipLoader from './ZipLoader.js';
import SiteMapPlugin from './SiteMapPlugin.js';
import express from 'express';

class PhpLoader{
    async build(sPath) {
        await fs.promises.rm("dist", { recursive: true, force: true });
        await this.setup();
        await this.copyFolders('wp-content', 'dist/wp-content');
        console.log("wrote dist/wp-content");
        await this.copyFolders('.wordpress/wp-includes', 'dist/wp-includes');
        console.log("wrote dist/wp-includes");
        await this.load("", sPath);
        console.log("wrote dist/index.html");
        let db = await AsyncDatabase.open('./wp-content/database/.ht.sqlite');
        const rows = await db.all(`SELECT post_name AS path
        FROM wp_posts WHERE post_type in ('PAGE','POST') and post_status = 'publish'`);
        for (let row of rows) {
            await this.load(row.path, sPath);
            console.log(`wrote dist/${row.path}/index.html`);
        }
        await db.close();

    }
    async preview(sPath) {
        await this.build(sPath);
        const app = express();
        if (sPath) {
            app.get("/", (req, res) => {
                res.redirect(`/${sPath}`);
            });
            app.use(`/${sPath}`, express.static("dist"));
        } else {
            app.use(express.static("dist"));
        }
        return app;
    }
    async setup() {
        if (!fs.existsSync(".wordpress")) {
            const oZipLoader = new ZipLoader();
            await oZipLoader.load("https://wp-now-corsproxy.rhildred.workers.dev/corsproxy/wordpress.org/latest.zip", ".wordpress");
            await oZipLoader.unzip();
            await fs.promises.rename(".wordpress/wp-content", ".wordpress/wp-content.bak");
        }
        if (!fs.existsSync(".wordpress/wp-config.php")) {
            await fs.promises.copyFile(".wordpress/wp-config-sample.php", ".wordpress/wp-config.php");
        }
    }
    async copyFolders(src, dest) {
            await fs.promises.mkdir(dest, { recursive: true });
            const aDir = await fs.promises.readdir(src, { withFileTypes: true });
            for (let sPath of aDir) {
                if (sPath.isDirectory()) {
                    await this.copyFolders(`${src}/${sPath.name}`, `${dest}/${sPath.name}`);
                } else if (!sPath.name.match(/(php|sqlite|htaccess)$/)) {
                    await fs.promises.copyFile(`${src}/${sPath.name}`, `${dest}/${sPath.name}`);
                }
            }
        }
    async getPhpInstance() {
            if (!this.php) {
                const requestHandler = {
                    documentRoot: `${process.cwd()}/.wordpress`,
                    absoluteUrl: "http://localhost:8000"
                };
                this.php = await NodePHP.load('8.0', {
                    requestHandler: requestHandler
                });
                await this.php.useHostFilesystem();
                await this.php.mount(`${process.cwd()}/wp-content`, `${process.cwd()}/.wordpress/wp-content`);
            }
            return this.php;
        }
    async getContents(data, sPath) {
        const php = await this.getPhpInstance();
        return new Promise((resolve) => {
            php.request(data).then((resp) => {
                if (resp.headers["content-type"] && resp.headers["content-type"][0].match(/(css|javascript|json|html)/)) {
                    const contents = this.getRelative(resp.text, sPath);
                    resolve({ resp: resp, contents: contents });
                }
                resolve({ resp: resp, contents: resp.bytes });
            })
        });
    }
    getRelative(canonical, sPath) {
        // need to also deal with http:\\/\\/127.0.0.1:8000\\/ escaped??? in json
        const rc = canonical.replace(/(http|https):[\/\\]+(localhost|127.0.0.1|playground\.wordpress\.net\/scope):\d+\.?\d*[\/\\]*/g, sPath ? `/${sPath}/` : "/");
        return rc.replace(/http:/g, "https:");
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
        if (!fs.existsSync(`dist/${sPath}`)) {
            await fs.promises.mkdir(`dist/${sPath}`, { recursive: true });
        }
        await fs.promises.writeFile(`dist/${sPath}/index.html`, resp.contents);

    }
    requestBodyToMultipartFormData(json, boundary) {
        let multipartData = '';
        const eol = '\r\n';

        for (const key in json) {
            multipartData += `--${boundary}${eol}`;
            multipartData += `Content-Disposition: form-data; name="${key}"${eol}${eol}`;
            multipartData += `${json[key]}${eol}`;
        }

        multipartData += `--${boundary}--${eol}`;
        return multipartData;
    }
    async requestBodyToString(req) {
            return new Promise((resolve) => {
                let body = '';
                req.on('data', (chunk) => {
                    body += chunk.toString(); // convert Buffer to string
                });
                req.on('end', () => {
                    resolve(body);
                });
            });
        }

    }

    export{PhpLoader, ZipLoader, SiteMapPlugin}