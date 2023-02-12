import './Dashboard.scss';
import { useRef, useState, useEffect } from 'react';
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import SpotifyWebApi from 'spotify-web-api-node';
import axios from 'axios';
// import { Form } from 'react-bootstrap';
// import { Link } from 'react-router-dom';
import useAuth from '../../components/Auth/useAuth';
import Search from '../../components/Search/Search';
import Player from '../../components/Player/Player';
import Triangle from '../../assets/icons/triangle.svg';
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

    // if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    //     return (
    //         <div className="">Your Browser Does Not Support Speech Recognition.</div>
    //     );
    // }

    // const handleListing = () => {
    //     setIsListening(true);
    //     microphoneRef.current.classList.add("listening");
    //     SpeechRecognition.startListening({
    //         continuous: true,
    //     });
    // };
    // const stopHandle = () => {
    //     setIsListening(false);
    //     microphoneRef.current.classList.remove("listening");
    //     SpeechRecognition.stopListening();
    // };
    // const handleReset = () => {
    //     stopHandle();
    //     resetTranscript();
    // };

    return (
        <>
            {/* <div ref={microphoneRef} onClick={handleListing}>
                <img src={microPhoneIcon} />
            </div>
            <div>
                {isListening ? "Listening....." : "Click to start Listening"}
            </div>
            {isListening && (
                <button onClick={stopHandle}></button>
            )} */}
            <div className="header">
                {/* <Link> */}
                <img className="header__icon" src={Triangle} alt="logo"></img>
                <h1 className="header__text">Lyrify</h1>
                {/* </Link> */}
            </div>
            <div className="dashboard">
                <div className="dashboard__player">
                    <Player accessToken={accessToken} trackUri={playingTrack?.uri} />
                </div>
                <div className="dashboard__search">
                    <form>
                        <input className="dashboard__search--songs" type="search" placeholder="Search Songs/Artists" value={search} onChange={(e) => setSearch(e.target.value)} />
                        <img src={microPhoneIcon} className="dashboard__search--microphone" alt=""></img>
                    </form>
                    <div>
                        {/* <Form.Control className="dashboard__search--songs" type="search" placeholder="Search Songs/Artists" value={search} onChange={e => setSearch(e.target.value)}></Form.Control> */}
                    </div>
                    <div className="dashboard__search--results">{searchResults.map(track => (<Search track={track} key={track.uri} chooseTrack={chooseTrack} />
                    ))}
                        {/* {transcript && (
                        <div>
                            <div>{transcript}</div>
                            <button onClick={handleReset}>Reset</button>
                        </div>
                    )} */}
                    </div>
                </div>
            </div>
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