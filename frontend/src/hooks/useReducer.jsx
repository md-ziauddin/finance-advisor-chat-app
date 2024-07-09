import { useReducer } from "react";

/**
 * Action types for the reducer.
 */
const TYPES = {
  UPDATE_THREADS: "UPDATE_THREADS",
  UPDATE_MESSAGES: "UPDATE_MESSAGES",
  UPDATE_MESSAGE_PREVIOUS: "UPDATE_MESSAGE_PREVIOUS",
};

/**
 * Initial state for the reducer.
 */
const initialState = {
  threads: [], // Array to hold the threads
  messages: [], // Array to hold the messages
};

/**
 * Reducer function to manage the state based on dispatched actions.
 * @param {object} state - The current state.
 * @param {object} action - The action to be performed.
 * @returns {object} - The updated state.
 */
function reducer(state, action) {
  switch (action.type) {
    case TYPES.UPDATE_THREADS:
      // Updates the threads array in the state with the provided payload
      return { ...state, threads: action.payload };
    case TYPES.UPDATE_MESSAGES:
      // Updates the messages array in the state by appending the provided payload
      return { ...state, messages: [...state.messages, ...action.payload] };
    case TYPES.UPDATE_MESSAGE_PREVIOUS:
      // Replaces the entire messages array in the state with the provided payload
      return { ...state, messages: action.payload };
    default:
      // Returns the current state if action type is not recognized
      return state;
  }
}

/**
 * Custom hook to use the reducer with initial state and predefined action types.
 * @returns {object} - The state, dispatch function, and action types.
 */
const useCustomReducer = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch, TYPES };
};

export default useCustomReducer;
