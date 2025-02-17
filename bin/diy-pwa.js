#!/usr/bin/env node
import process from "node:process";
import path from "node:path";
// An import assertion in a static import
import info from "../package.json" with { type: "json" };
import {sitemap} from "../lib/sitemap.js";
import {createSearch} from "../lib/createSearch.js";

const sProg = path.basename(process.argv[1]);
const sCommand = process.argv[2];
console.log(`${sProg} ${sCommand||"none"} version ${info.version}`)
const outDir = process.argv[3] || ".";
let app = null;
switch(sCommand){
    case "sitemap":
        sitemap({root:process.cwd(), publicDir:outDir});
        break;
    case "index":
        createSearch(outDir);
        break;
    default:
        console.log(`${sProg} (index|sitemap) ?output_folder`);
        process.exit();
}
 