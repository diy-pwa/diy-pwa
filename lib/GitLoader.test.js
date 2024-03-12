import 'mocha';
import 'mocha/mocha.css';
import { expect } from 'chai';
import GitLoader from './GitLoader.js';
import { FsaNodeFs } from 'memfs/lib/fsa-to-node';


mocha.setup('bdd');
describe('test', () => {
    it("gets a repo", async () => {
        const dir = navigator.storage.getDirectory();
        const fs = window.fs = new FsaNodeFs(dir);
        const oGitLoader = new GitLoader({fs});
        await oGitLoader.getRepo("https://github.com/rhildred/wp-test");
        expect(1).to.eql(1);
    });

});
mocha.run();