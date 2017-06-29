const EventItem = ({event})=>(
    <div className="event">
        <a href={event.link}>
            <h4>{event.title}</h4>
            <img className="img-responsive" src={event.img} alt=""/>
        </a>
        <p>{event.date.format('DD MMMM')}</p>
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
        fetch('http://localhost:5000/allEvents').then((response) => { // 'https://still-caverns-40972.herokuapp.com/allEvents'
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
            console.log(json);
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
