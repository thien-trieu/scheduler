import React from "react";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it.only("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    // 1. Render the Application.
    const { container, debug } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed. after GET request
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Add" button on the first empty appointment.
    // find the appointment articles with all appointments using the data-testId appointments (index)
    const appointments = getAllByTestId(container, "appointment");

    // get the first appointment
    const appointment = appointments[0];
    // click the add button
    fireEvent.click(getByAltText(appointment, "Add"));
    // Enter a student name
    fireEvent.change(getByPlaceholderText(appointment, /Enter Student Name/i), {
      target: { value: "Lydia Miller-Jones" },
    });
    // click on an interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    // save the new interview appointment and do a PUT request
    fireEvent.click(getByText(appointment, "Save"));

    // Access the debug function returned by the render function. After the event is fired to simulate the click of the "Save" button, use the debug() function to output the current state of the DOM.
    // debug()

    // check Saving status is showing after clicking on Save
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    // 2 different ways to wait for Saving Status to complete and Show the Student name. mode changes from SAVING to SHOW.
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
    // await waitForElement(() => queryByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
    console.log(prettyDOM(day));
    // console.log(prettyDOM(appointment));
  });
});
