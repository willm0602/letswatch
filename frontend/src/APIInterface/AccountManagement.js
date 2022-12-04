import { setAccessToken } from '../LocalStorageInterface'
import { get, post } from './Utils'

export async function signup(username, password) {
    return await post(
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
            return rej;
        }
    )
}

export async function login(username, password) {
    return await get(
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
            return rej;
        }
    )
}
