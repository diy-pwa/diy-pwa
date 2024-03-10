import { describe, it, expect } from 'vitest';
import { GitLoader } from "../lib";
import fs from 'fs';

describe("tests GitLoader", ()=>{
    it("loads a repo", async ()=>{
        const oGitLoader = new GitLoader({fs});
        await oGitLoader.getRepo("https://github.com/rhildred/wp-test");
        try{
            await fs.promises.access("wordpress");
            expect(true).toBe(true);
        }catch{
            expect(true).toBe(false);
        }

    }, 10000);
});