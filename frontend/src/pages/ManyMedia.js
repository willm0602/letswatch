import Footer from './components/footer'
import { UserContext } from '../contextSetup'
import React, { useContext, useEffect, useState } from 'react'
import { Autocomplete } from '@mui/material'
import { TextField } from '@mui/material'
import { Link } from 'react-router-dom'

import AddCircleIcon from '@mui/icons-material/AddCircle'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import { Button } from '@mui/material'
import Skeleton from '@mui/material/Skeleton';

const ManyMedia = () => {
    const ctx = useContext(UserContext)
    const autoFillMedia = ctx.autoFillMedia;

    const [randomBackground, setRandomBackground] = useState(0)


    useEffect(() => {
        const randomNumber = Math.floor(Math.random() * 21)
        setRandomBackground(randomNumber)
    }, [])

    const autoCompletePlaceholderData = [
        {
            label: 'test1',
        },
        {
            label: 'test2',
        },
        {
            label: 'test3',
        },
    ]
    return (
        <>
            <div
                style={{
                    backgroundImage: `url(/mediaBackgroundImages/${randomBackground}.jpg)`,
                    height: '250px',
                    backgroundSize: 'cover',
                    backgroundPosition: 'top',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
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
                <h1 style={{ color: 'white', zIndex: '99' }}>Let's Watch</h1>
                <Autocomplete
                    id="autocomplete"
                    options={autoFillMedia}
                    getOptionLabel={(option) => option.title}
                    sx={{
                        width: 300,
                        marginTop: '15px',
                        backgroundColor: 'white',
                        zIndex: 99,
                        borderRadius: '100px',
                    }}
                    renderOption={(props, options) => (
                        <Button
                            
                            onClick={()=> console.log(options)}
                            
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                paddingTop: '10px',
                                width: '100%',
                                textTransform: 'none',
                            }}
                        >
                            {' '}
                            {options.image_url ?
                            <img
                                style={{ maxWidth: '50px' }}
                                src={options.image_url}
                            />
                            :<Skeleton animation={false} variant="rectangular" width={50} height={75} />
                            }
                            <p style={{ marginLeft: '15px' }}>
                                {options.title}
                            </p>
                            <Link to={`media/${options.id}`} style={{color:'#1976d2'}}>
                                <ArrowCircleRightIcon/>
                            </Link>
                        </Button>
                    )}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Add Media"
                            inputProps={{
                                ...params.inputProps,
                                autocomplete: 'new-password',
                            }}
                        />
                    )}
                />
            </div>

            <>medias</>
            <Footer />
        </>
    )
}

export default ManyMedia
