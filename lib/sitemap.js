import fs from 'fs';
import { glob } from "glob";
import path from 'path';

export function sitemap(resolvedConfig){
    const oConfig = {};
    const oPackageJSON = JSON.parse(fs.readFileSync("package.json"));
    if (oPackageJSON.homepage) {
        oConfig.homepage = oPackageJSON.homepage;
    } else {
        oConfig.homepage = "https://example.com";
    }
    Object.assign(oConfig, resolvedConfig)
    let sSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`
    const aInputItems = glob.sync(path.resolve(oConfig.root, "**/*.html"),
        { ignore: ["dist/**", "src/**", "public/**", "functions/**", "node_modules/**"] });
    for (const item of aInputItems) {
        sSitemap += `\t<url><loc>${oConfig.homepage}${item.replace(oConfig.root, "")}</loc></url>\n`
    }
    sSitemap += "</urlset>";
    const sOutdir = path.resolve(oConfig.publicDir);
    if (!fs.existsSync(sOutdir)) {
        fs.mkdirSync(sOutdir)
    }
    fs.writeFileSync(path.resolve(sOutdir, "sitemap.xml"), sSitemap);
}