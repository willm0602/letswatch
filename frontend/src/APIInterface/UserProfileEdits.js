import { getAccessToken } from '../LocalStorageInterface'
import { post } from './Utils'

export async function changeBio(newBio){
    return await post( `/edit/bio`, 
        {
            accessToken: getAccessToken(),
            bio: newBio
        }
    )
}

export async function changeImage(image){
    return await post(`/edit/image`,
        {
            accessToken: getAccessToken(),
            image
        }
    )
}