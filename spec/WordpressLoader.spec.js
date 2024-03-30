import { describe, it, expect, beforeEach } from 'vitest';
import { WordpressLoader } from "../lib";
import { Zip } from "../lib";
import fs from 'fs';

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
        const oWPLoader = new WordpressLoader({fs, outDir});
        await oWPLoader.build("test");
        try{
            await fs.promises.access("test/dist/index.html");
            expect(true).toBe(true);
        }catch{
            expect(true).toBe(false);
        }

    }, 30000);
    it("makes a static bundle from student2", async ()=>{
        const oZip = new Zip({fs,
            dest: outDir,
            url:`${CORSPROXY}/github.com/rhildred/paintball/archive/refs/heads/main.zip`,
            filter:"wp-config.php"
        });
        await oZip.unzip();
        const oWPLoader = new WordpressLoader({fs, outDir});
        await oWPLoader.build("test");
        try{
            await fs.promises.access("test/dist/index.html");
            expect(true).toBe(true);
        }catch{
            expect(true).toBe(false);
        }

    }, 30000);
});