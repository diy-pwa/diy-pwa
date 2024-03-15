import { describe, it, expect } from 'vitest';
import { WordpressLoader } from "../lib";
import { ZipLoader } from "../lib";
import fs from 'fs';

const CORSPROXY = "https://wp-now-corsproxy.rhildred.workers.dev/corsproxy";

describe("tests WordpressLoader", ()=>{
    it("makes a static bundle", async ()=>{
        const oZipLoader = new ZipLoader({fs});
        const outDir = "test"; 
        await oZipLoader.load(`${CORSPROXY}/github.com/rhildred/sciencefictionfantasy/archive/refs/heads/main.zip`, outDir);
        await oZipLoader.unzip();
        const oWPLoader = new WordpressLoader({fs, outDir});
        await oWPLoader.build("test");
        try{
            await fs.promises.access("test/dist/test/index.html");
            expect(true).toBe(true);
        }catch{
            expect(true).toBe(false);
        }

    }, 20000);
});