// Array of supported localizations
import config from '../package.json' assert {type: 'json'};

export default ()=>{
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