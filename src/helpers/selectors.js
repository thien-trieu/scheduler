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

  // get  details for all appointments
  const appointments = state.appointments;

  // get appointment details for the specific day if id matches
  appointmentIdsForDay.forEach(id => {
    if (id === appointments[id].id) {
      result.push(appointments[id]);
    }
  });

  return result;
}