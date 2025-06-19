import { useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

import moment from 'moment';

import { Navbar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from '../';
import { localizer, getMessagesES } from '../../helpers';
import { useUiStore, useCalendarStore } from '../../hooks';

export const CalendarPage = () => {
  const { openDateModal } = useUiStore();
  const { events, setActiveEvent } = useCalendarStore();

  const [lastView, setLastView] = useState(localStorage.getItem('lastView') || 'week');

  // Normalizamos eventos
  const normalizedEvents = events.map(ev => ({
    ...ev,
    start: new Date(ev.start),
    end: ev.end ? new Date(ev.end) : new Date(ev.start),
  }));



  const eventStyleGetter = (event, start, end, isSelected) => ({
    style: {
      backgroundColor: '#347CF7',
      borderRadius: '0px',
      opacity: 0.8,
      color: 'white',
    },
  });

  const onDoubleClick = (event) => openDateModal();

  const onSelect = (event) => setActiveEvent(event);

  const onViewChanged = (view) => {
    localStorage.setItem('lastView', view);
    setLastView(view);
  };

  // Fecha actual
  const today = new Date();

  // Para agenda: filtro eventos que estén en un rango extendido (3 meses antes y después de hoy)
  const agendaEvents = normalizedEvents.filter(ev => {
    const startLimit = moment(today).subtract(3, 'months').startOf('day');
    const endLimit = moment(today).add(3, 'months').endOf('day');
    return moment(ev.start).isBetween(startLimit, endLimit, null, '[]') || moment(ev.end).isBetween(startLimit, endLimit, null, '[]');
  });

  // Evento que se pasa al calendario depende de la vista: 
  // - si la vista es agenda, pasa solo agendaEvents (filtrados)
  // - si no, pasa todos los eventos
  const eventsToShow = lastView === 'agenda' ? agendaEvents : normalizedEvents;

  return (
    <>
      <Navbar />

      <Calendar
        culture="es"
        localizer={localizer}
        events={eventsToShow}
        defaultDate={new Date()}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 80px)' }}
        messages={getMessagesES()}
        eventPropGetter={eventStyleGetter}
        components={{ event: CalendarEvent }}
        onDoubleClickEvent={onDoubleClick}
        onSelectEvent={onSelect}
        onView={onViewChanged}
        views={['month', 'week', 'day', 'agenda']}
        view={lastView}
      />

      <CalendarModal />
      <FabAddNew />
      <FabDelete />
    </>
  );
};
