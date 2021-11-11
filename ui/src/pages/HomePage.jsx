import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { useHistory  } from 'react-router'
import axios from "axios"


const USER_ENDPOINT = "https://api.spotify.com/v1/me"

const HomePage = () => {
    const [token, setToken] = useState("")
    const [userData, setUserData] = useState({})
    const history = useHistory()

    useEffect(() => {
        if (token === "" && window.location.hash) {
            handleRedirect(window.location.hash)
        } else {
            getUserData()
        }
    }, [token])

     /** Get and store all parameters returned by spotify after the user is logged in*/
     const handleRedirect = (hash) => {
        // parse returned parameters
        const uriParams = hash.substring(1)
        const splitParams = uriParams.split("&")
        const reducedParams = splitParams.reduce((accumulator, currVal) => {
            const [key, val] = currVal.split("=")
            accumulator[key] = val
            return accumulator
        }, {});
        const {
            access_token,
            expires_in,
            token_type
        } = reducedParams;

        // store parameters
        localStorage.clear();
        localStorage.setItem("accessToken", access_token)
        localStorage.setItem("expiresIn", expires_in)
        localStorage.setItem("tokenType", token_type)

        // set token
        setToken(access_token)
    }

    const getUserData = () => {
        axios.get(USER_ENDPOINT, {
            headers: {
                Authorization: "Bearer " + token
            }
        })
        .then((res) => {
            setUserData(res.data)
        })
        .catch((e) => {
            console.error(`COULD NOT RETRIEVE USER DATA. ${e}`)
        })
    
    } 

    const test = () => {
        console.log(userData)
    }

    const pushToPlaylistsPage = () => {
        history.push("/playlists")
    }

    return(
        <div>
            <h2>
                Welcome {userData.display_name ? userData.display_name : ''}
            </h2>
            <Button onClick={test}>get stuff </Button>
            <Button onClick={pushToPlaylistsPage}> Check out your playlists </Button>
        </div>
        
    )
}

export default HomePage