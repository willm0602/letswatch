import { setAccessToken } from '../LocalStorageInterface'
import { get, post } from './Utils'

export function signup(username, password) {
    post(
        '/account/signup',
        {
            username,
            password,
        },
        (res) => {
            if (res.status === 'PASS') {
                console.log(`access token is `, res.data);
                setAccessToken(res.data)
            }
        },
        (rej) => {
            console.error(rej)
        }
    )
}

export function login(username, password) {
    get(
        '/account/login',
        {
            username,
            password,
        },
        (res) => {
            if (res.status === 'PASS') {
                setAccessToken(res.data)
            }
        },
        (rej) => {
            //window.alert(rej);
            console.error(rej)
        }
    )
}
