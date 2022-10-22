import { setAccessToken } from "../LocalStorageInterface";
import { post } from "./Utils";

export function signup(username, password)
{
    post('/account/signup', {
        username,
        password
    }, (res) => {
        if(res.status === 'PASS')
        {
            setAccessToken(res.data);
        }  
    },
        (rej) => {
            window.alert(rej.msg);
        }
    )
}