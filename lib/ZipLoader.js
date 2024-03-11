import jszip from "jszip";
import path from 'path';
export default class {
    constructor(ini) {
        if (ini) {
            Object.assign(this, ini);
        }
        if (typeof window === 'undefined') {
            this.isBrowser = false;
        } else {
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
        const oBlob = await oResponse.blob();
        this.zip = new jszip();
        if (this.isBrowser) {
            this.oResult = await this.zip.loadAsync(oBlob);
        } else {
            let oBuffer = await oBlob.arrayBuffer();
            oBuffer = Buffer.from(oBuffer);
            this.oResult = await this.zip.loadAsync(oBuffer);
        }
    }
    async unzip() {
        const oKeys = Object.keys(this.oResult.files);
        for (let key of oKeys) {
            const oItem = this.oResult.files[key];
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
    async remove(sFolder){
        return this.zip.remove(sFolder);
    }
}