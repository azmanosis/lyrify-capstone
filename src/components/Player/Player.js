import { useState, useEffect } from 'react';
import SpotifyPlayer from "react-spotify-web-playback";

function Player({ accessToken, trackUri }) {
    const [play, setPlay] = useState(false)

    useEffect(() => setPlay(true), [trackUri])

    if (!accessToken) return null
    return (
        <SpotifyPlayer
            initialVolume={0.1}
            token={accessToken}
            showSaveIcon={true}
            callback={state => {
                if (!state.isPlaying) setPlay(false)
            }}
            play={play}
            uris={trackUri ? [trackUri] : []}
            styles={{
                activeColor: "#252e31",
                altColor: "#252e31",
                bgColor: "#252e31", //Background color
                color: "#aab182", // icon colors
                errorColor: "#252e31",
                height: 50, //album art made bigger
                loaderColor: "#252e31",
                loaderSize: 100,
                sliderColor: "#b0b886", //slider complete track color
                sliderHandleBorderRadius: 100,
                sliderHandleColor: "#252e31", // slider seeker
                sliderHeight: 5, //Slider height
                sliderTrackBorderRadius: 50, //curve radius of slider
                sliderTrackColor: "#50646a", // slider incomplete track color
                trackArtistColor: "#7f8561", //artist name color
                trackNameColor: "#b0b886", //song name color
            }}
        />
    )
}

export default Player;