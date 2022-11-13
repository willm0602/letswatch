import FrontPageRatingBubble from './frontPageRatingBubble'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { UserContext } from '../../contextSetup'

const FrontPageMedia = ({ mediaInfo }) => {
    const ctx = useContext(UserContext)

    const handlePageTransition = (mediaInfo) => {
        console.log(mediaInfo)
        console.log(ctx)
        ctx.setCurrentMediaPage(mediaInfo)
    }

    return (
        <Link
            onClick={() => handlePageTransition(mediaInfo)}
            to={`/media/${mediaInfo.id}`}
            style={{ textDecoration: 'none', color: 'black' }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    margin: '0 10px',
                }}
            >
                <div style={{ position: 'relative' }}>
                    <img
                        style={{ width: '100px' }}
                        src={`https://image.tmdb.org/t/p/original${mediaInfo.poster_path}`}
                    />
                    <FrontPageRatingBubble
                        rating={Math.round(mediaInfo.vote_average * 10)}
                    />
                </div>
                {mediaInfo.title ? (
                    <b style={{ margin: 0 }}>{mediaInfo.title}</b>
                ) : (
                    <b style={{ margin: 0 }}>{mediaInfo.name}</b>
                )}
                {mediaInfo.release_date ? (
                    <i style={{ margin: 0 }}>
                        {mediaInfo.release_date.replaceAll('-', '/')}
                    </i>
                ) : (
                    <i style={{ margin: 0 }}>
                        {mediaInfo.first_air_date.replaceAll('-', '/')}
                    </i>
                )}
            </div>
        </Link>
    )
}

export default FrontPageMedia
