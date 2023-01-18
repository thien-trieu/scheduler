import React from "react";
/* somewhere near the top */
import axios from "axios";

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
  queryByText,
  queryByAltText,
  
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

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
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

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {

    const { container, debug  } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Delete"));

    expect(getByText(appointment, "Confirm to DELETE this Appointment.")).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Confirm"));
    // console.log(prettyDOM(appointment));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();
    
    await waitForElement(() => getByAltText(appointment, "Add"));
   

    // await waitForElement(() => getByAltText(appointment, "Add"));
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });


  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(container, "Archie Cohen"))

    expect(getByText(container, "Sylvia Palmer")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day => 
      queryByText(day, "Monday")
    );
    expect(getByText(day, "1 spot remaining"))
  });


  it("shows the save error when failing to save an appointment", async() => {
    axios.put.mockRejectedValueOnce();
    const { container } = render(<Application />)
    await waitForElement(() => getByText(container, "Archie Cohen"))

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );

    fireEvent.click(queryByAltText(appointment, "Edit"));
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    await waitForElement(() => getByText(appointment, "Error"));
    expect(getByText(appointment, "Error")).toBeInTheDocument();

    fireEvent.click(queryByAltText(appointment, "Close"));

    expect(getByText(appointment, "Save")).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Cancel"))

    expect(getByText(container, "Archie Cohen")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
        queryByText(day, "Monday")
      );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  
  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find(
      appointment => queryByText(appointment, "Archie Cohen")
    );
    fireEvent.click(queryByAltText(appointment, "Delete"))

    expect(getByText(appointment, "Confirm to DELETE this Appointment.")).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Confirm"))

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Error"));
    expect(getByText(appointment, "Error")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

});
