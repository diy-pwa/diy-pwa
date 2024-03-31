import { describe, it, expect, beforeEach } from 'vitest';
import { WordpressLoader } from "../lib";
import { Zip } from "../lib";
import fs from 'fs';
import {spawn} from 'child_process';

const CORSPROXY = "https://wp-now-corsproxy.rhildred.workers.dev/corsproxy";
const outDir = "test";
describe("tests WordpressLoader", ()=>{
    beforeEach(async()=>{
        try{
            await fs.promises.rmdir(outDir, {recursive: true});
        }catch{}
    })
    it("makes a static bundle from student1", async ()=>{
        const oZip = new Zip({fs, 
            dest:outDir,
            url: `${CORSPROXY}/github.com/emilyychau/UX221-L06/archive/refs/heads/main.zip`,
            filter: 'wp-config.php'
            });
        await oZip.unzip();
        const oLoader = new WordpressLoader({fs, outDir});
        setTimeout(async ()=>{
            await oLoader.build();
            try{
                await fs.promises.access("test/dist/index.html");
                expect(true).toBe(true);
            }catch{
                expect(true).toBe(false);
            }    
        }, 10000);
        spawn('node', [`${process.cwd()}/bin/diy-pwa.js`, "setup", "test", outDir], {
            detached: true
        });
    }, 30000);
    it("makes a static bundle from student2", async ()=>{
        const oZip = new Zip({fs,
            dest: outDir,
            url:`${CORSPROXY}/github.com/rhildred/paintball/archive/refs/heads/main.zip`,
            filter:"wp-config.php"
        });
        await oZip.unzip();
        const oLoader = new WordpressLoader({fs, outDir});
        setTimeout(async ()=>{
            await oLoader.build();
            try{
                await fs.promises.access("test/dist/index.html");
                expect(true).toBe(true);
            }catch{
                expect(true).toBe(false);
            }    
        }, 10000);
        spawn('node', [`${process.cwd()}/bin/diy-pwa.js`, "setup", "test", outDir], {
            detached: true
        });
    }, 30000);
});