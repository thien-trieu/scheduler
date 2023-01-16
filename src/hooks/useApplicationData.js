import axios from "axios";
import React, { useState, useEffect } from "react";

const useApplicationData = () => {
    // storing all states in one object.
    const [state, setState] = useState({
      day: "Monday",
      days: [],
      appointments: {},
      interviewers: {},
    });
  
    // update day in state
    const setDay = (day) => setState({ ...state, day });
  
    // get all the data from API
    useEffect(() => {
      Promise.all([
        axios.get("http://localhost:8001/api/days"),
        axios.get("http://localhost:8001/api/appointments"),
        axios.get("http://localhost:8001/api/interviewers"),
      ])
        .then((all) => {
          const days = all[0].data;
          const appointments = all[1].data;
          const interviewers = all[2].data;
  
          // update state object with days and appointments from api
          setState((prev) => ({ ...prev, days, appointments, interviewers }));
        })
        .catch((err) => console.log(err));
    }, []);
  
    const bookInterview = (id, interview) => {
      // from form component onSave, get sppointment id + interview object { student: name, interviewer: id}
  
      // update the database for this appointment id
      return axios
        .put(`/api/appointments/${id}`, { interview })
        .then((response) => {
          console.log("Response Status: ", response.status);
        })
        .then(() => {
          // create new appointment object with interview details
          const appointment = {
            ...state.appointments[id],
            interview: { ...interview },
          };
  
          // create new appointments object with appointment details
          const appointments = {
            ...state.appointments,
            [id]: appointment,
          };
  
          // set the state with new appointments object
          setState({ ...state, appointments });
        });
    };
  
    const cancelInterview = (id) => {
      console.log('Deleting interview appointment....')
  
      return axios
        .delete(`/api/appointments/${id}`)
        .then((response) => {
          console.log("Response Status: ", response.status);
        })
        .then(() => {
          // create appointment object with interview null
          const appointment = {
            ...state.appointments[id],
            interview: null ,
          };
          // create appointments object with appointment details
          const appointments = {
            ...state.appointments,
            [id]: appointment,
          };
          // set the state with appointments object
          setState({ ...state, appointments });
          console.log('Delete Appointment Completed')
        })
     
    };
  
    return { state, setDay, bookInterview, cancelInterview }
}

export default useApplicationData;