import React, {Component} from "react";
import "./App.css";
import moment from "moment";
import {AppBar, FlatButton} from "material-ui";

import EventsWrapper from './Components/EventsWrapper';
import ModalView from './Components/ModalView';
import fetchGithub from './helpers/fetchGithub'
import Calendar from './view/Calendar'
import Nav from './view/Nav'

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
        openModal: false,
        calendarView: false
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

    createAboutModal = () => {
        fetchGithub().then(contributors =>{
            this.setModalContent({
                title: "О проекте",
                description:`
            All events - это не коммерческий проект с открытым кодом.
            Главная цель которого собрать в единный календарь все старты по бегу велоспорту и плаванью.
            `,
                img:"opensource.png",
                contributors
            })
        });
    };

    toggleCalendar = () => {
        this.setState({
            calendarView: !this.state.calendarView
        })
    }


    render = () => {
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
                <Nav
                    handleStartDateSelect={this.handleStartDateSelect}
                    handleEndDateSelect={this.handleEndDateSelect}
                    createAboutModal={this.createAboutModal}
                    toggleCalendar={this.toggleCalendar}
                    maxDate={this.state.filters.maxDate}
                    minDate={this.state.filters.minDate}
                    calendarView={this.state.calendarView}
                 />
                <div className="wrapper">
                    {this.state.calendarView ?
                      <Calendar eventsToPass={this.state.eventsToShow} setModalContent={this.setModalContent}/>
                      :
                      <EventsWrapper eventsToShow={filtredEvents} setModalContent={this.setModalContent}/>
                    }
                </div>

                <ModalView modalContent={this.state.modalContent} openModal={this.state.openModal} handleClose={this.handleClose}/>
            </div>
        );
    };

    componentDidMount() {
        fetch('https://still-caverns-40972.herokuapp.com/allEvents').then((response) => { // http://localhost:5000/allEvents pass me to use local server
                return response.json()
            }
        ).then((json) => {
            const eventsToShow  = json.map(event => {
                event.date = moment(event.date).set('year', new Date().getFullYear());
                return event;
            }).sort((a, b) => {
                return new Date(a.date.toDate()) - new Date(b.date.toDate());
            });
            this.setState({ eventsToShow });
        })
    }
}

export default App;
