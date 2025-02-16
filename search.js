import lunr from 'https://cdn.jsdelivr.net/npm/lunr@2.3.9/+esm'

class SearchResults extends HTMLElement{
    async connectedCallback(){
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has("s") && urlParams.get("s") != ""){
            this.oldStyle = document.querySelector("main").style.display;
            document.querySelector("main").style.display = "none";
            const res = await fetch("searchindex.json");
            const idx = lunr.Index.load(await res.json());
            const sSearchString = urlParams.get("s");
            const oResults = idx.search(sSearchString);
            if(oResults.length){
                this.innerHTML = `search results for ${sSearchString} here`    
            }else{
                this.innerHTML = `no search results for ${sSearchString}`
            }
            
        }else{
            document.querySelector("main").style.display = this.oldStyle;
        }
    }
}

customElements.define("search-results", SearchResults);