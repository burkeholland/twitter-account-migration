import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as Handlebars from 'handlebars';
import * as templates from './Templates';
import { URLSearchParams } from 'url';

export async function Home(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    // Assuming request.query is a string
    const params = new URLSearchParams(request.query);

    // You can now use the `params` object to get values from the query string
    const data = params.get('data') || '';

    if (!data) {
        return await sendError("The new user data was null.");
    } ``

    const newUser = JSON.parse(data);

    if (!newUser.userName || !newUser.identityProvider) {
        return await sendError("The user name or identity provider was null.");
    }

    const prodUri = process.env["PROD_URI"];
    const baseUri = process.env["NODE_ENV"] === "development" ? "http://localhost:7071" : prodUri;

    const templateData = {
        newUserName: newUser.userName,
        newIdentityProvider: newUser.identityProvider,
        data: data,
        prodUri: prodUri,
        baseUri: baseUri
    };

    return await send(200, templateData);
};

async function sendError(message: string): Promise<HttpResponseInit> {
    return await send(500, { message: message }, templates.error);
}

async function send(status: number, data: any, templateSource: string = templates.home,): Promise<HttpResponseInit> {
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

app.http('home', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: Home
});
