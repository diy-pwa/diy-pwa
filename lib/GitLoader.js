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
        if (!this.fs) {
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
        return this.getWordpress();
    }
    async getWordpress() {
        let oZipLoader = new ZipLoader({ fs: this.fs });
        await oZipLoader.load(`${CORSPROXY}/wordpress.org/latest.zip`, "wordpress");
        let isInstallationRequired = false;
        try {
            await this.fs.promises.access("wordpress/wp-content");
            await oZipLoader.remove("wordpress/wp-content");
            await oZipLoader.unzip();
        } catch {
            // we need to do sqlite integration here
            isInstallationRequired = true;
            await oZipLoader.unzip();
            oZipLoader = new ZipLoader({ fs: this.fs });
            await oZipLoader.load(`${CORSPROXY}/github.com/WordPress/sqlite-database-integration/archive/refs/heads/main.zip`, "wordpress/wp-content/mu-plugins/sqlite-database-integration");
            await oZipLoader.unzip();
            await this.fs.promises.writeFile("wordpress/wp-content/mu-plugins/0-sqlite.php", `<?php 
define( 'SQLITE_IMPLEMENTATION_FOLDER_PATH', realpath( __DIR__ . '/sqlite-database-integration' ) );
require_once __DIR__ . "/sqlite-database-integration/load.php";`);
            await this.fs.promises.copyFile("wordpress/wp-content/mu-plugins/sqlite-database-integration/db.copy", "wordpress/wp-content/db.php");
            await this.fs.promises.mkdir("wordpress/wp-content/database");
        }
        try {
            await this.fs.promises.access("wordpress/wp-config.php");
        }
        catch {
            await this.fs.promises.copyFile("wordpress/wp-config-sample.php", "wordpress/wp-config.php");
        }
        return isInstallationRequired;
    }
}
