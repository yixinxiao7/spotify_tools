import React from 'react'
import Login from '../components/Login'


const OnboardingPage = () => {
    return(
        <div>
            <h1>
                Spotify Tools
            </h1>
            <h3>
                Welcome to Spotify Tools. Log in to access your Spotify account.
            </h3>
            <Login/>
        </div>
    )
}

export default OnboardingPage