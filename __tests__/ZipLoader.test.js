import { describe, it, expect, beforeEach } from 'vitest';
import ZipLoader from "../src/ZipLoader.js";
import fs from 'fs';

const sFolder = "test3";

beforeEach(async()=>{
    await fs.promises.rm(sFolder, { recursive: true, force: true });
});

describe("Zip loader is to load from", () => {
    it("downloads a .zip file", async () => {
        let oZipLoader = new ZipLoader();
        await oZipLoader.load("https://github.com/diy-pwa/diy-pwa/archive/refs/heads/main.zip", sFolder);
        expect(fs.existsSync(`${sFolder}/main.zip`)).toBe(true);
    }, 10000);
    it("unzips the file", async () => {
        let oZipLoader = new ZipLoader();
        await oZipLoader.load("https://github.com/diy-pwa/diy-pwa/archive/refs/heads/main.zip", sFolder);
        await oZipLoader.unzip();
        expect(fs.existsSync(`${sFolder}/package.json`)).toBe(true);
    },10000);
    it("backs up package.json file", async () => {
        let oZipLoader = new ZipLoader();
        try{
            await fs.promises.access(sFolder);
        }catch{
            await fs.promises.mkdir(sFolder, {recursive: true});
        }
        await fs.promises.writeFile(`${sFolder}/package.json`, "Rich was here");
        await oZipLoader.load("https://github.com/diy-pwa/diy-pwa/archive/refs/heads/main.zip", sFolder);
        expect(fs.existsSync(`${sFolder}/package.json.bak`)).toBe(true);
    });

  });
      