class SearchResults extends HTMLElement{
    async connectedCallback(){
        const urlParams = new URLSearchParams(window.location.search);
        if(urlParams.has("s") && urlParams.get("s") != ""){
            this.oldStyle = document.querySelector("main").style.display;
            document.querySelector("main").style.display = "none";
            this.innerHTML = `search results for ${urlParams.get("s")} here`
        }else{
            document.querySelector("main").style.display = this.oldStyle;
        }
    }
}

customElements.define("search-results", SearchResults);