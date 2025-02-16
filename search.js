import lunr from "https://cdn.jsdelivr.net/npm/lunr@2.3.9/+esm";
import * as cheerio from "https://cdn.jsdelivr.net/npm/cheerio@1.0.0/+esm";

class SearchResults extends HTMLElement{
    async connectedCallback(){
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has("s") && urlParams.get("s") != ""){
            const res = await fetch("searchindex.json");
            const idx = lunr.Index.load(await res.json());
            const sSearchString = urlParams.get("s");
            const oResults = idx.search(sSearchString);
            if(oResults.length){
                this.insertAdjacentHTML("beforeend", `search results for ${sSearchString} here`);
                for(let oResult of oResults){
                    const res = await fetch(oResult.ref);
                    const sText = await res.text();
                    const $ = cheerio.load(sText);
                    $("script").remove();
                    $("style").remove();
                    const sTitle = $("h1").text().replace(/\s+/g, ' ').trim();
                    const sBody = $("body").text().replace(/\s+/g, ' ').trim().replace(sTitle, "");
                    this.insertAdjacentHTML("beforeend",`<a href="${oResult.ref}"><h2>${sTitle}</h2></a><p>${sBody}</p>`);
                }
            }else{
                this.innerHTML = `no search results for ${sSearchString}`
            }
            
        }
    }
}

customElements.define("search-results", SearchResults);