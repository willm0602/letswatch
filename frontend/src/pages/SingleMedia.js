import { useLocation } from 'react-router-dom'
import Footer from './components/footer'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../contextSetup'
import Button from '@mui/material/Button'
import Skeleton from '@mui/material/Skeleton'

//API
import getFromTMDB from '../APIInterface/TMDB'
import FrontPageRatingBubble from './components/frontPageRatingBubble'

const SingleMedia = () => {
    const location = useLocation()
    const [currentMedia, setCurrentMedia] = useState(null)
    const ctx = useContext(UserContext)
    const [trailer, setTrailer] = useState(null)
    const [cast, setCast] = useState(null)

    useEffect(() => {
        const setThingsUp = async (mediaType) => {
            await getFromTMDB(`${mediaType}/${ctx.currentMediaPage.id}`).then(
                (res) => {
                    console.log(res)
                    setCurrentMedia(res)
                    getFromTMDB(`${mediaType}/${res.id}/videos?`).then(
                        (res) => {
                            const YTvids = res.results.filter(
                                (res) =>
                                    res.site === 'YouTube' &&
                                    res.name.toLowerCase().includes('trailer')
                            )
                            console.log(YTvids)
                            YTvids.length > 0
                                ? setTrailer(
                                      `https://www.youtube.com/embed/${YTvids[0].key}`
                                  )
                                : setTrailer(null)
                        }
                    )
                    getFromTMDB(`${mediaType}/${res.id}/credits`).then(
                        (res) => {
                            console.log(res)
                            setCast(res.cast)
                        }
                    )
                }
            )
        }
        ctx.currentMediaPage.title
            ? setThingsUp('movie')
            : ctx.currentMediaPage.type
            ? setThingsUp(ctx.currentMediaPage.type)
            : setThingsUp('tv')
    }, [])

    return currentMedia ? (
        <div style={{ paddingBottom: '1000px' }}>
            <div
                style={{
                    backgroundImage: `url(https://www.themoviedb.org/t/p/original${currentMedia.backdrop_path})`,
                    height: '250px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start',
                    alignItems: 'center',
                    position: 'relative',
                    boxShadow: '0px 1px 5px black',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        backgroundColor: 'rgba(108,99,255,0.7)',
                        height: '100%',
                        width: '100%',
                    }}
                ></div>
                <h2 style={{ color: 'white', zIndex: '99', margin: '0.5em' }}>
                    Let's Watch
                </h2>
                <div style={{ display: 'flex', color: 'white', zIndex: '99' }}>
                    <div
                        style={{
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            margin: 'auto',
                        }}
                    >
                        <img
                            style={{ width: '100px' }}
                            src={`https://image.tmdb.org/t/p/original${currentMedia.poster_path}`}
                        />
                        <FrontPageRatingBubble
                            rating={Math.round(currentMedia.vote_average * 10)}
                        />
                    </div>
                    <div style={{ margin: '0 10px', width: '65%' }}>
                        {currentMedia.title ? (
                            <h4 style={{ margin: 0 }}>{currentMedia.title}</h4>
                        ) : (
                            <h2 style={{ margin: 0 }}>{currentMedia.name}</h2>
                        )}
                        {currentMedia.release_date ? (
                            <i style={{ margin: 0 }}>
                                {currentMedia.release_date.replaceAll('-', '/')}
                            </i>
                        ) : (
                            <i style={{ margin: 0 }}>
                                {currentMedia.first_air_date.replaceAll(
                                    '-',
                                    '/'
                                )}
                            </i>
                        )}
                        <p style={{ margin: '0' }}>
                            {currentMedia.genres.map((genre) => (
                                <i>{genre.name} </i>
                            ))}
                        </p>
                        <Button
                            onClick={() => test()}
                            variant="contained"
                            style={{
                                maxWidth: '300px',
                                margin: 'auto',
                                color: '#6C63FF',
                                backgroundColor: 'white',
                                borderRadius: '15px',
                            }}
                        >
                            Add To List
                        </Button>
                    </div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        margin: '5%',
                    }}
                >
                    <h3 style={{ marginTop: '3em' }}>Trailer</h3>

                    <div style={{ maxWidth: '100%' }}>
                        <div className="video-container">
                            <iframe
                                width="560"
                                height="315"
                                src={trailer}
                                title="YouTube video player"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                            ></iframe>
                        </div>
                    </div>

                    <h3>Synopsis</h3>
                    <p>{currentMedia.overview}</p>

                    <h3>Cast</h3>
                    <div>
                        <div
                            className="frame"
                            style={{
                                display: 'flex',
                                overflow: 'scroll',
                                padding: '10px',
                                maxWidth: '350px',
                                alignItems: 'start',
                            }}
                        >
                            {cast
                                ? cast.map((c) => (
                                      <div
                                          style={{
                                              display: 'flex',
                                              flexDirection: 'column',
                                              margin: '0 10px',
                                          }}
                                      >
                                          {c.profile_path ? (
                                              <img
                                                  style={{ width: '120px' }}
                                                  src={`https://www.themoviedb.org/t/p/original/${c.profile_path}`}
                                              />
                                          ) : (
                                              <Skeleton
                                                  variant="rectangular"
                                                  width={120}
                                                  height={180}
                                              />
                                          )}
                                          <p style={{ margin: 0 }}>{c.name}</p>
                                          <b style={{ margin: 0 }}>
                                              {c.character}
                                          </b>
                                      </div>
                                  ))
                                : null}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    ) : (
        <p>Loading...</p>
    )
}

export default SingleMedia
