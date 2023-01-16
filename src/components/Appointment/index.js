import React from "react";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import useVisualMode from "hooks/useVisualMode";

import "./styles.scss";


// Main container for appointment 
export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE ="CREATE"


  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  const save = (name, interviewer) => {
    // Form onSave will create a new interview object and call bookInterview
    const id = props.id
    const interview = {
      student: name,
      interviewer
    };

    props.bookInterview(id, interview)
    // After booking interview, it will transition to SHOW mode
    transition(SHOW)

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
          onDelete={()=>{}}
        />
      )}
      {mode === CREATE && <Form interviewers={props.interviewers} onSave={save} onCancel={()=>{back()}}/>}
    </article>
  );
}