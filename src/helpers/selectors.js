export function getAppointmentsForDay(state, day) {

  const result = [];
  if (!state.days.length) {
    return result;
  }

  const selectedDay = state.days.filter(
    stateDay => stateDay.name === day)[0];
  if (!selectedDay) {
    return result;
  }

  selectedDay.appointments.forEach(appointment => {
   
    if (appointment === state.appointments[appointment].id) {
      result.push(state.appointments[appointment]);
    }
 
  });

  return result;
}
