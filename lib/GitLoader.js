import git from 'isomorphic-git';
import http from 'isomorphic-git/http/web';
import { FsaNodeFs } from 'memfs/lib/fsa-to-node';
import ZipLoader from './ZipLoader';

const CORSPROXY = "https://wp-now-corsproxy.rhildred.workers.dev/corsproxy";

export default class {
    constructor(ini) {
        if (ini) {
            Object.assign(this, ini);
        }
        if(!this.fs){
            // use opfs here
            const dir = navigator.storage.getDirectory();
            this.fs = window.fs = new FsaNodeFs(dir);

        }
    }
    async getRepo(sUrl) {
        await this.fs.promises.rm("wordpress", { recursive: true, force: true });
        await git.clone({
            fs: this.fs,
            http,
            dir: 'wordpress',
            corsProxy: CORSPROXY,
            url: sUrl,
            singleBranch: true,
            depth: 1
        });
        try {
            await this.fs.promises.access("wordpress/.gitignore");
        } catch {
            // need .gitignore for everything but wp-content
            this.fs.promises.writeFile("wordpress/.gitignore", `
*
!wp-content
!wp-content/**
!wp-config.php
!package.json
!README.md
!.gitignore
!LICENSE
`);

        }
        const oZipLoader = new ZipLoader({fs: this.fs});
        await oZipLoader.load(`${CORSPROXY}/wordpress.org/latest.zip`, "wordpress");
        await oZipLoader.unzip();
    }
}
