import lunr from "https://cdn.jsdelivr.net/npm/lunr@2.3.9/+esm";
import * as cheerio from "https://cdn.jsdelivr.net/npm/cheerio@1.0.0/+esm";


class Blur {
    div;
    constructor(message) {
        const oBody = window.top?.document.querySelector("body");
        this.div = window.top?.document.createElement("div");
        this.div.id = "blurred_background";
        this.div.innerHTML = `<style>
        #blurred_background{
            position:absolute;
            top:0;
            left:0;
            height:100vh;
            width:100vw;
            backdrop-filter: blur(8px);
        }
        #blurred_background p{
            display: -webkit-box;
            -webkit-line-clamp: 3;
            line-clamp: 3;
            overflow: hidden;
            text-overflow: ellipsis;
            -webkit-box-orient: vertical;
        }
        </style>
        ${message}`;
        oBody?.append(this.div);
    }
}

class SearchResults extends HTMLElement{
    async connectedCallback(){
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has("s") && urlParams.get("s") != ""){
            const res = await fetch("searchindex.json");
            const idx = lunr.Index.load(await res.json());
            const sSearchString = urlParams.get("s");
            const oResults = idx.search(sSearchString);
            let sMessage = `<h1>Search results for <em>${sSearchString}</em></h1>`
            if(oResults.length){
                for(let oResult of oResults){
                    const res = await fetch(oResult.ref);
                    const sText = await res.text();
                    const $ = cheerio.load(sText);
                    $("script").remove();
                    $("style").remove();
                    const sTitle = $("h1").text().replace(/\s+/g, ' ').trim();
                    let sBody = $("body").text().replace(/\s+/g, ' ').trim().replace(sTitle, "");
                    let minIndex = sBody.length;
                    for(let term of sSearchString.split(" ")){
                        const oRegex = new RegExp(term, "g");
                        sBody = sBody.replace(oRegex, `<em>${term}</em>`);
                        const termIndex = sBody.indexOf(term);
                        if(termIndex < minIndex){
                            minIndex = termIndex;
                        }
                    }
                    if(minIndex > 255){
                        let startIndex = sBody.lastIndexOf(" ", minIndex - 50);
                        if(startIndex == -1 || minIndex - startIndex > 50){
                            startIndex = sBody.lastIndexOf("<em>", minIndex);
                        }
                        sBody = sBody.slice(startIndex);
                    }
                    sMessage += `<a href="${oResult.ref}"><h2>${sTitle}</h2><p>${sBody}</p></a>`;
                }
            }else{
                sMessage += `no search results for ${sSearchString}`
            }
            const oBlur = new Blur(sMessage);
        }
    }
}

customElements.define("search-results", SearchResults);