import React from 'react';
import PropTypes from 'prop-types';
import EventItem from './EventItem';

const propTypes = {};

const EventsWrapper = ({eventsToShow, setModalContent}) => (
    <div className="wrapper">
        <div className="masonry">
            {eventsToShow.map((event, i) => (
                <EventItem event={event} key={i} setModalContent={setModalContent}/>
            ))}
        </div>
    </div>
);

EventsWrapper.propTypes = propTypes;
EventsWrapper.defaultProps = {};

export default EventsWrapper;