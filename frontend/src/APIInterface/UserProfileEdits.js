import { post } from './Utils'

export async function changeBio(id, newBio){
    return await post( `/edit/bio`, 
        {
            userID: id,
            bio: newBio
        }
    )
}

export async function changeImage(id, image){
    return await post(`/edit/image`,
        {
            userID: id,
            newImage: image
        }
    )
}