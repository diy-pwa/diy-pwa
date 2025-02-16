#!/usr/bin/env node
import process from "node:process";
import path from "node:path";
// An import assertion in a static import
import info from '../package.json' with { type: "json" };
import {sitemap} from '../lib/sitemap.js';

const sProg = path.basename(process.argv[1]);
const sCommand = process.argv[2];
console.log(`${sProg} ${sCommand||"none"} version ${info.version}`)
const outDir = process.argv[4] || ".";
let app = null;
switch(sCommand){
    case "sitemap":
        sitemap({root:process.cwd(), publicDir:""});
        break;
    case "index":
        // this is where we will do the index diy-pwa.json
        break;
    default:
        console.log(`${sProg} (index) ?output_folder`);
        process.exit();
}
 