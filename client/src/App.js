import React, {Component} from "react";
import "./App.css";
import moment from "moment";
import {AppBar, DatePicker, Card, Dialog, FlatButton} from "material-ui";

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
        const actions = [
            <FlatButton
                label="Close"
                primary={true}
                onTouchTap={this.handleClose}
            />
        ];
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
                {renderEvents(filtredEvents, this.setModalContent)}
                {this.state.modalContent && <Dialog
                    title={this.state.modalContent.title}
                    modal={false}
                    open={this.state.openModal}
                    onRequestClose={this.handleClose}
                    actions={actions}
                >
                    <img src={this.state.modalContent.img} alt=""/>
                    <p>{this.state.modalContent.description}</p>
                </Dialog>}
            </div>
        );
    }

    componentDidMount() {
        fetch('https://still-caverns-40972.herokuapp.com/allEvents').then((response) => {
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

function renderEvents(eventsToShow, setModalContent) {
    return (
        <div className="wrapper">
            <div className="masonry">
                {eventsToShow.map((event, i) => (
                    <EventItem event={event} key={i} setModalContent={setModalContent}/>
                ))}
            </div>
        </div>)
}

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
)
