import React, { useContext, useEffect, useState } from 'react';
import axios from "axios";
import UserContext from "../../context/UserContext";
import { useHistory } from "react-router-dom";

export default function ProfilePage(props) {
    const { userId } = useContext(UserContext);
    const [tripArray, setTripArray] = useState([]);
    const [profileEmail, setProfileEmail] = useState("");
    const history = useHistory();

    async function getUserData() {
        const userData = await axios.get(`user/profile/${userId}`);
        setProfileEmail(userData.data.email)
    }

    function getDateRange(x) {
        let result = x.map(date => date.name)
        return (`${result[0]} - ${result[result.length - 1]}`)
    }

    async function getTripData() {
        const userTrips = await axios.get(`api/${userId}`)
        setTripArray(userTrips.data);
        console.log(userTrips.data)
    }

    async function removeTrip(e, id) {
        e.preventDefault();

        try {
            await axios.delete(`/api/${id}`);
            getTripData();
        } catch (err) {
            console.error(err)
        }
    }

    async function updateTrip(e, id) {
        e.preventDefault();
        props.setUpdateId(id);
        history.push("/update");
    }

    function btnClick(e) {
        e.preventDefault();
        history.push("/budget")
    }

    useEffect(() => {
        getUserData();
        getTripData();
    }, []);

    return (
        <div className="bgThis p-5">
            <div style={{ textAlign: "center" }}>
                <h1>Welcome, {profileEmail}</h1>
            </div>
            <br /><br />
            {tripArray.length === 0 &&

                <div style={{ marginTop: "150px", textAlign: "center" }}>
                    <h3>No Trips saved to your profile</h3>
                    <button class="btn btn-block btn-success mt-2 p-2 shadow " onClick={(e) => btnClick(e)}>Build a new trip!</button>
                </div>
            }
            {
                tripArray.length !== 0 && tripArray.map((trip) => (
                    <div>
                        <div className="container shadow bg-light p-5 mt-3 col-lg-10" style={{ width: "500px", marginTop: "50px" }}>
                            <h3>Your trip to: {trip.destination}</h3>
                            <p>Trip Name: {trip.tripName}</p>
                            <p>Budget: {trip.budget}</p>
                            <p>Start Location: {trip.startLocation}</p>
                            <p>Dates: {getDateRange(trip.dates)}</p>
                            <button class="btn btn-block btn-danger mt-2 p-2 shadow" onClick={(e) => removeTrip(e, trip._id)}>Remove Trip</button>
                            <button class="btn btn-block btn-success mt-2 p-2 shadow" onClick={(e) => updateTrip(e, trip._id)}>Update Trip</button>
                        </div>
                        <br />
                    </div>
                ))
            }
        </div >
    )
}
