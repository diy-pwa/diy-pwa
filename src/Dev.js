import express from 'express';
import path from 'path';

export default class{
    constructor(){
        this.app = express();
        this.app.get("/test", async (req, res)=>{
            res.send("Rich was here!")
        });
        this.app.use(express.static(path.resolve(".")));
    }
}