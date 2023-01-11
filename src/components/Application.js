import React, { useState, useEffect } from "react";
import DayList from "./DayList.js";
import Appointment from "./Appointment/index.js";
import axios from "axios";
import { getAppointmentsForDay } from "helpers/selectors.js";

import "components/Application.scss";

export default function Application(props) {
  
  // day/days states combined into an object
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  // update day in state
  const setDay = day => setState({ ...state, day });

  // get daily appointments for days from state object
  const dailyAppointments = getAppointmentsForDay(state, state.day)

  // get all the data from API
  useEffect(() => {
    Promise.all([
      axios.get('http://localhost:8001/api/days'),
      axios.get('http://localhost:8001/api/appointments'),
      axios.get('http://localhost:8001/api/interviewers')
    ]).then((all) => {
 
      const days = all[0].data
      const appointments = all[1].data

      // update state object with days and appointments from api
      setState(prev => ({...prev, days, appointments}))
    }).catch(err => console.log(err))

  }, []);

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
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {dailyAppointments.map((appointment) => {
          return (
            <Appointment key={appointment.id}  {...appointment} />
          );
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
