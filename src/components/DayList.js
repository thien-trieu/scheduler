import React from "react";
import DayListItem from "components/DayListItem";

export default function DayList(props) {
  const {days, day, setDay} = props;

  return (
  <ul>{days.map(day => (
    <DayListItem
    name={day.name}
    spots={day.spots}
    selected={day.name === props.day}
    setDay={setDay}
    />
  ))}
  </ul>
);
};