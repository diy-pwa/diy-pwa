// Array of supported localizations
export default (config)=>{
    const sAccept = navigator.language;
    const languages = config['io_github_diy-pwa_languages'];
    let sLang = null;
    for(let n= 0; n < languages.length; n++){
        const re = new RegExp(`^${languages[n].language}`);
        if(sAccept.match(re)){
            // there is a language that is in navigator.language
            sLang = languages[n].language;
            break;
        }
    }
    if(!sLang){
        sLang =  languages[0].language;
    }
    return sLang;
}