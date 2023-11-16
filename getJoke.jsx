
const Laugh = () => {

    const {useState, useEffect} = React;

    const [up, setUp] = useState(false);

    useEffect(() => {

        setTimeout(() => {setUp(!up);}, 200);

    }, [up]);

    return (
        <img className={up? "up" : null} src="./laugh_emoji.png"/>
    );

}

const useJokeApi = ({initialJoke}) => {

    const {useReducer} = React;

    const url = "https://icanhazdadjoke.com/";

    const [state, dispatch] = useReducer(
        dataFetchReducer, 
        {
            isLoading: false,
            isError: false,
            joke: initialJoke
        }
    );

    const fetchData = async () => {

        dispatch({ type: "FETCH_INIT" });
        
        try {
          
          const result = await axios.get(url, {headers: {'Accept': 'application/json'}});
          dispatch({ type: "FETCH_SUCCESS", payload: result.data.joke });
          
        } catch (error) {

          dispatch({ type: "FETCH_FAILURE" });

        }
      };

    return [state, fetchData];

}

const dataFetchReducer = (state, action) => {

    switch (action.type) {
      case "FETCH_INIT":
        return {
          ...state,
          isLoading: true,
          isError: false
        };
      case "FETCH_SUCCESS":
        return {
          ...state,
          isLoading: false,
          isError: false,
          joke: action.payload
        };
      case "FETCH_FAILURE":
        return {
          ...state,
          isLoading: false,
          isError: true
        };
      default:
        throw new Error();
    }

};

function App() {

    const [{ joke, isLoading, isError }, doFetch] = useJokeApi("");

    return (
        <div className="container">
            <button className="get-button" onClick={(e) => doFetch()}>Get Joke</button>
            {isError && <p>There appears to be an error...</p>}
            {isLoading ? <p>Loading...</p> : <p>{joke}</p>}
            {/* {joke && <img src="./laugh_emoji5.png"/>} */}
            {joke && <Laugh/>}
        </div>
    );

}

ReactDOM.render(<App />, document.getElementById("root"));
