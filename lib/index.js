import { NodePHP } from '@php-wasm/node';
import fs from 'fs';
import { AsyncDatabase } from "promised-sqlite3";
import ZipLoader from './ZipLoader.js';
import GitLoader from './GitLoader.js';
import SitemapPlugin from './SiteMapPlugin.js';
import express from 'express';

const CORSPROXY = "https://wp-now-corsproxy.rhildred.workers.dev/corsproxy";

class PhpLoader{
    constructor(init){
        if(init){
            Object.apply(this, init);
        }
        if(!this.fs){
            this.fs = fs;
        }
    }
    async build(sPath) {
        await this.fs.promises.rm("dist", { recursive: true, force: true });
        await this.setup();
        await this.copyFolders('wp-content', 'dist/wp-content');
        console.log("wrote dist/wp-content");
        await this.copyFolders('wp-includes', 'dist/wp-includes');
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
        if (!this.fs.existsSync("wp-includes")) {
            const oZipLoader = new ZipLoader();
            await oZipLoader.load(`${CORSPROXY}/wordpress.org/latest.zip`, ".");
            await oZipLoader.unzip();
            await this.fs.promises.rename("wp-content", "wp-content.bak");
        }
        if (!this.fs.existsSync("wp-config.php")) {
            await this.fs.promises.copyFile("wp-config-sample.php", "wp-config.php");
        }
        if (!this.fs.existsSync("wp-content")) {
            await this.fs.promises.cp("wp-content.bak", "wp-content", { recursive: true });
        }
        if (!this.fs.existsSync("wp-content/mu-plugins/0-network-tweaks.php")) {
            await this.fs.promises.mkdir("wp-content/mu-plugins", { recursive: true });
            await this.fs.promises.writeFile("wp-content/mu-plugins/0-network-tweaks.php",
                `<?php
// Needed because gethostbyname( 'wordpress.org' ) returns
// a private network IP address for some reason.
add_filter( 'allowed_redirect_hosts', function( $deprecated = '' ) {
    return array(
        'wordpress.org',
        'api.wordpress.org',
        'downloads.wordpress.org',
    );
} );
// Needed to speed up admin home page
add_action('admin_init', function(){
    remove_action('welcome_panel', 'wp_welcome_panel');
    
    remove_meta_box('dashboard_primary',       'dashboard', 'side');
    remove_meta_box('dashboard_secondary',     'dashboard', 'side');
    remove_meta_box('dashboard_quick_press',   'dashboard', 'side');
    remove_meta_box('dashboard_recent_drafts', 'dashboard', 'side');
    remove_meta_box('dashboard_site_health', 'dashboard', 'normal'); // Remove site health wizard
    
    remove_meta_box('dashboard_php_nag',           'dashboard', 'normal');
    remove_meta_box('dashboard_browser_nag',       'dashboard', 'normal');
    remove_meta_box('health_check_status',         'dashboard', 'normal');
    remove_meta_box('dashboard_activity',          'dashboard', 'normal');
    remove_meta_box('network_dashboard_right_now', 'dashboard', 'normal');
    remove_meta_box('dashboard_recent_comments',   'dashboard', 'normal');
    remove_meta_box('dashboard_incoming_links',    'dashboard', 'normal');
    remove_meta_box('dashboard_plugins',           'dashboard', 'normal');

});
// don't need comments on a pamphlet site and can't support on gh-pages    
add_filter( 'comments_open', function(){
    return false;
});`
);
        }
        if (!this.fs.existsSync("wp-content/mu-plugins/sqlite-database-integration") && 
        !this.fs.existsSync("wp-content/plugins/sqlite-database-integration")) {
            const oZipLoader = new ZipLoader();
            await oZipLoader.load('https://wp-now-corsproxy.rhildred.workers.dev/corsproxy/github.com/WordPress/sqlite-database-integration/archive/refs/heads/main.zip', "wp-content/mu-plugins/sqlite-database-integration");
            await oZipLoader.unzip();
            await this.fs.promises.writeFile("wp-content/mu-plugins/0-sqlite.php", `<?php require_once __DIR__ . "/sqlite-database-integration/load.php";`)
        }
        if (!this.fs.existsSync("wp-content/db.php")) {
            if(this.fs.existsSync("wp-content/plugins/sqlite-database-integration")){
                await this.fs.promises.copyFile("wp-content/plugins/sqlite-database-integration/db.copy", "wp-content/db.php");
            }else{
                const sDB = (await this.fs.promises.readFile("wp-content/mu-plugins/sqlite-database-integration/db.copy")).toString();
                await this.fs.promises.writeFile("wp-content/db.php", sDB.replace('/plugins/sqlite-database-integration', '/mu-plugins/sqlite-database-integration'));    
            }
        }
        if (!this.fs.existsSync("wp-content/database")) {
            await this.fs.promises.mkdir("wp-content/database");
            const res = await this.installationStep2();
            console.log(JSON.stringify(res));
            console.log(res.text);
        }
        let db = await AsyncDatabase.open('./wp-content/database/.ht.sqlite');
        await db.exec("UPDATE wp_options SET option_value = '/%postname%/' WHERE option_name = 'permalink_structure'");
        await db.exec("UPDATE wp_options SET option_value = 'http://localhost:8000' WHERE option_name = 'siteurl' OR option_name = 'home'");
        await db.close();

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
                    documentRoot: process.cwd(),
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
        if (!this.fs.existsSync(`dist/${sPath}`)) {
            await this.fs.promises.mkdir(`dist/${sPath}`, { recursive: true });
        }
        await this.fs.promises.writeFile(`dist/${sPath}/index.html`, resp.contents);

    }
    async installationStep2() {
        const php = await this.getPhpInstance();
        const res = await php.request({
            url: '/wp-admin/install.php?step=2',
            method: 'POST',
            formData: {
                language: 'en',
                prefix: 'wp_',
                weblog_title: 'wp-pwa ... Serverless Wordpress',
                user_name: 'admin',
                admin_password: 'password',
                admin_password2: 'password',
                Submit: 'Install WordPress',
                pw_weak: '1',
                admin_email: 'admin@localhost.com',
            },
        });
        return res;
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

    export{PhpLoader, ZipLoader, SitemapPlugin, GitLoader}