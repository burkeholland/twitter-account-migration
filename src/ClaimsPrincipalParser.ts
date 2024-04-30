import { HttpRequest } from "@azure/functions";

interface ClientPrincipalClaim {
    typ: string;
    val: string;
}

interface ClientPrincipal {
    auth_typ: string;
    name_typ: string;
    role_typ: string;
    claims: ClientPrincipalClaim[];
}

class ClaimsIdentity {
    constructor(public identityProvider: string, public nameClaimType: string, public roleClaimType: string, public claims: ClientPrincipalClaim[]) { }
}

class ClaimsPrincipal {
    constructor(public identity: ClaimsIdentity) { }
}

function parse(req: HttpRequest): ClaimsPrincipal | null {
    let principal: ClientPrincipal = {
        auth_typ: '',
        name_typ: '',
        role_typ: '',
        claims: []
    };

    if (req.headers['x-ms-client-principal']) {
        const data = req.headers['x-ms-client-principal'][0];
        const decoded = Buffer.from(data, 'base64').toString();
        principal = JSON.parse(decoded);
    }

    const identity = new ClaimsIdentity(principal.auth_typ, principal.name_typ, principal.role_typ, principal.claims);
    return new ClaimsPrincipal(identity);
}

export { parse };