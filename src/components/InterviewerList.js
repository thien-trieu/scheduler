import React from "react";
import InterviewerListItem from "components/InterviewerListItem";
import "components/InterviewerList.scss"

export default function InterviewerList(props) {
  const { interviewers, interviewer, setInterviewer } = props;

  return (
    <section className="interviewers" interviewer={interviewer}>
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {interviewers.map(x => (
          <InterviewerListItem 
            key={x.id}
            id={x.id}
            name={x.name}
            avatar={x.avatar}
            setInterviewer={setInterviewer}
            selected={x.id === interviewer}
          />
        ))}
      </ul>
    </section>
  );
};