import React, { useState } from 'react'
import dayjs from 'dayjs'

function DatePicker() {

    const createAvailableMap = () => {
        const availableMap = new Map();
        
        // Takes in (MM, YYYY, [array of DD]) to add which dates are available 
        const addDates = (month, year, dates) => {
            // Key is in MMYYYY
            const key = `${String(month).padStart(2, "0")}${year}`;
        
            // Add or update the key in the Map
            const paddedDates = dates.map((date) => String(date).padStart(2, "0"));
            availableMap.set(key, paddedDates);
        };
        
        // Check if date is available (when rendering the date table)
        const isAvailable = (month, year, date) => {
            const key = `${String(month).padStart(2, "0")}${year}`;
            const dates = availableMap.get(key);
            return dates ? dates.includes(String(date).padStart(2, "0")) : false;
        };
        
    return {addDates, isAvailable };
    };

    const {addDates, isAvailable } = createAvailableMap();

    // Add available dates
    addDates(1, 2025, [1, 15, 20]);
    addDates(2, 2025, [10, 14, 12]);

    // Choose the first available date to display
    const firstChosenDate = (startDate) => {
        let currentDate = startDate;

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
        // Get first day of the month
        const firstDay = currentDate.startOf("month");
        const dayOfWeek = (firstDay.day() + 6) % 7; 
        const daysInMonth = firstDay.daysInMonth();
      
        // 2D matrix where rows are dates and columns reprsent days mon to fri
        const matrix = []; 
        let week = Array(dayOfWeek).fill(null);
      
        // Fill in the dates
        for (let day = 1; day <= daysInMonth; day++) {
          week.push(day);
      
          if (week.length === 7 || day === daysInMonth) {
            matrix.push(week);
            week = []; 
          }
        }
      
        return matrix;
      };

      // To switch between months
    const previousMonth = () => {
        setCurrentDate(currentDate.subtract(1, "month"));
    };
    const nextMonth = () => {
        setCurrentDate(currentDate.add(1, "month"));
    };

    const toggleDateShown = () => {
        setDateShown((prevState) => !prevState)
    }

    // If user clicks on a date, chosenDate will now hold the page's date
      const handleDateClick = (date) => {
        if (isAvailable(currentDate.month() + 1, currentDate.year(), date)) {
          setChosenDate(currentDate.date(date));
        } else {
            alert("Invalid Date Chosen!")
        }
      };

    // To display the date picker
    const renderDateShown = () => {

        const dates = monthArray(currentDate);

        if(!isDateShown) return null;
        return (

            // Date Picker Dropdown Display
            <div className="bg-gray-800 rounded-md pb-3" >

                {/* Date Picker Header - back arrow, month and year heading, next arrow */}
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

                {/* Date Picker Table - table header are the days and table body are the date numbers */}
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
        // Main Date Picker button
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
