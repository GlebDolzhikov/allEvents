import React from "react";
import PropTypes from "prop-types";
import { DatePicker, FlatButton, AppBar,Checkbox } from "material-ui";


const Nav = ({handleStartDateSelect, handleEndDateSelect, maxDate, minDate, toggleCalendar, createAboutModal, calendarView}) => (
       <AppBar className="nav"
               iconElementLeft={<span>
            <FlatButton label="All Events" onClick={createAboutModal}></FlatButton>
            {calendarView ?
                 <FlatButton label="Плитка" onClick={toggleCalendar}></FlatButton> :
                 <FlatButton label="Календарь" onClick={toggleCalendar}></FlatButton>
            }
       </span>}
           >
           <DatePicker
               floatingLabelText="Cобытия начиная с:"
               onChange={handleStartDateSelect}
               maxDate={maxDate}
               className="dataPick"
               />

           <DatePicker
               floatingLabelText="Cобытия не позже чем:"
               onChange={handleEndDateSelect}
               minDate={minDate}
               className="dataPick"
               />

       </AppBar>
);

export default Nav;