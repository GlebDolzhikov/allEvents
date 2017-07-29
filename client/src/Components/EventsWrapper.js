import React from 'react';
import PropTypes from 'prop-types';
import EventItem from './EventItem';

const propTypes = {
    eventsToShow: PropTypes.arrayOf(PropTypes.object.isRequired),
    setModalContent: PropTypes.func.isRequired,
};

const EventsWrapper = ({eventsToShow, setModalContent}) => (
        <div className="masonry">
            {eventsToShow.map((event, i) => (
                <EventItem event={event} key={i} setModalContent={setModalContent}/>
            ))}
        </div>
);

EventsWrapper.propTypes = propTypes;
EventsWrapper.defaultProps = {};

export default EventsWrapper;
