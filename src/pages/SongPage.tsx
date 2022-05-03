import React, {useEffect, useState} from 'react'
import { Container,
         Row,
         Col,
         Spinner,
         Image,
         Card,
         Modal,
         Button} from 'react-bootstrap';
import { useLocation } from 'react-router'
import axios from "axios"
import {
    Track,
    Artist,
    AllPlaylists,
    PlaylistGeneralEntry,
    PlaylistEntry
} from '../interfaces'

interface Playlist {
    id: string
    name: string
}

const SongPage = () => {
    const [token, setToken] = useState<string>("")
    const [track, setTrack] = useState<Track>()
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isError, setIsError] = useState<boolean>(false)
    const [allPlaylists, setAllPlaylists] = useState<AllPlaylists|undefined>(undefined)
    const [inPlaylists, setInPlaylists] = useState<Playlist[]>([])
    const [notInPlaylists, setNotInPlaylists] = useState<Playlist[]>([])
    const [playlistsAreLoading, setPlaylistsAreLoading] = useState<boolean>(true)

    /** Modal supporting states */
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
    const [newInPlaylists, setNewInPlaylists] = useState<Playlist[]>([])
    const [newNotInPlaylist, setNewNotInPlaylists] = useState<Playlist[]>([])

    const SONG_ENDPOINT = "	https://api.spotify.com/v1/tracks/"
    const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists"
    const SONG_ID = window.location.pathname.split('/')[2]

    useEffect(() => {
        if (token === "") {
            if (localStorage.getItem("accessToken")) {
                setToken(localStorage.getItem("accessToken")!)
            }
        } else if (!allPlaylists){
            async function fetchData() {
                try {
                    const res = await axios.get(SONG_ENDPOINT+`${SONG_ID}`, {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    })
                    setTrack(res.data)
                    
                } catch (e) {
                    console.error(`COULD NOT RETRIEVE SONG. ${e}`)
                    setIsError(true)
                }
                await getAllPlaylists()
                setIsLoading(false)
                
            }
            fetchData()
        } else {
            organizePlaylists()
        }
    }, [token, allPlaylists])

    const getAllPlaylists = async () => {
        try {
            const res = await axios.get(PLAYLISTS_ENDPOINT, {
                headers: {
                    Authorization: "Bearer " + token
                }
            })
            setAllPlaylists(res.data) 
        } catch (e) {
            console.error(`COULD NOT RETRIEVE USER PLAYLISTS. ${e}`)
        }
        
    }

    /** Fetches playlists the song is in and is not in */
    const organizePlaylists = async () => {
        const _inPlayLists: Playlist[] = []
        const _notInPlaylists: Playlist[] = []
        // const playlistLoopPromise = new Promise(async (resolve, reject) => {
        const playlists: PlaylistGeneralEntry[] = allPlaylists!.items
        for (let i=0; i < playlists.length; i++) {  // iterate through playlists
            const playlistID = playlists[i].id
            const playlistName = playlists[i].name
            let totalSongs = playlists[i].tracks.total
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
                        if (songID === SONG_ID) {
                            isInPlaylist = true
                            return false  // break loop
                        }
                        return true
                    })
                    if (isInPlaylist) {
                        const item: Playlist = {
                            id: playlistID,
                            name: playlistName
                        }
                        _inPlayLists.push(item);
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
                const item: Playlist = {
                    id: playlistID,
                    name: playlistName
                }
                _notInPlaylists.push(item)
            }
        }
        setInPlaylists(_inPlayLists)
        setNotInPlaylists(_notInPlaylists)
        setPlaylistsAreLoading(false)
    }

    const truncate = (title: string) => {
        const truncateLength = 15
        if (title.length > truncateLength) {
            return title.slice(0,truncateLength) + '...'
        }
        return title
    }

    /** MODAL FUNCTIONS */
    /** Populate modal supporting states */
    const openModal = () => {
        setNewInPlaylists(inPlaylists)
        setNewNotInPlaylists(notInPlaylists)
        setModalIsOpen(true)

    }
    /** Destroy modal supporting states */
    const closeModal = () => {
        setNewInPlaylists([])
        setNewNotInPlaylists([])
        setModalIsOpen(false)
    }

    const addToPlaylist = (event: any, playlist: Playlist) => {
        /** remove from notInPlaylist state */
        const idToRemove = playlist.id
        const tempNotInPlaylists = newNotInPlaylist.filter((playlist: Playlist) => playlist.id != idToRemove)
        setNewNotInPlaylists(tempNotInPlaylists)
        
        /** add to inPlaylist state */
        const tempInPlaylists = newInPlaylists.slice()
        tempInPlaylists.push(playlist)
        setNewInPlaylists(tempInPlaylists)
    }

    const removeFromPlaylist = (event: any, playlist: Playlist) => {
        /** remove from inPlayliststate */
        const idToRemove = playlist.id
        const tempInPlaylists = newInPlaylists.filter((playlist: Playlist) => playlist.id != idToRemove)
        setNewInPlaylists(tempInPlaylists)
        
        /** add to notInPlaylist state */
        const tempNotInPlaylists = newNotInPlaylist.slice()
        tempNotInPlaylists.push(playlist)
        setNewNotInPlaylists(tempNotInPlaylists)
    }

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
                    {playlistsAreLoading ? 
                        <Spinner animation="border"/>
                        :
                        <Card.Body style={{backgroundColor: 'lightBlue'}} className="p-5">
                            <Row>
                                <Col>
                                    <Row>
                                        In these playlists:
                                    </Row>
                                    <Row>
                                        {inPlaylists.map((playlist: Playlist) => {
                                            return <p> {playlist.name} </p>
                                        })}
                                    </Row>
                                </Col>
                                <Col>
                                    <Row>
                                        Not in these playlists: 
                                    </Row>
                                    <Row>
                                        {notInPlaylists.map((playlist: Playlist) => {
                                            return <p> {playlist.name} </p>
                                        })}
                                    </Row>
                                </Col>
                            </Row>
                            <Row>
                                <Button variant="outline-primary" onClick={openModal}>
                                    What??
                                </Button>
                            </Row>
                        </Card.Body>
                    }
                </div>
            }
            <Modal show={modalIsOpen} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Adjust playlists</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-3">
                    <Row>
                        <Col>
                            <h3>
                                Add to:
                            </h3>
                        </Col>
                        <Col>
                            <h3>
                                Remove from:
                            </h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            {newInPlaylists.map((playlist: Playlist) => {
                                return( 
                                    <div className="py-1">
                                        <Button
                                            variant="outline-secondary"
                                            onClick={e => removeFromPlaylist(e, playlist)}
                                            > 
                                            {truncate(playlist.name)} 
                                        </Button>
                                    </div>
                                    
                                )
                            })}
                        </Col>
                        <Col>
                            {newNotInPlaylist.map((playlist: Playlist) => {
                                return( 
                                    <div className="py-1">
                                        <Button 
                                            variant="outline-secondary"
                                            onClick={e => addToPlaylist(e, playlist)}
                                            > 
                                            {truncate(playlist.name)}  
                                        </Button>
                                    </div>
                                )
                            })}
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => setModalIsOpen(false)}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
    
}

export default SongPage