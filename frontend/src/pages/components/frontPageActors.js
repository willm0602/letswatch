import Skeleton from '@mui/material/Skeleton';

const FrontPageActors = ({actorInfo}) =>{

    return(
        <div style={{display:'flex', flexDirection:'column', margin:'0 10px'}}>
            {actorInfo.profile_path ?
                <img style={{width:'100px'}} src={`https://www.themoviedb.org/t/p/original/${actorInfo.profile_path}`}/>
                :
                <Skeleton variant="rectangular" width={100} height={150} />
            }
            <b>{actorInfo.name}</b>
        </div>
    )

}

export default FrontPageActors;