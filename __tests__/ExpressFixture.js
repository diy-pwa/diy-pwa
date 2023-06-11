import express from 'express';
import email from '../src/Sendgrid.js';
import {workersAdapter} from 'cloudflare2express';
import dotenv from 'dotenv';

dotenv.config();

export default () => {
    const app = express();
    app.post(/\/api\/contact/, express.raw({
        inflate: true,
        limit: '50mb',
        type: () => true, // this matches all content types for this route
    }), async (req, res) => {
        workersAdapter(email, req, res, { FROM: process.env["FROM"], TO: process.env["TO"], TEMPLATE: process.env["TEMPLATE"], ACCESS_TOKEN: process.env["ACCESS_TOKEN"] });
    });
    return app;
}