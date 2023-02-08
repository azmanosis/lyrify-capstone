import { useState, useEffect } from 'react';
import SpotifyPlayer from "react-spotify-web-playback";

function Player({ accessToken, trackUri }) {
    const [play, setPlay] = useState(false)

    useEffect(() => setPlay(true), [trackUri])

    if (!accessToken) return null
    return (
        <SpotifyPlayer
            token={accessToken}
            showSaveIcon={true}
            callback={state => {
                if (!state.isPlaying) setPlay(false)
            }}
            play={play}
            uris={trackUri ? [trackUri] : []}
            styles={{
                // activeColor: "#000",
                // altColor: "#FFF",
                bgColor: "#252e31", //Background color
                color: "#aab182", // icon colors
                // errorColor: "#FFF",
                height: 100,
                // loaderColor: "#FFF",
                // loaderSize: 50,
                // sliderColor: "#FFF",
                // sliderHandleBorderRadius: 50,
                // sliderHandleColor: "#FFF",
                // sliderHeight: 50,
                // sliderTrackBorderRadius: 50,
                // sliderTrackColor: "#FFF",
                // trackArtistColor: "#FFF",
                // trackNameColor: "#FFF",
            }}
        />
    )
}

export default Player;