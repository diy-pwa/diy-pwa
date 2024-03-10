import jszip from "jszip";
import path from 'path';
import { FsaNodeFs } from 'memfs/lib/fsa-to-node';
export default class{
    constructor(ini){
        if(ini){
            Object.assign(this, ini);
        }
        if(!this.fs){
            // will need to do opfs here
            const dir = navigator.storage.getDirectory();
            this.fs = window.fs = new FsaNodeFs(dir);
        }
    }
    async load(sPath, sDest, oBody){
        this.path = sPath;
        this.dest = sDest;
        var oResponse;
        if(oBody){
            const oHeaders = new Headers();
            oHeaders.append('Content-Type', 'application/json');        
            oResponse = await fetch(this.path, {
                method: "POST",
                headers: oHeaders,
                body: JSON.stringify(oBody)
            });
        }else{
            oResponse = await fetch(this.path);
        }
        const oBlob = await oResponse.blob();
        const oParsed = new URL(this.path);
        const sOutfile = `${sDest}/${path.basename(oParsed.pathname)}`;
        let oBuffer = await oBlob.arrayBuffer();
        oBuffer = Buffer.from(oBuffer);
        try{
            await this.fs.promises.access(this.dest);
        }catch{
            await this.fs.promises.mkdir(this.dest, {recursive: true});
        }
        await this.fs.promises.writeFile(sOutfile, oBuffer);
    }
    async unzip(){
        const oParsed = new URL(this.path);
        const sZipfile = `${this.dest}/${path.basename(oParsed.pathname)}`;
        const oContent = await this.fs.promises.readFile(sZipfile);
        const oJsZip = new jszip();
        const oResult = await oJsZip.loadAsync(oContent);
        const oKeys = Object.keys(oResult.files);
        let aPromises = [];
        for(let key of oKeys){
            const oItem = oResult.files[key];
            const sRootPath = oItem.name.split('/').shift();
            const sPath = oItem.name.replace(sRootPath, '');
            if(oItem.dir){
                try{
                    await this.fs.promises.access(`${this.dest}${sPath}`);
                }catch{
                    await this.fs.promises.mkdir(`${this.dest}${sPath}`, {recursive: true});
                }
            }else{
                try{
                    await this.fs.promises.access(`${this.dest}${sPath}`);
                    // don't overwrite if it exists
                }catch{
                    aPromises.push(this.fs.promises.writeFile(`${this.dest}${sPath}`, Buffer.from(await oItem.async('arraybuffer'))));
                }
                
            }
        }
        await Promise.all(aPromises);
        await this.fs.promises.rm(sZipfile, { recursive: true, force: true });
    }
}