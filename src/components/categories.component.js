import React, { Component } from "react";
import CategoryService from "../services/category.service";
import EventBus from "../common/EventBus";

export default class Categories extends Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: [],
      selectedCategory: null,
      loading: true,
      message: "",
      currentPage: 1,
      categoriesPerPage: 5,
      showCreateModal: false,
      showEditModal: false,
      showDeleteModal: false,
      showViewModal: false,
      newCategory: {
        name: "",
        description: ""
      }
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.createCategory = this.createCategory.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.deleteCategory = this.deleteCategory.bind(this);
    this.openCreateModal = this.openCreateModal.bind(this);
    this.openEditModal = this.openEditModal.bind(this);
    this.openDeleteModal = this.openDeleteModal.bind(this);
    this.openViewModal = this.openViewModal.bind(this);
    this.closeModals = this.closeModals.bind(this);
  }

  componentDidMount() {
    this.loadCategories();
  }

  loadCategories() {
    this.setState({ loading: true });
    CategoryService.getAllCategories().then(
      response => {
        this.setState({
          categories: response.data,
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

  selectCategory(category) {
    this.setState({
      selectedCategory: category
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
      newCategory: {
        name: "",
        description: ""
      }
    });
  }

  openEditModal(category) {
    this.setState({
      showEditModal: true,
      selectedCategory: category,
      newCategory: { ...category }
    });
  }

  openDeleteModal(category) {
    this.setState({
      showDeleteModal: true,
      selectedCategory: category
    });
  }

  openViewModal(category) {
    this.setState({
      showViewModal: true,
      selectedCategory: category
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
      newCategory: {
        ...prevState.newCategory,
        [name]: value
      }
    }));
  }

  // CRUD operations
  createCategory(e) {
    e.preventDefault();

    CategoryService.createCategory(this.state.newCategory).then(
      response => {
        this.closeModals();
        this.loadCategories();
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

  updateCategory(e) {
    e.preventDefault();

    CategoryService.updateCategory(this.state.selectedCategory.id, this.state.newCategory).then(
      response => {
        this.closeModals();
        this.loadCategories();
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

  deleteCategory() {
    CategoryService.deleteCategory(this.state.selectedCategory.id).then(
      response => {
        this.closeModals();
        this.setState({ selectedCategory: null });
        this.loadCategories();
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
      categories, 
      selectedCategory, 
      loading, 
      message, 
      currentPage, 
      categoriesPerPage,
      showCreateModal,
      showEditModal,
      showDeleteModal,
      showViewModal,
      newCategory
    } = this.state;

    // Get current categories for pagination
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

    // Calculate page numbers
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(categories.length / categoriesPerPage); i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="container">

        {message && (
          <div className="alert alert-danger" role="alert">
            {message}
          </div>
        )}

        {/* Create Category Button */}
        <div className="mb-3">
          <button 
            className="btn btn-success" 
            onClick={this.openCreateModal}
          >
            + Nueva Categoría
          </button>
        </div>

        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Cargando...</span>
            </div>
          </div>
        ) : (
          <div>
            {/* Categories Table */}
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {currentCategories.map(category => (
                    <tr 
                      key={category.id} 
                      className={selectedCategory && selectedCategory.id === category.id ? "table-primary" : ""}
                      onClick={() => this.selectCategory(category)}
                    >
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>
                        <button 
                          className="btn btn-info btn-sm mr-2" 
                          onClick={(e) => {
                            e.stopPropagation();
                            this.openViewModal(category);
                          }}
                        >
                          Ver
                        </button>
                        <button 
                          className="btn btn-warning btn-sm mr-2" 
                          onClick={(e) => {
                            e.stopPropagation();
                            this.openEditModal(category);
                          }}
                        >
                          Editar
                        </button>
                        <button 
                          className="btn btn-danger btn-sm" 
                          onClick={(e) => {
                            e.stopPropagation();
                            this.openDeleteModal(category);
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

        {/* Create Category Modal */}
        {showCreateModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Crear Nueva Categoría</h5>
                  <button type="button" className="close" onClick={this.closeModals}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form onSubmit={this.createCategory}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="name">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={newCategory.name}
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
                        value={newCategory.description}
                        onChange={this.handleInputChange}
                        rows="3"
                        required
                      ></textarea>
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

        {/* Edit Category Modal */}
        {showEditModal && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Editar Categoría</h5>
                  <button type="button" className="close" onClick={this.closeModals}>
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form onSubmit={this.updateCategory}>
                  <div className="modal-body">
                    <div className="form-group">
                      <label htmlFor="edit-name">Nombre</label>
                      <input
                        type="text"
                        className="form-control"
                        id="edit-name"
                        name="name"
                        value={newCategory.name}
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
                        value={newCategory.description}
                        onChange={this.handleInputChange}
                        rows="3"
                        required
                      ></textarea>
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
                  <p>¿Estás seguro de que deseas eliminar la categoría <strong>{selectedCategory.name}</strong>?</p>
                  <p>Esta acción no se puede deshacer.</p>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={this.closeModals}>Cancelar</button>
                  <button type="button" className="btn btn-danger" onClick={this.deleteCategory}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Category Modal */}
        {showViewModal && selectedCategory && (
          <div className="modal d-block" tabIndex="-1" role="dialog" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Detalles de la Categoría</h5>
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
                      value={selectedCategory.name}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="view-description">Descripción</label>
                    <textarea
                      className="form-control"
                      id="view-description"
                      value={selectedCategory.description}
                      readOnly
                      rows="3"
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={this.closeModals}>Cerrar</button>
                  <button 
                    type="button" 
                    className="btn btn-warning" 
                    onClick={() => {
                      this.closeModals();
                      this.openEditModal(selectedCategory);
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