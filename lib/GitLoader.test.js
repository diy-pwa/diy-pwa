import 'mocha';
import 'mocha/mocha.css';
import { expect } from 'chai';
import GitLoader from './GitLoader.js';

mocha.setup('bdd');
describe('test', () => {
    it('passes', async () => {
        expect(1).to.eql(1);
    });
    it("gets a repo", async () => {
        const oGitLoader = new GitLoader();
        await oGitLoader.getRepo("https://github.com/rhildred/wp-test");
        expect(1).to.eql(1);
    });

});
mocha.run();