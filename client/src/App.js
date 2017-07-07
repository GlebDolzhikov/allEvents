import React, { Component } from 'react';
import './App.css';
import moment from 'moment';

class App extends Component {
    state = {eventsToShow: []};
    render() {
        if(this.state.eventsToShow.length === 0) {
            return <div className="loader"> Loading... </div>
        }
        return (
            <div className="wrapper">
                <div className="masonry">
                    {this.state.eventsToShow.map((event, i) =>(
                        <EventItem event={event} key={i} />
                    ))}
                </div>
            </div>
        );
    }
    componentDidMount() {
        fetch('https://still-caverns-40972.herokuapp.com/allEvents').then((response) => {
                return response.json()
            }
        ).then((json) => {
            json = json.map(event =>{
                event.date = moment(event.date).set('year', new Date().getFullYear());
                return event;
            })
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


const EventItem = ({event})=>(
    <div className="event">
        <a href={event.link}>
            <h4>{event.title}</h4>
            <img className="img-responsive" src={event.img} alt=""/>
        </a>
        <p>{event.date.format('DD MMMM')}</p>
    </div>
)
