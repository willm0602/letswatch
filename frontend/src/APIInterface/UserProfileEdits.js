import { getAccessToken } from '../LocalStorageInterface'
import { post } from './Utils'

export async function changeBio(id, newBio){
    return await post( `/edit/bio`, 
        {
            accessToken: getAccessToken(),
            bio: newBio
        }
    )
}

export async function changeImage(id, image){
    return await post(`/edit/image`,
        {
            accessToken: getAccessToken(),
            newImage: image
        }
    )
}