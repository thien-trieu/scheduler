import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import useVisualMode from "hooks/useVisualMode";

import "./styles.scss";


// Main container for appointment 
export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE ="CREATE"
  const SAVING ="SAVING"
  const CONFIRM = "CONFIRM"
  const DELETING ="DELETING"

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    
    // Saving status until res from bookInterview returns
    transition(SAVING)
    console.log('Saving....')

    // Form onSave will create a new interview object and call bookInterview
    const id = props.id
    const interview = {
      student: name,
      interviewer
    };

    // Pass the interview data to bookInterview to update appointment API
    props.bookInterview(id, interview)
    .then(() => transition(SHOW)) // After bookInterview PUT request completes, it will transition to SHOW mode
    .then(() => console.log('Completed')) 

  }

  // delete an appointment
  const onDelete = () => {
    transition(CONFIRM)
  }

  // cancel delete appointment
  const onCancel = () => {
    transition(SHOW)
  }

  // confirm delete appoinment
  const onConfirm = () => {
    // Deleting status will appear while appointment gets deleted and state gets updated
    transition(DELETING)
    const id = props.id
    const interview = null
    // Delete request sent to Appointment API
    props.cancelInterview(id, interview).then(()=> transition(EMPTY)) // After delete is complete, appointment will be EMPTY
  }


  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={()=>{}}
          onDelete={onDelete}
        />
      )}
      {mode === CONFIRM && <Confirm onConfirm={onConfirm} onCancel={onCancel} message="Confirm to DELETE this Appointment."/>}
      {mode === DELETING && <Status message="Deleting"/>}
      {mode === CREATE && <Form interviewers={props.interviewers} onSave={save} onCancel={()=>{back()}}/>}
      {mode === SAVING && <Status message="Saving"/>}
    </article>
  );
}