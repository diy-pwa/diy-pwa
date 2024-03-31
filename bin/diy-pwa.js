#!/usr/bin/env node

import fs from 'fs';
import {WordpressLoader} from '../lib/index.js';
import path from "node:path";
// An import assertion in a static import
import info from '../package.json' assert { type: "json" };
import {spawn} from 'child_process';


const sProg = path.basename(process.argv[1]);
const sCommand = process.argv[2];
console.log(`${sProg} ${sCommand} version ${info.version}`)
const outDir = process.argv[4] || ".";
const oLoader = new WordpressLoader({fs, outDir});
let app = null;
switch(sCommand){
    case "build":
        setTimeout(async ()=>{
            await oLoader.build(process.argv[3]);
            process.exit();
        }, 10000);
        spawn('node', [process.argv[1], "setup", outDir], {
            detached: true
        });
        break;
    case "preview":
        setTimeout(async ()=>{
            app = await oLoader.preview(process.argv[3]);
            const server = app.listen(8000, ()=>{
                console.log(`\`${sProg} ${sCommand}\` is listening on port ${server.address().port}`);
            });
        }, 10000);
        spawn('node', [process.argv[1], "setup", outDir], {
            detached: true
        });
        break;
    case "setup":
        await oLoader.setup(process.argv[3]);
        process.exit();
    case "fork":
    default:
        console.log(`${sProg} (build|preview|dev|start) ?output_folder`);
        process.exit();
}
 