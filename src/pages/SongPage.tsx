import React, {useEffect, useState} from 'react'
import { Container,
         Row,
         Spinner,
         Image} from 'react-bootstrap';
import { useLocation } from 'react-router'
import axios from "axios"
import {
    Track, Artist
} from '../interfaces'


const SongPage = () => {
    const [token, setToken] = useState<string>("")
    const [track, setTrack] = useState<Track>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isError, setIsError] = useState<boolean>(false)

    const SONG_ENDPOINT = "	https://api.spotify.com/v1/tracks/"
            
    useEffect(() => {
        if (token === "") {
            if (localStorage.getItem("accessToken")) {
                setToken(localStorage.getItem("accessToken")!)
            }
        } else {
            const songId = window.location.pathname.split('/')[2]
            async function fetchData() {
                try {
                    const res = await axios.get(SONG_ENDPOINT+`${songId}`, {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    })
                    console.log(res.data)
                    setTrack(res.data)
                    
                } catch (e) {
                    console.error(`COULD NOT RETRIEVE SONG. ${e}`)
                    setIsError(true)
                }
                setIsLoading(false)
            }
            fetchData()
        }
    }, [token])


    return(
        <Container style={{width:'50%'}}>
            {isLoading && <Spinner animation="border"/>}
            {isError && <div>
                Could not retrieve the requested song. Please try again later.
            </div> }
            {!isLoading && 
                <div>
                    <div>
                        {track!.name}
                    </div>
                    <Image src={track!.album.images[1].url} className="py-2"/>
                    <div>
                        {track!.artists.map((artist: Artist) => {
                            return (<p>{artist.name}</p>)
                        })}
                    </div>

                </div>
            }
        </Container>
    )
    
}

export default SongPage