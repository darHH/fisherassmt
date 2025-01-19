import React, { useState } from 'react'
import dayjs from 'dayjs'

function DatePicker() {

    const createAvailableMap = () => {
        const availableMap = new Map();
        
        // takes in (MM, YYYY, [array of DD]) to add which dates are available 
        const addDates = (month, year, dates) => {
            // key is in MMYYYY
            const key = `${String(month).padStart(2, "0")}${year}`;
        
            // Add or update the key in the Map
            const paddedDates = dates.map((date) => String(date).padStart(2, "0"));
            availableMap.set(key, paddedDates);
        };
        
        // check if date is available (when rendering the date table)
        const isAvailable = (month, year, date) => {
            const key = `${String(month).padStart(2, "0")}${year}`;
            const dates = availableMap.get(key);
            return dates ? dates.includes(String(date).padStart(2, "0")) : false;
        };
        
    return {addDates, isAvailable };
    };

    const {addDates, isAvailable } = createAvailableMap();

    // add available dates
    addDates(1, 2025, [1, 15, 20]);
    addDates(2, 2025, [10, 14, 12]);

      // Helper to find the first available date
    const firstChosenDate = (startDate) => {
        let currentDate = startDate;

        // Iterate until a availableed date is found
        while (
        !isAvailable(
            currentDate.month() + 1,
            currentDate.year(),
            currentDate.date()
        )
        ) {
        currentDate = currentDate.add(1, "day");
        }

        return currentDate;
    };

    const [isDateShown, setDateShown] = useState(false);

    const [currentDate, setCurrentDate] = useState(dayjs());

    const [chosenDate, setChosenDate] = useState(firstChosenDate(dayjs()));

    const monthArray = (currentDate) => {
        // Extract month and year from the currentDate object
        const month = currentDate.month(); // Month is 0-based in Day.js
        const year = currentDate.year();
      
        // Get the 1st day of the month
        const firstDay = currentDate.startOf("month");
        const dayOfWeek = (firstDay.day() + 6) % 7; // Adjust to make Monday = 0
        const daysInMonth = firstDay.daysInMonth(); // Total number of days in the month
      
        const matrix = []; // Array to hold the weeks
        let week = Array(dayOfWeek).fill(null); // Start the first week with empty slots
      
        // Fill in the dates
        for (let day = 1; day <= daysInMonth; day++) {
          week.push(day);
      
          // If the week is complete (7 days) or it's the last day, add it to the matrix
          if (week.length === 7 || day === daysInMonth) {
            matrix.push(week);
            week = []; // Start a new week
          }
        }
      
        return matrix;
      };

      // Handlers to switch months
    const previousMonth = () => {
        setCurrentDate(currentDate.subtract(1, "month"));
    };

    const nextMonth = () => {
        setCurrentDate(currentDate.add(1, "month"));
    };

    const toggleDateShown = () => {
        setDateShown((prevState) => !prevState)
    }

      // Handle date selection
      const handleDateClick = (date) => {
        // Check if the date is availableed
        if (isAvailable(currentDate.month() + 1, currentDate.year(), date)) {
          // Update the currentDate state with the clicked date
          setChosenDate(currentDate.date(date));
        } else {
            alert("Invalid Date Chosen!")
        }
      };

    const renderDateShown = () => {

        const dates = monthArray(currentDate);

        if(!isDateShown) return null;
        return (
            <div className="bg-gray-800 h-70" >
                <div className="flex items-center justify-between p-4">
                    <button className="text-white" onClick={previousMonth}>
                    <span className="">&larr;</span>
                    </button>

                    <div className="text-sm font-bold text-white ">
                    {currentDate.format("MMMM YYYY")}
                    </div> 

                    <button className="text-white" onClick={nextMonth}>
                    <span className="">&rarr;</span>
                    </button>
                </div>

                <div className="flex justify-center items-center">
                    <table className="table-auto">
                        <thead>
                        <tr>
                            {["M", "T", "W", "T", "F", "S", "S"].map((day) => (
                            <th
                                key={day}
                                className="px-3 text-white font-normal"
                            >
                                {day}
                            </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody className="text-center">
                        {dates.map((week, weekIndex) => (
                            <tr key={weekIndex}>
                            {week.map((date, dateIndex) => (
                                <td
                                key={dateIndex}
                                className={"px-1.5 py-1"}
                                >
                                {date ? (
                                    <button
                                    className={`text-sm ${
                                        chosenDate.date() === date && chosenDate.month() + 1 === currentDate.month() + 1 && chosenDate.year() === currentDate.year()
                                          ? "h-8 w-8 text-black rounded-full border border-green-400 bg-green-300"
                                          : isAvailable(currentDate.month() + 1, currentDate.year(), date)
                                          ? "h-8 w-8 text-white rounded-full border border-green-300"
                                          : "text-gray-600"
                                      }`}
                                    onClick={() => handleDateClick(date)}
                                    >
                                    {String(date).padStart(2, "0")}
                                    </button>
                                ) : (
                                    ""
                                )}
                                </td>
                            ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }

    return (
        <div>
            <button 
                className="bg-transparent text-left text-white font-thin py-2 px-2 border-[0.5px] border-white rounded w-72"
                onClick = {toggleDateShown}
                
            >
                {chosenDate.format("DD MMM YYYY")}
            </button>
            {renderDateShown()}
        </div>
    )
}

export default DatePicker
