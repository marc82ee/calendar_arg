Main design of the calendar
  - Very simple HTML page, that calls JQuery function for the initial render on document.ready
  - The main code is inside the calendar_arg_jquery.js that renders all the calendar info, months, days,...
  - Simple .css file to style the main components of the calendar: month table, days rows, days cells ...


 I tried to keep it simple, so I think the JS code is pretty straight-forward and focuses on the essential functionality
 Main flow and JS parts:
    - Initial load and render of the calendar. We load 1st  the info about national holidays through an AJAx call to a webservice
    - We need to wait for the call to be finished, hence it's done in a sync way. Otherwise initial render of the calendar, might miss this info
    - The rendering has 2 main parts. Render the header with the month of info and render the main view that contains all the days inside the month
    - When moving through the months, current month info is updated and re-rendering is needed 
    - Additional date helpers are used to make sure that the date's info is accurate
    - Simple object nationalDay is used to store the info relative to argentinian national holidays