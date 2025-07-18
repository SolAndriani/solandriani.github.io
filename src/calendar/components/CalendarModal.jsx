import { useMemo, useState, useEffect } from 'react';
import { addHours, differenceInSeconds } from 'date-fns';

import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import Modal from 'react-modal';

import DatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import es from 'date-fns/locale/es';
import { useCalendarStore, useUiStore } from '../../hooks';

registerLocale('es', es);

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
};

Modal.setAppElement('#root');

export const CalendarModal = () => {

    const { isDateModalOpen, closeDateModal } = useUiStore();
    const { activeEvent, startSavingEvent } = useCalendarStore();

    const [formSubmitted, setFormSubmitted] = useState(false);

    const [formValues, setFormValues] = useState({
        title: '',
        notes: '',
        start: new Date(),
        end: addHours(new Date(), 2),
    });

    const titleClass = useMemo(() => {
        if (!formSubmitted) return '';

        return formValues.title.length > 0
            ? ''
            : 'is-invalid';

    }, [formValues.title, formSubmitted]);

    useEffect(() => {
      if (activeEvent !== null) {
          setFormValues({ ...activeEvent });
      }    
    }, [activeEvent]);

    const onInputChanged = ({ target }) => {
        setFormValues({
            ...formValues,
            [target.name]: target.value
        });
    };

    const onDateChanged = (event, changing) => {
        setFormValues({
            ...formValues,
            [changing]: event
        });
    };

    const onCloseModal = () => {
        closeDateModal();
    };

    const onSubmit = async(event) => {
    
        setFormSubmitted(true);

        if (!formValues.start) {
            Swal.fire('Fecha de inicio requerida', 'Debe ingresar una fecha y hora de inicio', 'error');
            return;
        }

        // Si no hay fecha de fin, asigno la misma fecha de inicio
        const endDate = formValues.end || formValues.start;

        if (endDate < formValues.start) {
            Swal.fire('Fechas incorrectas', 'La fecha de fin no puede ser anterior a la fecha de inicio', 'error');
            return;
        }

        if (formValues.title.length <= 0) {
            Swal.fire('Título requerido', 'Debe ingresar un título para el evento', 'error');
            return;
        }

        // Construyo el evento para guardar con end garantizado
        const eventToSave = {
            ...formValues,
            end: endDate
        };

        await startSavingEvent(eventToSave);
        closeDateModal();
        setFormSubmitted(false);
    };

  return (
    <Modal
        isOpen={isDateModalOpen}
        onRequestClose={onCloseModal}
        style={customStyles}
        className="modal"
        overlayClassName="modal-fondo"
        closeTimeoutMS={200}
    >
        <h1> Nuevo evento </h1>
        <hr />
        <form className="container" onSubmit={onSubmit}>

            <div className="form-group mb-2">
                <label>Fecha y hora inicio</label>
                <DatePicker 
                    selected={formValues.start}
                    onChange={(event) => onDateChanged(event, 'start')}
                    className="form-control"
                    dateFormat="Pp"
                    showTimeSelect
                    locale="es"
                    timeCaption="Hora"
                />
            </div>

            <div className="form-group mb-2">
                <label>Fecha y hora fin (opcional)</label>
                <DatePicker 
                    minDate={formValues.start}
                    selected={formValues.end}
                    onChange={(event) => onDateChanged(event, 'end')}
                    className="form-control"
                    dateFormat="Pp"
                    showTimeSelect
                    locale="es"
                    timeCaption="Hora"
                    isClearable={true} // permite limpiar la fecha de fin
                />
            </div>

            <hr />
            <div className="form-group mb-2">
                <label>Título y notas</label>
                <input 
                    type="text" 
                    className={`form-control ${titleClass}`}
                    placeholder="Título del evento"
                    name="title"
                    autoComplete="off"
                    value={formValues.title}
                    onChange={onInputChanged}
                />
                <small className="form-text text-muted">Una descripción corta</small>
            </div>

            <div className="form-group mb-2">
                <textarea 
                    type="text" 
                    className="form-control"
                    placeholder="Notas"
                    rows="5"
                    name="notes"
                    value={formValues.notes}
                    onChange={onInputChanged}
                ></textarea>
                <small className="form-text text-muted">Información adicional</small>
            </div>

            <button
                type="submit"
                className="btn btn-outline-primary btn-block"
            >
                <i className="far fa-save"></i>
                <span> Guardar</span>
            </button>

        </form>
    </Modal>
  );
};
