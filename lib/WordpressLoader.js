import ZipLoader from "./ZipLoader";
import { NodePHP } from '@rhildred/php-wasm-node';
import { AsyncDatabase } from "promised-sqlite3";

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
        await this.fs.promises.rm(`${this.outDir}/dist`, { recursive: true, force: true });
        await this.copyFolders(`${this.outDir}/wp-content`, `${this.outDir}/dist/wp-content`);
        console.log("wrote dist/wp-content");
        await this.copyFolders(`${this.outDir}/wp-includes`, `${this.outDir}/dist/wp-includes`);
        console.log("wrote dist/wp-includes");
        await this.load("", sPath);
        console.log("wrote dist/index.html");
        let db = await AsyncDatabase.open(`${this.outDir}/wp-content/database/.ht.sqlite`);
        await db.exec("UPDATE wp_options SET option_value = '/%postname%/' WHERE option_name = 'permalink_structure'");
        await db.exec("UPDATE wp_options SET option_value = 'http://localhost:8000' WHERE option_name = 'siteurl' OR option_name = 'home'");
        const rows = await db.all(`SELECT post_name AS path
        FROM wp_posts WHERE post_type in ('PAGE','POST') and post_status = 'publish'`);
        for (let row of rows) {
            await this.load(row.path, sPath);
            console.log(`wrote dist/${row.path}/index.html`);
        }
        await db.close();
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
        if (!this.fs.existsSync(`${this.outDir}/dist/${sPath}`)) {
            await this.fs.promises.mkdir(`${this.outDir}/dist/${sPath}`, { recursive: true });
        }
        await fs.promises.writeFile(`${this.outDir}/dist/${sPath}/index.html`, resp.contents);

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
            php.request(data).then((resp) => {
                if (resp.headers["content-type"] && resp.headers["content-type"][0].match(/(css|javascript|json|html)/)) {
                    const contents = this.getRelative(resp.text, sPath);
                    resolve({ resp: resp, contents: contents });
                }else{
                    resolve({ resp: resp, contents: resp.bytes });
                }
            })
        });
    }
    getRelative(canonical, sPath) {
        // need to also deal with http:\\/\\/127.0.0.1:8000\\/ escaped??? in json
        const rc = canonical.replace(/(http|https):[\/\\]+(localhost|127.0.0.1|playground\.wordpress\.net\/scope):\d+\.?\d*[\/\\]*/g, sPath ? `/${sPath}/` : "/");
        return rc.replace(/http:/g, "https:");
    }

}