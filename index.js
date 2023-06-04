#!/usr/bin/env node

import { Loader } from './dist/js/index.es.js';
import ora from 'ora';
import readline from 'node:readline';

const question = (sQuestion) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise((resolve, reject) => {
        rl.question(sQuestion, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
};

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