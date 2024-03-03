import jszip from "jszip";
import fetch from 'node-fetch';
import fs from 'fs';
import url from 'url';
import path from 'path';
export default class{
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
        const oParsed = url.parse(this.path);
        const sOutfile = `${sDest}/${path.basename(oParsed.pathname)}`;
        let oBuffer = await oBlob.arrayBuffer();
        oBuffer = Buffer.from(oBuffer);
        try{
            await fs.promises.access(this.dest);
        }catch{
            await fs.promises.mkdir(this.dest, {recursive: true});
        }
        await fs.promises.writeFile(sOutfile, oBuffer);
    }
    async unzip(){
        const oParsed = url.parse(this.path);
        const sZipfile = `${this.dest}/${path.basename(oParsed.pathname)}`;
        const oContent = fs.readFileSync(sZipfile);
        const oJsZip = new jszip();
        const oResult = await oJsZip.loadAsync(oContent);
        const oKeys = Object.keys(oResult.files);
        for(let key of oKeys){
            const oItem = oResult.files[key];
            const sRootPath = oItem.name.split('/').shift();
            const sPath = oItem.name.replace(sRootPath, '');
            if(oItem.dir){
                try{
                    await fs.promises.access(`${this.dest}${sPath}`);
                }catch{
                    await fs.promises.mkdir(`${this.dest}${sPath}`, {recursive: true});
                }
            }else{
                fs.writeFileSync(`${this.dest}${sPath}`, Buffer.from(await oItem.async('arraybuffer')));
            }
        }
        await fs.promises.rm(sZipfile, { recursive: true, force: true });
    }
}