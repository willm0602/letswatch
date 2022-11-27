
export default function({profileID, username, otherStyles})
{
    return (
    profileID !== null ?
    <img
    src={`/profileImages/${profileID}.jpg`}
    style={{
        color: 'white',
        maxWidth: '30px',
        borderRadius: '50%',
        border: '1px solid black',
        ...otherStyles
    }}
    />
    :
    <img
    src={`https://eu.ui-avatars.com/api/?name=${username}&size=250&length=1&background=bdbdbd&color=fff`}
    style={{
        color: 'white',
        maxWidth: '30px',
        borderRadius: '50%',
        border: '1px solid black',
        ...otherStyles
    }}
    />
)
}