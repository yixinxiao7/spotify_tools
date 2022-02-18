import React, { useState, useEffect } from 'react'
import { Row,
         Col,
         Image,
         Card,
         Button,
         Spinner } from 'react-bootstrap';
import PropTypes from 'prop-types';
import ReactCardFlip from 'react-card-flip';
import axios from "axios";

const SongQuickView = (props) => {
    const [token, setToken] = useState("")
    const [isFlipped, setIsFlipped] = useState(false)
    const [inPlaylists, setInPlaylists] = useState([])
    const [notInPlaylists, setNotInPlaylists] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const spinnerStyle = {
        position: 'relative',
        left: '48%',
    }

    useEffect(() => {
        if (token === "") {
            if (localStorage.getItem("accessToken")) {
                setToken(localStorage.getItem("accessToken"))
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
        for (let i=0; i < props.allPlayListIDs.length; i++) {  // iterate through playlists
            const playlistID = props.allPlayListIDs[i]
            const playlistName = props.playlistNames[i]
            let totalSongs = props.playlistLengths[i]

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
                console.log("CALLING: " + PLAYLIST_ENDPOINT)
                try {
                    const res = await axios.get(PLAYLIST_ENDPOINT, {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    })
                    const items = res.data.items
                    // eslint-disable-next-line no-loop-func
                    items.every(song => {
                        const songID = song.track.id
                        if (songID === props.id) {
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
                        console.log(offset)
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
        const artists = props.artists.join(' & ')
        return(
            <p> {artists} </p>
        )
    }

    const flipCard = () => {
        if (!isFlipped) { 
            setIsLoading(true)
        }
        setIsFlipped(!isFlipped)
    }

    return(
        <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
            <Card>
                <Row className="px-2">
                    <Col xs={'auto'}>
                        <Image src={props.image} className="py-2"/>
                    </Col>
                    <Col xs={'auto'}>
                        <Row>
                        <p>
                            {props.name}
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
                {isLoading && <Spinner animation="border" style={spinnerStyle}/>}
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
                <Button onClick={flipCard} disabled={isLoading}>Go back</Button>
            </Card>
        </ReactCardFlip>

        
    )
}

SongQuickView.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    artists: PropTypes.array,
    image: PropTypes.string,
    allPlayListIDs: PropTypes.array,
    playlistNames: PropTypes.array,
    playlistLengths: PropTypes.array,
    totalSongs: PropTypes.number
}

export default SongQuickView