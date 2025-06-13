import { createSlice } from '@reduxjs/toolkit';
import { addHours } from 'date-fns';

const tempEvent = {
    _id: new Date().getTime(),
    title: 'Cumpleaños de sol',
    start: new Date('2025-06-18T00:00:00'),
    end:null,
    notes: 'Hay que comprar el pastel',
    bgColor: '#fafafa',
    user: {
      _id: '123',
      name: 'Sol Andriani'
    }
};

const loadEvents = () => {
  try {
    const events = localStorage.getItem('events');
    return events ? JSON.parse(events) : [tempEvent];
  } catch {
    return [tempEvent];
  }
};

const saveEvents = (events) => {
  localStorage.setItem('events', JSON.stringify(events));
};

export const calendarSlice = createSlice({
    name: 'calendar',
    initialState: {
        events: loadEvents(),
        activeEvent: null
    },
    reducers: {
        onSetActiveEvent: ( state, { payload }) => {
            state.activeEvent = payload;
        },
        onAddNewEvent: ( state, { payload }) => {
            state.events.push( payload );
            saveEvents(state.events);
            state.activeEvent = null;
        },
        onUpdateEvent: ( state, { payload } ) => {
            state.events = state.events.map( event => event._id === payload._id ? payload : event );
            saveEvents(state.events);
        },
        onDeleteEvent: ( state ) => {
            if ( state.activeEvent ) {
                state.events = state.events.filter( event => event._id !== state.activeEvent._id );
                saveEvents(state.events);
                state.activeEvent = null;
            }
        }
    }
});

// Action creators
export const { onSetActiveEvent, onAddNewEvent, onUpdateEvent, onDeleteEvent } = calendarSlice.actions;
