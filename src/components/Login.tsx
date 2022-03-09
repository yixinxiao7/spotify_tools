import React, { useEffect } from 'react';


const CLIENT_ID = "f302afa9ce974067be62558b9cbcca0f"
const AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize"
const REDIRECT_URI = "http://localhost:3000/home"  // TODO: change this
const SCOPES = [
    'playlist-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-read-currently-playing',
    'user-read-private',
    'user-read-email',
    'user-library-read'
]
const SCOPES_URI_PARAMS = SCOPES.join("%20")

const Login = () => {
    const handleLogin = () => {
        window.location.href = `${AUTHORIZE_ENDPOINT}` +
        `?client_id=${CLIENT_ID}` +
        `&redirect_uri=${REDIRECT_URI}` + 
        `&scope=${SCOPES_URI_PARAMS}` + 
        `&response_type=token` + 
        `&show_dialog=true`
    }

    return(
        <div>
            <button onClick={handleLogin}> Log in</button>
        </div>
    )

}

export default Login