import jszip from "jszip";
import path from 'path';
import { FsaNodeFs } from 'memfs/lib/fsa-to-node';
export default class {
    constructor(ini) {
        if (ini) {
            Object.assign(this, ini);
        }
        if (typeof window === 'undefined') {
            this.isBrowser = false;
        } else {
            if (!this.fs) {
                // will need to do opfs here
                const dir = navigator.storage.getDirectory();
                this.fs = window.fs = new FsaNodeFs(dir);
            }
            this.isBrowser = true;
        }

    }
    async load(sPath, sDest, oBody) {
        this.path = sPath;
        this.dest = sDest;
        var oResponse;
        if (oBody) {
            const oHeaders = new Headers();
            oHeaders.append('Content-Type', 'application/json');
            oResponse = await fetch(this.path, {
                method: "POST",
                headers: oHeaders,
                body: JSON.stringify(oBody)
            });
        } else {
            oResponse = await fetch(this.path);
        }
        this.oBlob = await oResponse.blob();
    }
    async unzip() {
        const oJsZip = new jszip();
        let oResult;
        if (this.isBrowser) {
            oResult = await oJsZip.loadAsync(this.oBlob);
        } else {
            let oBuffer = await this.oBlob.arrayBuffer();
            oBuffer = Buffer.from(oBuffer);
            oResult = await oJsZip.loadAsync(oBuffer);
        }
        const oKeys = Object.keys(oResult.files);
        for (let key of oKeys) {
            const oItem = oResult.files[key];
            const sRootPath = oItem.name.split('/').shift();
            const sPath = oItem.name.replace(sRootPath, '');
            try {
                await fs.promises.access(`${this.dest}${sPath}`);
                // skip files that exist already
                continue;
            } catch { }
            if (oItem.dir) {
                try {
                    await this.fs.promises.access(`${this.dest}${sPath}`);
                } catch {
                    await this.fs.promises.mkdir(`${this.dest}${sPath}`, { recursive: true });
                }
            } else {
                if (this.isBrowser) {
                    try{
                        await fs.promises.writeFile(`${this.dest}${sPath}`, await oItem.async('uint8array'));
                    }catch{
                        await fs.promises.mkdir(path.dirname(`${this.dest}${sPath}`), {recursive: true});
                        await fs.promises.writeFile(`${this.dest}${sPath}`, await oItem.async('uint8array'));
                    }      
                } else {
                    await this.fs.promises.writeFile(`${this.dest}${sPath}`, Buffer.from(await oItem.async('arraybuffer')));
                }
            }
        }
    }
}