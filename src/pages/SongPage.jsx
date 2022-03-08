import React, {useEffect, useState} from 'react'
import { Container,
         Row,
         Spinner,
         Image} from 'react-bootstrap';
import { useLocation } from 'react-router'
import axios from "axios"


const SongPage = () => {
    const [token, setToken] = useState("")
    const [track, setTrack] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const SONG_ENDPOINT = "	https://api.spotify.com/v1/tracks/"
            
    useEffect(() => {
        if (token === "") {
            if (localStorage.getItem("accessToken")) {
                setToken(localStorage.getItem("accessToken"))
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
                    setIsLoading(false)
                } catch (e) {
                    console.error(`COULD NOT RETRIEVE USER PLAYLISTS. ${e}`)
                }
            }
            fetchData()
        }
    }, [token])


    return(
        <Container style={{width:'50%'}}>
            {isLoading && <Spinner />}
            {!isLoading && 
                <div>
                    <div>
                        {track.name}
                    </div>
                    <Image src={track.album.images[1].url} className="py-2"/>
                    <div>
                        {track.artists.map(artist => {
                            return (<p>{artist.name}</p>)
                        })}
                    </div>

                </div>
            }
        </Container>
    )
    
}

export default SongPage