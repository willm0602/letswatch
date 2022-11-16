import { setAccessToken } from '../LocalStorageInterface'
import { get, post } from './Utils'

export async function signup(username, password) {
    await post(
        '/account/signup',
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
            console.error(rej)
        }
    )
}

export async function login(username, password) {
    await get(
        '/account/login',
        {
            username,
            password,
        },
        (res) => {
            if (res.status === 'PASS') {
                setAccessToken(res.data)
                console.log('Access Token set');
            }
        },
        (rej) => {
            //window.alert(rej);
            console.error(rej)
        }
    )
}
