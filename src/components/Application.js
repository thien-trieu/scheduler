import React, { useState, useEffect } from "react";
import DayList from "./DayList.js";
import Appointment from "./Appointment/index.js";
import axios from "axios";
import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors.js";

import "components/Application.scss";

export default function Application(props) {
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

  // get daily appointments for day from state object
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  // get daily interviewers for day from state object
  const dailyInterviewers = getInterviewersForDay(state, state.day);

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

  const cancelInterview = (id, interview) => {
    console.log('Deleting interview appointment....')

    return axios
      .delete(`/api/appointments/${id}`, { interview })
      .then((response) => {
        console.log("Response Status: ", response.status);
      })
      .then(() => {
        // create appointment object with interview null
        const appointment = {
          ...state.appointments[id],
          interview: interview ,
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
      .catch(err => console.log(err));
  };

  // passingg all props/data for each appointment to the the component
  const appointmentComponent = dailyAppointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentComponent}
        <Appointment key="last" time="5pm" bookInterview={bookInterview} />
      </section>
    </main>
  );
}
