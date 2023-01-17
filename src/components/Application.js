import React from "react";
import DayList from "./DayList.js";
import Appointment from "./Appointment/index.js";
import useApplicationData from "hooks/useApplicationData.js";

import {
  getAppointmentsForDay,
  getInterview,
  getInterviewersForDay,
} from "helpers/selectors.js";

import "components/Application.scss";

export default function Application(props) {

  const { state, setDay, bookInterview, cancelInterview } = useApplicationData()

  // get daily appointments for day from state object
  const dailyAppointments = getAppointmentsForDay(state, state.day);

  // get daily interviewers for day from state object
  const dailyInterviewers = getInterviewersForDay(state, state.day);

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
