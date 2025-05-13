import React, { Component } from "react";
import EventService from "../services/event.service";
import EventBus from "../common/EventBus";

// Note: The following packages need to be installed:
// npm install @fullcalendar/react @fullcalendar/core @fullcalendar/daygrid @fullcalendar/timegrid @fullcalendar/interaction

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default class Events extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [],
      selectedEvent: null,
      loading: true,
      message: "",
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showViewModal: false,
      newEvent: {
        title: "",
        description: "",
        startDateTime: this.formatDateTime(new Date()),
        endDateTime: this.formatDateTime(new Date(Date.now() + 60 * 60 * 1000)) // 1 hour later
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.updateEvent = this.updateEvent.bind(this);
    this.deleteEvent = this.deleteEvent.bind(this);
    this.openCreateModal = this.openCreateModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.openViewModal = this.openViewModal.bind(this);
    this.closeModals = this.closeModals.bind(this);
    this.handleDateClick = this.handleDateClick.bind(this);
    this.handleEventClick = this.handleEventClick.bind(this);
  }

  componentDidMount() {
    this.loadEvents();
  }

  formatDateTime(date) {
    return date.toISOString().slice(0, 16);
  }

  parseDateTime(dateTimeString) {
    return new Date(dateTimeString);
  }

  loadEvents() {
    this.setState({ loading: true });
    EventService.getAllEvents().then(
      response => {
        // Transform the events for FullCalendar
        const formattedEvents = response.data.map(event => ({
          id: event.id,
          title: event.title,
          start: event.startDateTime,
          end: event.endDateTime,
          description: event.description,
          extendedProps: {
            description: event.description
          }
        }));

        this.setState({
          events: response.data,
          calendarEvents: formattedEvents,
          loading: false
        });
      },
      error => {
        this.setState({
          loading: false,
          message:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  // Calendar event handlers
  handleDateClick(arg) {
    const startDateTime = new Date(arg.date);
    const endDateTime = new Date(arg.date);
    endDateTime.setHours(endDateTime.getHours() + 1); // Default to 1 hour duration

    this.setState({
      newEvent: {
        title: "",
        description: "",
        startDateTime: this.formatDateTime(startDateTime),
        endDateTime: this.formatDateTime(endDateTime)
      }
    });

    this.openCreateModal();
  }

  handleEventClick(arg) {
    const eventId = arg.event.id;
    const event = this.state.events.find(e => e.id.toString() === eventId);
    
    if (event) {
      this.openViewModal(event);
    }
  }

  // Modal methods
  openCreateModal() {
    this.setState({
      showCreateModal: true
    });
  }

  openEditModal(event) {
    this.setState({
      showEditModal: true,
      selectedEvent: event,
      newEvent: {
        title: event.title,
        description: event.description,
        startDateTime: this.formatDateTime(this.parseDateTime(event.startDateTime)),
        endDateTime: this.formatDateTime(this.parseDateTime(event.endDateTime))
      }
    });
  }

  openDeleteModal(event) {
    this.setState({
      showDeleteModal: true,
      selectedEvent: event
    });
  }

  openViewModal(event) {
    this.setState({
      showViewModal: true,
      selectedEvent: event
    });
  }

  closeModals() {
    this.setState({
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showViewModal: false
    });
  }

  // Form handling
  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      newEvent: {
        ...prevState.newEvent,
        [name]: value
      }
    }));
  }

  // CRUD operations
  createEvent(e) {
    e.preventDefault();

    EventService.createEvent(this.state.newEvent).then(
      response => {
        this.closeModals();
        this.loadEvents();
      },
      error => {
        this.setState({
          message:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  updateEvent(e) {
    e.preventDefault();

    EventService.updateEvent(this.state.selectedEvent.id, this.state.newEvent).then(
      response => {
        this.closeModals();
        this.loadEvents();
      },
      error => {
        this.setState({
          message:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  deleteEvent() {
    EventService.deleteEvent(this.state.selectedEvent.id).then(
      response => {
        this.closeModals();
        this.setState({ selectedEvent: null });
        this.loadEvents();
      },
      error => {
        this.setState({
          message:
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString()
        });
      }
    );
  }

  render() {
    const { 
      events, 
      calendarEvents,
      selectedEvent, 
      loading, 
      message, 
      showCreateModal,
      showEditModal,
      showDeleteModal,
      showViewModal,
      newEvent
    } = this.state;

    return (
      <div className="container">
        {message && (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}

        {/* Create Event Button */}
        <div className="mb-3">
          <button 
            className="btn btn-success" 
            onClick={this.openCreateModal}
          >
            + Nuevo Evento
          </button>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Cargando...</span>
            </div>
          </div>
        ) : (
          <div className="calendar-container">
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
              }}
              events={calendarEvents}
              dateClick={this.handleDateClick}
              eventClick={this.handleEventClick}
              editable={true}
              selectable={true}
              selectMirror={true}
              dayMaxEvents={true}
              weekends={true}
              height="auto"
              locale="es"
            />
          </div>
        )}

        {/* Create Event Modal */}
        {showCreateModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Crear Nuevo Evento</h5>
                  <button type="button" className="close" onClick={this.closeModals}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form onSubmit={this.createEvent}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="title">Título</label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        name="title"
                        value={newEvent.title}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="description">Descripción</label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        value={newEvent.description}
                        onChange={this.handleInputChange}
                        rows="3"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="startDateTime">Fecha y hora de inicio</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="startDateTime"
                        name="startDateTime"
                        value={newEvent.startDateTime}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="endDateTime">Fecha y hora de fin</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="endDateTime"
                        name="endDateTime"
                        value={newEvent.endDateTime}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={this.closeModals}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Guardar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Event Modal */}
        {showEditModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar Evento</h5>
                  <button type="button" className="close" onClick={this.closeModals}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form onSubmit={this.updateEvent}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="edit-title">Título</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit-title"
                        name="title"
                        value={newEvent.title}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-description">Descripción</label>
                      <textarea
                        className="form-control"
                        id="edit-description"
                        name="description"
                        value={newEvent.description}
                        onChange={this.handleInputChange}
                        rows="3"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-startDateTime">Fecha y hora de inicio</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="edit-startDateTime"
                        name="startDateTime"
                        value={newEvent.startDateTime}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-endDateTime">Fecha y hora de fin</label>
                      <input
                        type="datetime-local"
                        className="form-control"
                        id="edit-endDateTime"
                        name="endDateTime"
                        value={newEvent.endDateTime}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={this.closeModals}>Cancelar</button>
                    <button type="submit" className="btn btn-primary">Actualizar</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedEvent && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirmar Eliminación</h5>
                  <button type="button" className="close" onClick={this.closeModals}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <p>¿Estás seguro de que deseas eliminar el evento <strong>{selectedEvent.title}</strong>?</p>
                  <p>Esta acción no se puede deshacer.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={this.closeModals}>Cancelar</button>
                  <button type="button" className="btn btn-danger" onClick={this.deleteEvent}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Event Modal */}
        {showViewModal && selectedEvent && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detalles del Evento</h5>
                  <button type="button" className="close" onClick={this.closeModals}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="view-title">Título</label>
                    <input
                      type="text"
                      className="form-control"
                      id="view-title"
                      value={selectedEvent.title}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="view-description">Descripción</label>
                    <textarea
                      className="form-control"
                      id="view-description"
                      value={selectedEvent.description}
                      readOnly
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="view-startDateTime">Fecha y hora de inicio</label>
                    <input
                      type="text"
                      className="form-control"
                      id="view-startDateTime"
                      value={new Date(selectedEvent.startDateTime).toLocaleString()}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="view-endDateTime">Fecha y hora de fin</label>
                    <input
                      type="text"
                      className="form-control"
                      id="view-endDateTime"
                      value={new Date(selectedEvent.endDateTime).toLocaleString()}
                      readOnly
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={this.closeModals}>Cerrar</button>
                  <button 
                    type="button" 
                    className="btn btn-warning" 
                    onClick={() => {
                      this.closeModals();
                      this.openEditModal(selectedEvent);
                    }}
                  >
                    Editar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-danger" 
                    onClick={() => {
                      this.closeModals();
                      this.openDeleteModal(selectedEvent);
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}