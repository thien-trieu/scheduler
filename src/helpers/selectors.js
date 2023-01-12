export function getAppointmentsForDay(state, day) {
  //... returns an array of appointments for that day
  const result = [];

  // if no days data
  if (!state.days.length) {
    return result;
  }
  // filter through state for a specific day
  const getDay = state.days.filter(x => x.name === day);

  // if no data for a specific day
  if (!getDay[0]) {
    return result;
  }

  // get the appointments IDs for that day
  const appointmentIdsForDay = getDay[0].appointments;

  // get details for all appointments
  const appointments = state.appointments;

  // get appointment details for the specific day if id matches
  appointmentIdsForDay.forEach(id => {
    if (id === appointments[id].id) {
      result.push(appointments[id]);
    }
  });

  return result;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const interviewerId = interview.interviewer;
  const interviewers = state.interviewers;
  // loop through all the the interviewer to match id with interview ID
  for (const id in interviewers) {
    if (interviewerId === interviewers[id].id) {
      // when match data is found create new object 
      const interviewDetails = {
        student: interview.student,
        interviewer: interviewers[id]
      };
      // return the new object with student name and interviewer's data
      return interviewDetails;
    }
  }
}

export function getInterviewersForDay(state, day) {
  //... returns an array of appointments for that day
  const result = [];

  // // if no interviewers in days data
  if (!state.days.length) {
    return result;
  }
  // filter through array for a specific day details
  const getDay = state.days.filter(x => x.name === day);

  // if no data/object for a specific day
  if (!getDay[0]) {
    return result;
  }

  // get the interviewers IDs for that day
  const interviewerIdsForDay = getDay[0].interviewers;

  // get details for all interviewers
  const interviewers = state.interviewers;

  // get interviewers details for the specific day if id matches
  interviewerIdsForDay.forEach(id => {
    if (id === interviewers[id].id) {
      result.push(interviewers[id]);
    }
  });

  return result;
}