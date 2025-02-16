#!/usr/bin/env node

import path from "node:path";
import fs from "node:fs";

const info = JSON.parse(fs.readFileSync("./package.json"))
const sProg = path.basename(process.argv[1]);
const sCommand = process.argv[2];
console.log(`${sProg} ${sCommand||"none"} version ${info.version}`)
const outDir = process.argv[4] || ".";
let app = null;
switch(sCommand){
    case "index":
        // this is where we will do the index diy-pwa.json
        break;
    default:
        console.log(`${sProg} (index) ?output_folder`);
        process.exit();
}
 