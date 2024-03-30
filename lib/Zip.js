import JSZip from "jszip";
import path from 'path';
export default class extends JSZip{
    constructor(ini){
        super();
        if (ini) {
            Object.assign(this, ini);
        }
    }
    async unzip(){
        const oResponse = await fetch(this.url);
        const oBuffer = await oResponse.arrayBuffer();
        const oResult = await this.loadAsync(oBuffer);
        const oKeys = Object.keys(oResult.files);
        for (let key of oKeys) {
            const oItem = oResult.files[key];
            const sRootPath = oItem.name.split('/').shift();
            const sPath = oItem.name.replace(sRootPath, '');
            const destName = `${this.dest}${sPath}`;
            if(!sPath.match(this.filter) && !oItem.dir){
                const contents = await oItem.async('uint8array');
                try{
                    await this.fs.promises.writeFile(destName, contents);
                }catch{
                    await this.fs.promises.mkdir(path.dirname(destName), {recursive: true});
                    await this.fs.promises.writeFile(destName, contents);
                }          
            }
        }
    }
}