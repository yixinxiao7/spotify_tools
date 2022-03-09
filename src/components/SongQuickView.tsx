import React, { useState, useEffect } from 'react'
import { Row,
         Col,
         Image,
         Card,
         Button,
         Spinner } from 'react-bootstrap';
import ReactCardFlip from 'react-card-flip';
import axios from "axios";
import { useNavigate  } from 'react-router'
import {
    PlaylistEntry
} from '../interfaces'

type SongQuickViewProps = {
    id: string
    name: string
    artists: string[]
    image: string
    allPlayListIDs: string[]
    playlistNames: string[],
    playlistLengths: number[]
  };

  
const SongQuickView = ({id, 
        name, 
        artists, 
        image, 
        allPlayListIDs, 
        playlistNames, 
        playlistLengths}: SongQuickViewProps) => {
    const [token, setToken] = useState<string>("")
    const [isFlipped, setIsFlipped] = useState<boolean>(false)
    const [inPlaylists, setInPlaylists] = useState<string[]>([])
    const [notInPlaylists, setNotInPlaylists] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (token === "") {
            if (localStorage.getItem("accessToken")) {
                setToken(localStorage.getItem("accessToken")!)
            }
        } 
        if (isFlipped){
            setPlaylists()
        } else {
            // dump any data if exists
            setInPlaylists([])
            setNotInPlaylists([])
        }
    }, [token, isFlipped])

    const setPlaylists = async () => {
        const _inPlayLists = []
        const _notInPlaylists = []
        // const playlistLoopPromise = new Promise(async (resolve, reject) => {
        for (let i=0; i < allPlayListIDs.length; i++) {  // iterate through playlists
            const playlistID = allPlayListIDs[i]
            const playlistName = playlistNames[i]
            let totalSongs = playlistLengths[i]

            // loop through all songs In the playlist by increments of 100
            const numLoops = Math.ceil(totalSongs / 100)
            let limit = totalSongs > 100 ? 100 : totalSongs
            let offset = 0
            let isInPlaylist = false
            for (let j=0; j < numLoops; j++) {
                if (totalSongs < 0) { 
                    break
                }
                const PLAYLIST_ENDPOINT = `https://api.spotify.com/v1/playlists/${playlistID}/tracks?limit=${limit}&offset=${offset}`
                try {
                    const res = await axios.get(PLAYLIST_ENDPOINT, {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    })
                    const items: PlaylistEntry[] = res.data.items
                    // eslint-disable-next-line no-loop-func
                    items.every(song => {
                        const songID = song.track.id
                        if (songID === id) {
                            isInPlaylist = true
                            return false  // break loop
                        }
                        return true
                    })
                    if (isInPlaylist) {
                        _inPlayLists.push(playlistName);
                        totalSongs = -1  // break out of loop to reduce api calls
                    } else {  // cotinue processing
                        totalSongs -= 100  // processed a MAX of 100 songs
                        limit = totalSongs > 100 ? 100 : totalSongs
                        offset += 100
                    }
                } catch (e) {
                    console.error(`COULD NOT RETRIEVE USER PLAYLIST ${playlistID}. ${e}`)
                }
            }
            if (!isInPlaylist) {
                _notInPlaylists.push(playlistName)
            }
        }
        setInPlaylists(_inPlayLists)
        setNotInPlaylists(_notInPlaylists)
        setIsLoading(false)
    }

    const formatArtists = () => {
        const formattedArtists = artists.join(' & ')
        return(
            <p> {formattedArtists} </p>
        )
    }

    const flipCard = () => {
        if (!isFlipped) { 
            setIsLoading(true)
        }
        setIsFlipped(!isFlipped)
    }

    const pushToSongPage = () => {
        navigate(`/songs/${id}`)
    }

    return(
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
            <Card>
                <Row className="px-2">
                    <Col xs={'auto'}>
                        <Image src={image} className="py-2"/>
                    </Col>
                    <Col xs={'auto'}>
                        <Row>
                        <p>
                            {name}
                        </p>
                        </Row>
                        <Row>
                            {formatArtists()}
                        </Row>
                    </Col>
                </Row>
                <Button onClick={flipCard}>View/Adjust Playlists</Button>
            </Card>

            <Card>
                {isLoading && 
                    <Spinner 
                        animation="border" 
                        style={{
                            position: 'relative',
                            left: '48%',
                        }}/>}
                {!isLoading && 
                    <Card.Body>
                        <Row>
                            <Col>
                                <Row>
                                    In these playlists:
                                </Row>
                                <Row>
                                    {inPlaylists.map(playlistName => {
                                        return <p> {playlistName} </p>
                                    })}
                                </Row>
                            </Col>
                            <Col>
                                <Row>
                                    Not in these playlists: 
                                </Row>
                                <Row>
                                    {notInPlaylists.map(playlistName => {
                                        return <p> {playlistName} </p>
                                    })}
                                </Row>
                            </Col>
                        </Row>
                    </Card.Body>}
                <Card.Footer>
                    <Row>
                        <Col xs={6}>
                            <Button onClick={flipCard} disabled={isLoading} style={{float: 'right'}}>Go back</Button>
                        </Col>
                        <Col xs={6}>
                            <Button onClick={pushToSongPage}>Modify Playlists</Button>
                        </Col>
                    </Row>
                </Card.Footer>
                
                
            </Card>
        </ReactCardFlip>

        
    )
}

export default SongQuickView