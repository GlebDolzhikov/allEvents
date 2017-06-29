const EventItem = ({event})=>(
    <div className="event">
        <a href={event.link}>
            <h4>{event.title}</h4>
            <img className="img-responsive" src={event.img} alt=""/>
            <p>{event.date}</p>
        </a>
    </div>
)

const App = React.createClass({
    getInitialState() {
       return {eventsToShow: []};
    },

    render() {
        return (
            <div className="wrapper">
                <div className="masonry">
                    {this.state.eventsToShow.map((event, i) =>(
                         <EventItem event={event} key={i} />
                    ))}
                </div>
            </div>
        );
    },

    componentDidMount() {
        fetch('https://still-caverns-40972.herokuapp.com/allEvents').then((response) => {
                return response.json()
            }
        ).then((json) => {
            this.setState({
                eventsToShow: json
            })
        })
    }
});


ReactDOM.render(
    <App />,
    document.getElementById('greeting-div')
);
