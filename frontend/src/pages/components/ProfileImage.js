
export default function({profileID, otherStyles})
{
    return <img
    src={`/profileImages/${profileID}.jpg`}
    style={{
        color: 'white',
        maxWidth: '30px',
        borderRadius: '50%',
        border: '1px solid black',
        ...otherStyles
    }}
/>
}