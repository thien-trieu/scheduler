import React from "react";
import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerList.scss"

export default function InterviewerList(props) {
  const { interviewers, value, onChange } = props;

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers.map(x => (
          <InterviewerListItem 
            key={x.id}
            name={x.name}
            avatar={x.avatar}
            setInterviewer={() => onChange(x.id)}
            selected={x.id === value}
          />
        ))}
      </ul>
    </section>
  );
};