import { useState } from "react";

export default function useVisualMode(initial) {

  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  //transition function to move to a different mode
  function transition(nextMode, replace = false) {

    if (replace) {
      // will remove last history value then add newMode value at end
      setHistory(prev => [...prev.slice(0, -1), nextMode]);
    } else {
      // will keep last history value and just add newMode value at end
      setHistory(prev => [...prev, nextMode]);
    }
    // then change to the newMode
    setMode(nextMode);
  }
  
  //back function, do nothing if only initial value in history
  function back() {
    
    // only go back when history array has more than just 1 initial value
    if (history.length > 1) {
      
      setHistory(prev => {
        // when you go back one, you will need to remove the last value in history array
        const previousHistory = prev.slice(0, -1);
        const len = previousHistory.length
        // then change mode to new last value of the history array
        setMode(previousHistory[len - 1]);
        return [...previousHistory];
      });
     
    }
  }

  return { mode, transition, back };
}