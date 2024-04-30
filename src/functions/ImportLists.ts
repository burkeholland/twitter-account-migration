import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import * as ClaimsPrincipalParser from "../ClaimsPrincipalParser";

export async function ImportLists(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {

    // const clientPrincipal = ClaimsPrincipalParser.parse(request);

    // parse client pricnipal from header
    let clientPrincipal = null;
    if (request.headers['x-ms-client-principal']) {
        const data = request.headers['x-ms-client-principal'][0];
        const decoded = Buffer.from(data, 'base64').toString();
        clientPrincipal = JSON.parse(decoded);
    }

    if (!clientPrincipal) {
        // return await sendError("The Twitter Client Principal was null.");
    }

    // if (clientPrincipal === null) {
    //     // return await sendError("The Twitter Client Principal was null.");
    // }

    // // Assuming request.query is a string
    // const params = new URLSearchParams(request.query);

    // // You can now use the `params` object to get values from the query string
    // const newUserDataJSON = params.get('newUserData') || '';

    // if (!newUserDataJSON) {
    //     // return await sendError("The new user data was null.");
    // }

    // const newUser = JSON.parse(newUserDataJSON);

    // // here we have client principal and new user data
    // const client = new CosmosClient(process.env["COSMOSDB_CONNECTION_STRING"]);
    // const database = client.database('');


    // const name = request.query.get('name') || await request.text() || 'world';

    // stringify all headers
    const headers = JSON.stringify(request.headers);

    return { body: headers };
};

app.http('import', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: ImportLists
});
