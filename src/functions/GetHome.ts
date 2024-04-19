import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as Handlebars from 'handlebars';
import path = require("path");
import fs = require("fs");

const homeTemplate: string = fs.readFileSync(path.resolve(__dirname, './templates/home.html'), 'utf8');
const errorTemplate: string = fs.readFileSync(path.resolve(__dirname, './templates/error.html'), 'utf8');

export async function Home(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    
    const clientPrincipalHeader = request.headers['x-ms-client-principal'];
    
    if (!clientPrincipalHeader) {
        return await sendError("The Twitter Client Principal was null.");
    }

    const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, 'base64').toString());

    if (clientPrincipal === null) {
        return await sendError("The Twitter Client Principal was null.");
    }

    const newUserDataJSON = request.query["newUserData"] || '';

    if (!newUserDataJSON) {
        return await sendError("The new user data was null.");
    }

    const newUser = JSON.parse(newUserDataJSON);

    if (!newUser.userName || !newUser.identityProvider) {
        return await sendError("The user name or identity provider was null.");
    }

    const data = {
        newUserName: newUser.userName,
        newIdentityProvider: newUser.identityProvider
    };

    return await send(200, data);
};

async function sendError(message: string): Promise<HttpResponseInit> {
    return await send(500, { message: message }, errorTemplate);
}

async function send(status: number, data: any, templateSource: string = homeTemplate, ): Promise<HttpResponseInit> {    
    const template = Handlebars.compile(templateSource);
    const result = template(data);
    return {
        status: status, 
        body: result,
        headers: {
            "Content-Type": "text/html"
        }
    };
}

app.http('GetHome', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: Home
});
