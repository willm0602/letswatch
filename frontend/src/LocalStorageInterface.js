/**
 * Functions to help w/ interacting with local storage
 */

function reload() {
    window.location.reload()
}

export function setAccessToken(accessToken) {
    localStorage.setItem('letswatchAccessToken', accessToken)
    reload()
}

export function setID(id) {
    localStorage.setItem('letswatchID', id)
    reload()
}

export function getAccessToken() {
    return localStorage.getItem('letswatchAccessToken')
    reload()
}

export function deleteAccessToken() {
    localStorage.removeItem('letswatchAccessToken')
    reload()
}

export function getID() {
    return localStorage.getItem('letswatchID')
    reload()
}

export function userIsSignedIn() {
    return getAccessToken() != null
    reload()
}
