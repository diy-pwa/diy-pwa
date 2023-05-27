#!/usr/bin/env node

import Loader from './src/Loader.js';
import question from './src/question.js';
import ora from 'ora';

async function main(){
    let oLoader = null;
    if(process.argv[2] == "fetch"){
        let sSecret =process.argv[4] ||  process.env.secretKey;
        if(!sSecret){
            sSecret = await question("enter your secret key: ");
        }

        oLoader = new Loader({sSecret:sSecret});
    }else{
        oLoader = new Loader();
    }

    const spinner = ora(`running diy-pwa ${process.argv[2] || ''} ... `).start();

    try{
        const rc = await oLoader.runCommand();
        if(rc){
            console.log(rc);
        }
    }catch(e){
        console.log(e.toString());
    }
    spinner.stop();
}

main().then(()=>{
    process.exit();
  });