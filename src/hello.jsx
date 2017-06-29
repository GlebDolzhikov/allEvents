const App = React.createClass({
    getInitialState() {
       return {eventsToShow: ''};
    },

    render() {
        return (
            <div>{this.state.eventsToShow}</div>
        );
    },

    componentDidMount() {
        fetch('https://still-caverns-40972.herokuapp.com/allEvents').then((response) => {
                return response.json()
            }
        ).then((json) => {
            console.log(json);
            this.setState({
                eventsToShow: json
            })
        })
    }
})

ReactDOM.render(
    <App />,
    document.getElementById('greeting-div')
);
