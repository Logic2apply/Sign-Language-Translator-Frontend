import React, { useRef, useState, useCallback, useEffect } from 'react'
import Webcam from "react-webcam";

export default function Home() {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [webstart, setwebstart] = useState(false)
    const [letterDetected, setletterDetected] = useState("")
    const [detection, setdetection] = useState(false)

    // create a capture function
    const capture = useCallback(async () => {
        try {
            const imageSrc = webcamRef.current.getScreenshot();
            setImgSrc(imageSrc);
            const imageData = imageSrc.split(',')[1];

            let response = await fetch("http://127.0.0.1:5000/classify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ imageData })
            })
            let resJson = await response.json()

            // Set Letter
            if (resJson["Letter"] !== "") {
                setletterDetected(resJson["Letter"])
            } else {
                setletterDetected("")
            }
            if (resJson["detection"] === true) {
                setdetection(true)
            } else {
                setdetection(false)
            }
            console.log(resJson)

        } catch (error) {
            console.log(error)
        }
    }, [webcamRef]);

    useEffect(() => {
        let intervalID = setInterval(() => {
            console.log("Inside Interval", webstart)
            if (webstart) {
                capture()
            } else {
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
    };

    return (
        <div className='container my-4'>
            <h1>Welcome to Sign Language Translator</h1>

            <div className="card my-5">
                {/* <img src="..." className="card-img-top" alt="..."/> */}
                <div className="card-body">
                    <h5 className="card-title">Web View <span className={`badge bg-${detection ? "success" : "danger"}`}>{detection ? "Detecting Hands" : "Not Detecting"}</span></h5>
                    {webstart && <Webcam height={400} width={400} className="card-img-top" ref={webcamRef} />}
                    {letterDetected !== "" ? <h2 className="card-text">Letter Detected: {letterDetected}</h2> : ""}
                    <p className="card-text">

                        {webstart ? <button className="btn btn-danger mx-2" onClick={stopwebcam}>Stop</button> :
                            <button className="btn btn-dark mx-2" onClick={startwebcam}>Start</button>}
                    </p>
                </div>
            </div>
        </div>
    )
}
