export async function updateBio(bio,id){
    await post( `/edit/bio`, 
        {
            userID: id,
            bio: bio
        }
    )
}