import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, Button } from 'react-bootstrap';
import NotificationService from '../services/notification.service';

function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUnreadCount();
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await NotificationService.getUnreadCount();
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error al obtener conteo de notificaciones:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await NotificationService.getAllNotifications();
      setNotifications(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await NotificationService.markAsRead(id);

      // Actualizar la UI
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));

      fetchUnreadCount();
    } catch (error) {
      console.error('Error al marcar notificación como leída:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await NotificationService.markAllAsRead();

      // Actualizar la UI
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error al marcar todas las notificaciones como leídas:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await NotificationService.deleteNotification(id);

      // Actualizar la UI
      setNotifications(notifications.filter(notif => notif.id !== id));
      fetchUnreadCount();
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };

  return (
    <Dropdown onToggle={(isOpen) => isOpen && fetchNotifications()}>
      <Dropdown.Toggle variant="light" id="dropdown-notifications">
        <i className="fa fa-bell"></i>
        {unreadCount > 0 && <Badge variant="danger">{unreadCount}</Badge>}
      </Dropdown.Toggle>

      <Dropdown.Menu className="notification-dropdown">
        <div className="notification-header">
          <h6>Notificaciones</h6>
          {unreadCount > 0 && (
            <Button variant="link" size="sm" onClick={markAllAsRead}>
              Marcar todas como leídas
            </Button>
          )}
        </div>

        {loading ? (
          <div className="text-center p-3">Cargando...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-3">No hay notificaciones</div>
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              <div className="notification-content">
                <h6>{notification.title}</h6>
                <p>{notification.message}</p>
                <small>{new Date(notification.createdAt).toLocaleString()}</small>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={() => markAsRead(notification.id)}
                  >
                    Marcar como leída
                  </Button>
                )}
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => deleteNotification(notification.id)}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          ))
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default NotificationCenter;