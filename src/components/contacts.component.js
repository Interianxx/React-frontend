import React, { Component } from "react";
import ContactService from "../services/contact.service";
import CategoryService from "../services/category.service";
import EventBus from "../common/EventBus";

export default class Contacts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contacts: [],
      categories: [],
      selectedContact: null,
      loading: true,
      message: "",
      currentPage: 1,
      contactsPerPage: 5,
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showViewModal: false,
      searchTerm: "",
      selectedCategoryFilter: 0,
      newContact: {
        name: "",
        email: "",
        phone: "",
        notes: "",
        categories: []
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleSearchChange = this.handleSearchChange.bind(this);
    this.handleCategoryFilterChange = this.handleCategoryFilterChange.bind(this);
    this.createContact = this.createContact.bind(this);
    this.updateContact = this.updateContact.bind(this);
    this.deleteContact = this.deleteContact.bind(this);
    this.openCreateModal = this.openCreateModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.openViewModal = this.openViewModal.bind(this);
    this.closeModals = this.closeModals.bind(this);
  }

  componentDidMount() {
    this.loadContacts();
    this.loadCategories();
  }

  loadCategories() {
    CategoryService.getAllCategories().then(
      response => {
        this.setState({
          categories: response.data
        });
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

        if (error.response && error.response.status === 401) {
          EventBus.dispatch("logout");
        }
      }
    );
  }

  loadContacts() {
    this.setState({ loading: true });
    ContactService.getAllContacts().then(
      response => {
        this.setState({
          contacts: response.data,
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

  selectContact(contact) {
    this.setState({
      selectedContact: contact
    });
  }

  // Pagination methods
  paginate(pageNumber) {
    this.setState({
      currentPage: pageNumber
    });
  }

  // Modal methods
  openCreateModal() {
    this.setState({
      showCreateModal: true,
      newContact: {
        name: "",
        email: "",
        phone: "",
        notes: "",
        categories: []
      }
    });
  }

  openEditModal(contact) {
    // Ensure contact.categories exists, if not, initialize it as an empty array
    let categories = [];

    if (contact.categories && contact.categories.length > 0) {
      // Create simplified category objects with just the necessary properties
      categories = contact.categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description
      }));
    }

    const contactWithCategories = {
      ...contact,
      categories: categories
    };

    this.setState({
      showEditModal: true,
      selectedContact: contactWithCategories,
      newContact: { ...contactWithCategories }
    });
  }

  openDeleteModal(contact) {
    this.setState({
      showDeleteModal: true,
      selectedContact: contact
    });
  }

  openViewModal(contact) {
    // Ensure contact.categories exists, if not, initialize it as an empty array
    let categories = [];

    if (contact.categories && contact.categories.length > 0) {
      // Create simplified category objects with just the necessary properties
      categories = contact.categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description
      }));
    }

    const contactWithCategories = {
      ...contact,
      categories: categories
    };

    this.setState({
      showViewModal: true,
      selectedContact: contactWithCategories
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
      newContact: {
        ...prevState.newContact,
        [name]: value
      }
    }));
  }

  handleSearchChange(event) {
    this.setState({
      searchTerm: event.target.value,
      currentPage: 1 // Reset to first page when search changes
    });
  }

  handleCategoryFilterChange(event) {
    this.setState({
      selectedCategoryFilter: parseInt(event.target.value, 10),
      currentPage: 1 // Reset to first page when filter changes
    });
  }

  handleCategoryChange(event) {
    const categoryId = parseInt(event.target.value, 10);

    this.setState(prevState => {
      // If categoryId is 0, it means "No category" was selected
      if (categoryId === 0) {
        return {
          newContact: {
            ...prevState.newContact,
            categories: []
          }
        };
      }

      // Find the category object from the categories array
      const selectedCategory = this.state.categories.find(cat => cat.id === categoryId);

      if (selectedCategory) {
        // Create a simplified category object with just the necessary properties
        const categoryObject = {
          id: selectedCategory.id,
          name: selectedCategory.name,
          description: selectedCategory.description
        };

        return {
          newContact: {
            ...prevState.newContact,
            categories: [categoryObject]
          }
        };
      }

      return prevState;
    });
  }

  // CRUD operations
  createContact(e) {
    e.preventDefault();

    // Create a copy of the contact object
    const contactToSend = { ...this.state.newContact };

    // Transform categories array to categoryIds array
    if (contactToSend.categories && contactToSend.categories.length > 0) {
      contactToSend.categoryIds = contactToSend.categories.map(category => category.id);
      delete contactToSend.categories;
    }

    ContactService.createContact(contactToSend).then(
      response => {
        this.closeModals();
        this.loadContacts();
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

  updateContact(e) {
    e.preventDefault();

    // Create a copy of the contact object
    const contactToSend = { ...this.state.newContact };

    // Transform categories array to categoryIds array
    if (contactToSend.categories && contactToSend.categories.length > 0) {
      contactToSend.categoryIds = contactToSend.categories.map(category => category.id);
      delete contactToSend.categories;
    }

    ContactService.updateContact(this.state.selectedContact.id, contactToSend).then(
      response => {
        this.closeModals();
        this.loadContacts();
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

  deleteContact() {
    ContactService.deleteContact(this.state.selectedContact.id).then(
      response => {
        this.closeModals();
        this.setState({ selectedContact: null });
        this.loadContacts();
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
      contacts, 
      selectedContact, 
      loading, 
      message, 
      currentPage, 
      contactsPerPage,
      showCreateModal,
      showEditModal,
      showDeleteModal,
      showViewModal,
      newContact
    } = this.state;

    // Filter contacts based on search term and category
    const filteredContacts = contacts.filter(contact => {
      // Search term filter
      const searchMatch = this.state.searchTerm === "" || 
        contact.name.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
        contact.phone.toLowerCase().includes(this.state.searchTerm.toLowerCase()) ||
        (contact.notes && contact.notes.toLowerCase().includes(this.state.searchTerm.toLowerCase()));

      // Category filter
      const categoryMatch = this.state.selectedCategoryFilter === 0 || 
        (contact.categories && 
         contact.categories.some(cat => cat.id === this.state.selectedCategoryFilter));

      return searchMatch && categoryMatch;
    });

    // Get current contacts for pagination
    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = filteredContacts.slice(indexOfFirstContact, indexOfLastContact);

    // Calculate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(filteredContacts.length / contactsPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="container">

        {message && (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}

        {/* Create Contact Button */}
        <div className="mb-3">
          <button 
            className="btn btn-success" 
            onClick={this.openCreateModal}
          >
            + Nuevo Contacto
          </button>
        </div>

        {/* Search and Filter */}
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Buscar por nombre, email, teléfono..."
                value={this.state.searchTerm}
                onChange={this.handleSearchChange}
              />
              <div className="input-group-append">
                <span className="input-group-text">
                  🔍
                </span>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <select
              className="form-control"
              value={this.state.selectedCategoryFilter}
              onChange={this.handleCategoryFilterChange}
            >
              <option value={0}>Todas las categorías</option>
              {this.state.categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Results Count */}
        {(this.state.searchTerm || this.state.selectedCategoryFilter !== 0) && (
          <div className="alert alert-info mb-3">
            Se encontraron {filteredContacts.length} contactos
            {this.state.searchTerm && <span> que contienen "{this.state.searchTerm}"</span>}
            {this.state.selectedCategoryFilter !== 0 && (
              <span> en la categoría "{this.state.categories.find(cat => cat.id === this.state.selectedCategoryFilter)?.name || ''}"</span>
            )}
          </div>
        )}

        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Cargando...</span>
            </div>
          </div>
        ) : (
          <div>
            {/* Contacts Table */}
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Categoría</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentContacts.map(contact => (
                    <tr 
                      key={contact.id} 
                      className={selectedContact && selectedContact.id === contact.id ? "table-primary" : ""}
                      onClick={() => this.selectContact(contact)}
                    >
                      <td>{contact.name}</td>
                      <td>{contact.email}</td>
                      <td>{contact.phone}</td>
                      <td>{contact.categories && contact.categories.length > 0 
                        ? contact.categories[0].name 
                        : "Sin categoría"}</td>
                      <td>
                        <button 
                          className="btn btn-info btn-sm mr-2" 
                          onClick={(e) => {
                            e.stopPropagation();
                            this.openViewModal(contact);
                          }}
                        >
                          Ver
                        </button>
                        <button 
                          className="btn btn-warning btn-sm mr-2" 
                          onClick={(e) => {
                            e.stopPropagation();
                            this.openEditModal(contact);
                          }}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            this.openDeleteModal(contact);
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <nav>
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => this.paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </button>
                </li>
                {pageNumbers.map(number => (
                  <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => this.paginate(number)}
                    >
                      {number}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => this.paginate(currentPage + 1)}
                    disabled={currentPage === pageNumbers.length}
                  >
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>

          </div>
        )}

        {/* Create Contact Modal */}
        {showCreateModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Crear Nuevo Contacto</h5>
                  <button type="button" className="close" onClick={this.closeModals}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form onSubmit={this.createContact}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="name">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={newContact.name}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={newContact.email}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="phone">Teléfono</label>
                      <input
                        type="text"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={newContact.phone}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="notes">Notas</label>
                      <textarea
                        className="form-control"
                        id="notes"
                        name="notes"
                        value={newContact.notes}
                        onChange={this.handleInputChange}
                        rows="3"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="category-select">Categoría</label>
                      <select
                        className="form-control"
                        id="category-select"
                        value={newContact.categories.length > 0 ? newContact.categories[0].id : 0}
                        onChange={this.handleCategoryChange}
                      >
                        <option value={0}>Sin categoría</option>
                        {this.state.categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
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

        {/* Edit Contact Modal */}
        {showEditModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar Contacto</h5>
                  <button type="button" className="close" onClick={this.closeModals}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form onSubmit={this.updateContact}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="edit-name">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit-name"
                        name="name"
                        value={newContact.name}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-email">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="edit-email"
                        name="email"
                        value={newContact.email}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-phone">Teléfono</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit-phone"
                        name="phone"
                        value={newContact.phone}
                        onChange={this.handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-notes">Notas</label>
                      <textarea
                        className="form-control"
                        id="edit-notes"
                        name="notes"
                        value={newContact.notes}
                        onChange={this.handleInputChange}
                        rows="3"
                      ></textarea>
                    </div>
                    <div className="form-group">
                      <label htmlFor="edit-category-select">Categoría</label>
                      <select
                        className="form-control"
                        id="edit-category-select"
                        value={newContact.categories.length > 0 ? newContact.categories[0].id : 0}
                        onChange={this.handleCategoryChange}
                      >
                        <option value={0}>Sin categoría</option>
                        {this.state.categories.map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
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
        {showDeleteModal && (
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
                  <p>¿Estás seguro de que deseas eliminar el contacto <strong>{selectedContact.name}</strong>?</p>
                  <p>Esta acción no se puede deshacer.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={this.closeModals}>Cancelar</button>
                  <button type="button" className="btn btn-danger" onClick={this.deleteContact}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Contact Modal */}
        {showViewModal && selectedContact && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detalles del Contacto</h5>
                  <button type="button" className="close" onClick={this.closeModals}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label htmlFor="view-name">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      id="view-name"
                      value={selectedContact.name}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="view-email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="view-email"
                      value={selectedContact.email}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="view-phone">Teléfono</label>
                    <input
                      type="text"
                      className="form-control"
                      id="view-phone"
                      value={selectedContact.phone}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="view-notes">Notas</label>
                    <textarea
                      className="form-control"
                      id="view-notes"
                      value={selectedContact.notes}
                      readOnly
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Categoría</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedContact.categories && selectedContact.categories.length > 0 
                        ? selectedContact.categories[0].name 
                        : "Sin categoría"}
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
                      this.openEditModal(selectedContact);
                    }}
                  >
                    Editar
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
