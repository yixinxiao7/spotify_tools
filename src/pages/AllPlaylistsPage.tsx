import React, {useEffect, useState} from 'react'
import { Container,
         Button } from 'react-bootstrap';
import { useNavigate  } from 'react-router'
import axios from "axios"
import {
    AllPlaylists, PlaylistGeneralEntry
} from '../interfaces'



const PLAYLISTS_ENDPOINT = "https://api.spotify.com/v1/me/playlists"

const AllPlaylistsPage = () => {
    const [playlists, setPlaylists] = useState<AllPlaylists|undefined>(undefined)
    const [token, setToken] = useState("")
    const navigate = useNavigate()
    const songsPerPage = 50

    useEffect(() => {
        if (token === "") {
            if (localStorage.getItem("accessToken")) {
                setToken(localStorage.getItem("accessToken")!)
            }
        } else {
            async function fetchData() {
                try {
                    const res = await axios.get(PLAYLISTS_ENDPOINT, {
                        headers: {
                            Authorization: "Bearer " + token
                        }
                    })
                    setPlaylists(res.data) 
                } catch (e) {
                    console.error(`COULD NOT RETRIEVE USER PLAYLISTS. ${e}`)
                }
            }
            fetchData()
        } 
    }, [token])

    const pushToSongsPage = (event: any, playlist: PlaylistGeneralEntry) => {
        event.preventDefault()
        if (playlists) {
            const playlistIDs = playlists.items.map((playlist: PlaylistGeneralEntry) => {return playlist.id})  // used to reduce api calls later
            const playlistNames = playlists.items.map((playlist: PlaylistGeneralEntry) => {return playlist.name})  // used to reduce api calls later
            const playlistLengths = playlists.items.map((playlist: PlaylistGeneralEntry) => {return playlist.tracks.total})  // used to reduce api calls later
            // if (playlist.id === 'likedsongs') {
            //     const toRemove = playlistIDs.indexOf(playlist.id)
            //     playlistIDs.splice(toRemove)  // remove target playlist
            //     playlistNames.splice(toRemove)
            //     playlistLengths.splice(toRemove)
            // }
            navigate(
                `/playlists/${playlist.id}`, {
                    state: {
                        id: playlist.id,
                        name: playlist.name,
                        itemsPerPage: songsPerPage,
                        allPlaylistIDs: playlistIDs,
                        playlistNames: playlistNames,
                        playlistLengths: playlistLengths
                    }})
        }
    }

    return(
        <Container>
            {/* {playlists && 
                <Button onClick={e => pushToSongsPage(e, playlists.items)}>
                    Liked Songs
                </Button>
            } */}
            {playlists && 
             playlists.items.map((playlist, idx) => {
                return(
                    <Button 
                        key={idx} 
                        onClick={e => pushToSongsPage(e, playlist)} > 
                        {playlist.name} 
                    </Button>)
            })}
        </Container>
    )
}

export default AllPlaylistsPage