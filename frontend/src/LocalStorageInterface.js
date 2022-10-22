/**
 * Functions to help w/ interacting with local storage
*/

export function setAccessToken(accessToken)
{
    localStorage.setItem('letswatchAccessToken', accessToken);
}

export function setID(id)
{
    localStorage.setItem('letswatchID', id);
}

export function getAccessToken()
{
    return localStorage.getItem('letswatchAccessToken');
}

export function getID()
{
    return localStorage.getItem('letswatchID');
}

export function userIsSignedIn()
{
    return getAccessToken() != null;
}

