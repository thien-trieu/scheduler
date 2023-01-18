import axios from "axios";
import { useState, useEffect } from "react";

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

  const updateSpots = (state, appointments) => {
    // Get the day
    const dayObj = state.days.find((d) => d.name === state.day);

    // count the null appointments
    let spots = 0
    for (const id of dayObj.appointments){
      const appointment = appointments[id] 
        if (!appointment.interview){
          spots ++
        }
      }
    

    const day = { ...dayObj, spots}
    const days = state.days.map(d => d.name === state.day ? day : d)

    return days
  }

  const bookInterview = (id, interview) => {
    // from form component onSave, get sppointment id + interview object { student: name, interviewer: id}
    // update the database for this appointment id
    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then((response) => {
        console.log("Response Status: ", response.status);
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

        // update state.days with updated number of spots left
        // const days2= updateSpots(state);

        const days = updateSpots(state, appointments);

        // set the state with new appointments and days data
        setState({ ...state, appointments, days });
      })
  
  };

  const cancelInterview = (id) => {
    console.log("Deleting interview appointment....");

    return axios.delete(`/api/appointments/${id}`).then((response) => {
      console.log("Response Status: ", response.status);
      // create appointment object with interview null
      const appointment = {
        ...state.appointments[id],
        interview: null,
      };
      // create appointments object with appointment details
      const appointments = {
        ...state.appointments,
        [id]: appointment,
      };

      // update state.days with updated number of spots left
      const days = updateSpots(state, appointments);

      // set the state with new appointments and days data
      setState({ ...state, appointments, days });
      console.log("Delete Appointment Completed");
    });
  };

  return { state, setDay, bookInterview, cancelInterview };
};

export default useApplicationData;
