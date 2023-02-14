import './Dashboard.scss';
import { useState, useEffect } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
// import { Link } from 'react-router-dom';
import useAuth from '../../components/Auth/useAuth';
import Search from '../../components/Search/Search';
import Player from '../../components/Player/Player';
import { ReactComponent as Logo } from '../../assets/icons/logo.svg';
// import Path1 from '../../assets/icons/Logo/Path_1.svg';
// import Path2 from '../../assets/icons/Logo/Path_2.svg';
// import Path3 from '../../assets/icons/Logo/Path_3.svg';
// import Triangle from '../../assets/icons/triangle.svg';
import microPhoneIcon from '../../assets/icons/microphone.svg';

const spotifyApi = new SpotifyWebApi({
    clientId: "b7a11319b71d4c9fb5ea10737cace61f"
})

function Dashboard({ code }) {
    const accessToken = useAuth(code)
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [playingTrack, setPlayingTrack] = useState()
    const [lyrics, setLyrics] = useState("")
    // const [transcript, resetTranscript] = useSpeechRecognition({});
    // const [isListening, setIsListening] = useState(false);
    // const microphoneRef = useRef(null);

    function chooseTrack(track) {
        setPlayingTrack(track)
        setSearch("")
        setLyrics("")
    }

    useEffect(() => {
        if (!playingTrack) return

        axios.get('http://localhost:8080/lyrics', {
            params: {
                track: playingTrack.title,
                artist: playingTrack.artist
            }
        }).then(res => {
            setLyrics(res.data.lyrics)
        })
    }, [playingTrack])

    useEffect(() => {
        if (!accessToken) return
        spotifyApi.setAccessToken(accessToken)
    }, [accessToken])


    useEffect(() => {
        if (!search) return setSearchResults([])
        if (!accessToken) return

        let cancel = false
        spotifyApi.searchTracks(search).then(res => {
            if (cancel) return
            setSearchResults(
                res.body.tracks.items.map(track => {
                    const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                        if (image.height < smallest.height) return image
                        return smallest
                    }, track.album.images[0])

                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url
                    }
                })
            )
        })

        return () => cancel = true
    }, [search, accessToken])

    const handleSpeech = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        recognition.start();
        recognition.addEventListener('result', (event) => {
            setSearch(event.results[0][0].transcript);
            recognition.stop();
        });
    };

    return (
        <>
            <div className="header">
                {/* <Link to="/"> */}
                {/* <img
                    className="header__icon"
                    src={Triangle} alt="logo">
                </img> */}
                <div className="header__logo">
                    <Logo />
                    {/* <img className="header__logo--path1" src={Path1} alt="logo"></img> */}
                    {/* <img className="header__logo--path2" src={Path2} alt="logo"></img> */}
                    {/* <img className="header__logo--path3" src={Path3} alt="logo"></img> */}
                    {/* <img className="header__logo--individual" src={Logo} alt="logo"></img> */}
                </div>
                <h1 className="header__text">Lyrify</h1>
                {/* </Link> */}
            </div>
            <div className="dashboard">
                <div className="dashboard__player">
                    <Player
                        accessToken={accessToken}
                        trackUri={playingTrack?.uri}
                    />
                </div>
                <div className="dashboard__search">
                    <input
                        className="dashboard__search--songs"
                        type="text"
                        placeholder="Search Songs/Artists"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        src={microPhoneIcon}
                    />
                    <button onClick={handleSpeech} className="dashboard__search--microphone">
                        <img
                            src={microPhoneIcon}
                            id="image"
                            alt="">
                        </img>
                    </button>
                    <div
                        className="dashboard__search--results">
                        {searchResults.map(track => (<Search track={track} key={track.uri} chooseTrack={chooseTrack} />
                        ))}
                    </div>
                </div>
            </div>
            <div className="dashboard__line"></div>
            <div className="dashboard__line"></div>
            <div>
                {searchResults.length === 0 && (
                    <div className='dashboard__lyrics'>
                        {lyrics}
                    </div>
                )}
            </div>
        </>
    )
}

export default Dashboard;