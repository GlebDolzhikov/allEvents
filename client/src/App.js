import React, {Component} from "react";
import "./App.css";
import moment from "moment";
import {AppBar, DatePicker} from "material-ui";

import EventsWrapper from './Components/EventsWrapper';
import ModalView from './Components/ModalView';

class App extends Component {
    state = {
        eventsToShow: [],
        filters: {
            type: [
                'run',
                'triathlon',
                'swim',
                'bike'
            ]
        },
        openModal: false
    };

    handleStartDateSelect = (param, date) => {
        this.setState((prevState) => {
            return {
                ...prevState, filters: {
                    ...prevState.filters,
                    minDate: date
                }
            }
        });
    };
    handleEndDateSelect = (param, date) => {
        this.setState((prevState) => {
            return {
                ...prevState, filters: {
                    ...prevState.filters,
                    maxDate: date
                }
            }
        });
    };

    handleOpen = () => {
        this.setState({openModal: true});
    };

    handleClose = () => {
        this.setState({openModal: false});
    };

    setModalContent = (description) => {
        this.setState({modalContent: description});
        this.handleOpen();
    };


    render() {
        const filtredEvents = this.state.eventsToShow.filter((event) => {
            let eventPassMinDate = true,
                eventPassMaxDate = true;
            if (this.state.filters.minDate) {
                eventPassMinDate = event.date.isAfter(this.state.filters.minDate)
            }
            if (this.state.filters.maxDate) {
                eventPassMaxDate = event.date.isBefore(this.state.filters.maxDate)
            }
            return eventPassMinDate && eventPassMaxDate;
        });

        if (this.state.eventsToShow.length === 0) {
            return <div className="loader"> Loading... </div>
        }
        return (
            <div>
                <AppBar title="All events"
                        iconElementLeft={<div></div>}
                >
                    <DatePicker
                        floatingLabelText="Cобытия начиная с:"
                        onChange={this.handleStartDateSelect}
                        maxDate={this.state.filters.maxDate}
                    />

                    <DatePicker
                        floatingLabelText="Cобытия не позже чем:"
                        onChange={this.handleEndDateSelect}
                        minDate={this.state.filters.minDate}
                    />
                </AppBar>
                <EventsWrapper eventsToShow={filtredEvents} setModalContent={this.setModalContent}/>
                <ModalView modalContent={this.state.modalContent} openModal={this.state.openModal} handleClose={this.handleClose}/>
            </div>
        );
    }

    componentDidMount() {
        fetch('https://still-caverns-40972.herokuapp.com/allEvents').then((response) => { // http://localhost:5000/allEvents pass me to use local server
                return response.json()
            }
        ).then((json) => {
            json = json.map(event => {
                event.date = moment(event.date).set('year', new Date().getFullYear());
                return event;
            });
            json = json.sort((a, b) => {
                return new Date(a.date.toDate()) - new Date(b.date.toDate());
            });
            this.setState({
                eventsToShow: json
            })
        })
    }
}

export default App;
