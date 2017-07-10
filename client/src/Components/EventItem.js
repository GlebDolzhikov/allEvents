import React from 'react';
import PropTypes from 'prop-types';
import {Card, FlatButton} from 'material-ui'

const propTypes = {};

const EventItem = ({event, setModalContent}) => (
    <Card className="event">
        <a href={event.link}>
            <h4>{event.title}</h4>
            <img className="img-responsive" src={event.img} alt=""/>
        </a>
        {event.description && <FlatButton label="Подробнее"
                                          onTouchTap={() => {
                                              if (event.description) setModalContent(event)
                                          }}/>
        }
        <p>{event.date.format('DD MMMM')}</p>
    </Card>
);

EventItem.propTypes = propTypes;
EventItem.defaultProps = {};

export default EventItem;