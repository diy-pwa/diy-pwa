import {sitemap} from "./sitemap.js"
export default () => {
    return ({
        name: 'output-sitemap',
        configResolved(resolvedConfig) {
            sitemap(resolvedConfig);
        }
    })
};