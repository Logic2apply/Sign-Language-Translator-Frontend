import React, { useRef, useState, useCallback, useEffect } from 'react'
import Webcam from "react-webcam";

export default function Training() {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [webstart, setwebstart] = useState(false)
    const [letter, setletter] = useState("")
    const [detection, setdetection] = useState(false)

    // create a capture function
    const capture = useCallback(async () => {
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);
            const imageData = imageSrc.split(',')[1];
            console.log(`letter: ${letter}`);

            let response = await fetch("http://127.0.0.1:5000/train", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ imageData, letter })
            })
            let resJson = await response.json()
            console.log(resJson)
            if (resJson["detection"]===true) {
                setdetection(true)
            } else {
                setdetection(false)
            }

        } catch (error) {
            console.log(error)
        }
    }, [webcamRef, letter]);

    useEffect(() => {
        let intervalID = setInterval(() => {
            console.log("Inside Interval", webstart)
            if (webstart) {
                capture()
            } else{
                setdetection(false)
            }
        }, 16);
        return () => clearInterval(intervalID)
    })

    const startwebcam = () => {
        setwebstart(true)
    };

    const stopwebcam = () => {
        let stream = webcamRef.current.stream;
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
        setwebstart(false)
        setdetection(false)
    };

    const changeLetter = (e) => {
        setletter(e.target.value)
        if (e.target.value===""){
            setwebstart(false)
        }
    };

    return (
        <div className='container my-4'>
            <h1>Train Model {letter!==""?" with word "+letter:""}</h1>

            <div className="card my-5">
                {/* <img src="..." className="card-img-top" alt="..."/> */}
                <div className="card-body">
                    <h5 className="card-title">Web View <span className={`badge bg-${detection ? "success" : "danger"}`}>{detection ? "Detecting Hands" : "Not Detecting"}</span></h5>
                    {webstart && <Webcam height={400} width={400} className="card-img-top" ref={webcamRef} />}
                    <form action="/" method="get">
                        <div className="mb-3">
                            {/* <label for="word" className="form-label">Email address</label> */}
                            <input type="text" className="form-control" id="word" placeholder="Enter letter or word to train" onChange={changeLetter}/>
                        </div>
                    </form>
                    {letter !== "" ?  
                    <p className="card-text">

                        {webstart ? <button className="btn btn-danger mx-2" onClick={stopwebcam}>Stop Training</button> :
                            <button className="btn btn-dark mx-2" onClick={startwebcam}>Start Training</button>}
                        {/* <button className="btn btn-success mx-2" onClick={capture}>Capture</button> */}
                    </p>
                    : ""}
                </div>
            </div>
        </div>
    )
}
