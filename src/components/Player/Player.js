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
                // activeColor: "#252e31",
                // altColor: "#FFF",
                bgColor: "#252e31", //Background color
                color: "#aab182", // icon colors
                // errorColor: "#FFF",
                height: 50, //album art made bigger
                // loaderColor: "#FFF",
                // loaderSize: 50,
                // sliderColor: "#252e31",
                // sliderHandleBorderRadius: 50,
                // sliderHandleColor: "#FFF",
                // sliderHeight: 50, //Slider height
                sliderTrackBorderRadius: 50, //curve radius of slider
                sliderTrackColor: "#FFF", //incomplete track color
                trackArtistColor: "#FFF", //artist name color
                trackNameColor: "#FFF", //song name color
            }}
        />
    )
}

export default Player;