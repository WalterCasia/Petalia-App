// public/admin.js - Lógica Exclusiva del Panel de Administración (Petalia)

document.addEventListener('DOMContentLoaded', () => {
  // Validar sesión del lado del cliente
  const token = localStorage.getItem('petalia_jwt_token');
  const user = JSON.parse(localStorage.getItem('petalia_user_info') || '{}');

  if (!token || user.rol !== 'admin') {
    window.location.href = 'index.html';
    return;
  }

  // --- ELEMENTOS DEL DOM ---
  const notificationContainer = document.getElementById('notification-container');
  const adminLogoutBtn = document.getElementById('admin-logout-btn');

  // Tabs
  const tabUsers = document.getElementById('admin-tab-users');
  const tabCatalog = document.getElementById('admin-tab-catalog');
  const tabLogs = document.getElementById('admin-tab-logs');
  const panelUsers = document.getElementById('admin-panel-users');
  const panelCatalog = document.getElementById('admin-panel-catalog');
  const panelLogs = document.getElementById('admin-panel-logs');

  // Catalog Form & CRUD
  const addCatalogBtn = document.getElementById('admin-add-catalog-btn');
  const formBox = document.getElementById('admin-catalog-form-box');
  const cancelBtn = document.getElementById('admin-cat-cancel-btn');
  const catalogForm = document.getElementById('admin-catalog-form');
  const catalogTableBody = document.getElementById('admin-catalog-table-body');
  const usersTableBody = document.getElementById('admin-users-table-body');
  const logsTableBody = document.getElementById('admin-logs-table-body');
  const refreshLogsBtn = document.getElementById('refresh-logs-btn');

  let adminActiveTab = 'users'; // 'users' | 'catalog' | 'logs'
  let cachedPassword = null;

  // --- TOASTS / AVISOS DE PANTALLA ---
  function showToast(title, msg, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'info';
    if (type === 'success') icon = 'check_circle';
    if (type === 'warning') icon = 'warning';

    toast.innerHTML = `
      <span class="material-symbols-rounded toast-icon ${type}">${icon}</span>
      <div class="toast-content">
        <span class="toast-title">${title}</span>
        <span class="toast-msg">${msg}</span>
      </div>
      <button class="btn-close-toast">
        <span class="material-symbols-rounded" style="font-size: 16px;">close</span>
      </button>
    `;

    notificationContainer.appendChild(toast);

    toast.querySelector('.btn-close-toast').addEventListener('click', () => {
      toast.remove();
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 5000);
  }

  // --- HELPERS ---
  function formatDate(dateString) {
    if (!dateString) return 'Nunca';
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000;
    const adjusted = new Date(date.getTime() + tzOffset);
    return adjusted.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  // --- LOGOUT ---
  if (adminLogoutBtn) {
    adminLogoutBtn.addEventListener('click', () => {
      localStorage.removeItem('petalia_jwt_token');
      localStorage.removeItem('petalia_user_info');
      showToast('Sesión Finalizada', 'Has cerrado tu sesión administrativa.', 'info');
      setTimeout(() => {
        window.location.href = 'landing.html';
      }, 1000);
    });
  }

  // --- TABS NAVIGATION ---
  function renderAdminSection() {
    if (adminActiveTab === 'users') {
      loadAdminUsers();
    } else if (adminActiveTab === 'catalog') {
      loadAdminCatalog();
    } else if (adminActiveTab === 'logs') {
      promptAdminPasswordAndLoadLogs();
    }
  }

  if (tabUsers && tabCatalog && tabLogs && panelUsers && panelCatalog && panelLogs) {
    tabUsers.onclick = () => {
      adminActiveTab = 'users';
      tabUsers.classList.add('active');
      tabCatalog.classList.remove('active');
      tabLogs.classList.remove('active');
      panelUsers.classList.remove('hidden');
      panelCatalog.classList.add('hidden');
      panelLogs.classList.add('hidden');
      loadAdminUsers();
    };

    tabCatalog.onclick = () => {
      adminActiveTab = 'catalog';
      tabCatalog.classList.add('active');
      tabUsers.classList.remove('active');
      tabLogs.classList.remove('active');
      panelCatalog.classList.remove('hidden');
      panelUsers.classList.add('hidden');
      panelLogs.classList.add('hidden');
      loadAdminCatalog();
    };

    tabLogs.onclick = () => {
      adminActiveTab = 'logs';
      tabLogs.classList.add('active');
      tabUsers.classList.remove('active');
      tabCatalog.classList.remove('active');
      panelLogs.classList.remove('hidden');
      panelUsers.classList.add('hidden');
      panelCatalog.classList.add('hidden');
      promptAdminPasswordAndLoadLogs();
    };
  }

  if (refreshLogsBtn) {
    refreshLogsBtn.onclick = () => {
      loadAdminLogs();
    };
  }

  // --- PASSWORD PROMPT & API LOGS ---
  async function promptAdminPasswordAndLoadLogs(forcePrompt = false) {
    if (!cachedPassword || forcePrompt) {
      const pass = prompt('Por favor, ingrese la contraseña de administrador para ver el historial de consumo de la API:');
      if (pass === null) {
        // User cancelled, fallback to users tab
        tabUsers.click();
        return;
      }
      if (!pass.trim()) {
        showToast('Error', 'Debe ingresar una contraseña válida.', 'warning');
        tabUsers.click();
        return;
      }
      cachedPassword = pass;
    }
    loadAdminLogs();
  }

  async function loadAdminLogs() {
    if (!logsTableBody) return;
    logsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Cargando logs de consumo...</td></tr>';

    try {
      const res = await fetch('/api/admin/logs', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'X-Admin-Password': cachedPassword
        }
      });

      if (res.status === 401 || res.status === 403) {
        cachedPassword = null; // Clear incorrect password
        showToast('Error de Autenticación', 'Contraseña de administrador incorrecta.', 'warning');
        tabUsers.click();
        return;
      }

      if (!res.ok) throw new Error('Error al obtener los logs');
      const { logs, total_hoy } = await res.json();

      // Update counter and progress bar
      const counterText = document.getElementById('api-counter-text');
      const progressBar = document.getElementById('api-progress-bar');
      
      if (counterText) {
        counterText.textContent = `${total_hoy} / 100`;
        if (total_hoy >= 100) {
          counterText.style.color = 'var(--critical)';
        } else if (total_hoy >= 80) {
          counterText.style.color = 'var(--warning-yellow)';
        } else {
          counterText.style.color = 'var(--primary)';
        }
      }

      if (progressBar) {
        const percentage = Math.min((total_hoy / 100) * 100, 100);
        progressBar.style.width = `${percentage}%`;
        if (total_hoy >= 100) {
          progressBar.style.background = 'var(--critical)';
        } else if (total_hoy >= 80) {
          progressBar.style.background = 'var(--warning-yellow)';
        } else {
          progressBar.style.background = 'linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%)';
        }
      }

      logsTableBody.innerHTML = '';
      if (logs.length === 0) {
        logsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay registros de llamadas API.</td></tr>';
        return;
      }

      logs.forEach(log => {
        const tr = document.createElement('tr');
        
        let statusBadge = '';
        if (log.codigo_estado >= 200 && log.codigo_estado < 300) {
          statusBadge = `<span class="badge" style="background-color: var(--healthy-bg); color: var(--healthy);">${log.codigo_estado} OK</span>`;
        } else if (log.codigo_estado === 429) {
          statusBadge = `<span class="badge" style="background-color: var(--critical-bg); color: var(--critical); font-weight: bold;">${log.codigo_estado} Excedido</span>`;
        } else {
          statusBadge = `<span class="badge" style="background-color: #fffde7; color: #f57f17;">${log.codigo_estado} Error</span>`;
        }

        const logDate = new Date(log.fecha_creacion);
        const formattedDate = logDate.toLocaleString('es-ES', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });

        tr.innerHTML = `
          <td>${log.id}</td>
          <td style="max-width: 400px; word-break: break-all; font-family: monospace;">${log.endpoint_consultado}</td>
          <td>${statusBadge}</td>
          <td>${log.tiempo_respuesta_ms} ms</td>
          <td>${formattedDate}</td>
        `;
        logsTableBody.appendChild(tr);
      });
    } catch (err) {
      logsTableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--critical);">No se pudo cargar el historial de peticiones de la API.</td></tr>';
    }
  }

  // --- FORM SHOW/HIDE ---
  if (addCatalogBtn && formBox) {
    addCatalogBtn.onclick = () => {
      document.getElementById('admin-catalog-form-title').textContent = 'Añadir Nueva Planta al Catálogo';
      catalogForm.reset();
      document.getElementById('admin-catalog-id').value = '';
      formBox.classList.remove('hidden');
    };
  }

  if (cancelBtn && formBox) {
    cancelBtn.onclick = () => {
      formBox.classList.add('hidden');
    };
  }

  // --- CRUD CATALOG SUBMIT ---
  if (catalogForm) {
    catalogForm.onsubmit = async (e) => {
      e.preventDefault();
      const id = document.getElementById('admin-catalog-id').value;
      const nombre_cientifico = document.getElementById('admin-cat-name-cientifico').value;
      const nombre_comun = document.getElementById('admin-cat-name-comun').value;
      const frecuencia_riego_dias = parseInt(document.getElementById('admin-cat-freq').value, 10);
      const luz_recomendada = document.getElementById('admin-cat-luz').value;
      const tempMinVal = document.getElementById('admin-cat-temp-min').value;
      const tempMaxVal = document.getElementById('admin-cat-temp-max').value;
      const temperatura_min = tempMinVal !== '' ? parseFloat(tempMinVal) : null;
      const temperatura_max = tempMaxVal !== '' ? parseFloat(tempMaxVal) : null;
      const descripcion = document.getElementById('admin-cat-desc').value;
      const imagen_url = document.getElementById('admin-cat-img').value;

      const payload = {
        nombre_cientifico,
        nombre_comun,
        frecuencia_riego_dias,
        luz_recomendada,
        temperatura_min,
        temperatura_max,
        descripcion,
        imagen_url
      };

      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/admin/plantas/${id}` : '/api/admin/plantas';

      try {
        const res = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error('Error al guardar planta');
        showToast('Catálogo Actualizado', 'La planta ha sido guardada en el catálogo.', 'success');
        formBox.classList.add('hidden');
        loadAdminCatalog();
      } catch (err) {
        console.error(err);
        showToast('Error', 'No se pudo guardar la planta en el catálogo.', 'warning');
      }
    };
  }

  // --- READ USERS ---
  async function loadAdminUsers() {
    if (!usersTableBody) return;
    usersTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Cargando usuarios...</td></tr>';

    try {
      const res = await fetch('/api/admin/usuarios', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const usersList = await res.json();
      
      usersTableBody.innerHTML = '';
      if (usersList.length === 0) {
        usersTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay usuarios.</td></tr>';
        return;
      }

      usersList.forEach(u => {
        const tr = document.createElement('tr');
        const badgeClass = u.rol === 'admin' ? 'badge-admin' : 'badge-user';
        const formattedDate = formatDate(u.fecha_registro);
        
        tr.innerHTML = `
          <td>${u.id_usuario}</td>
          <td><strong>${u.nombre}</strong></td>
          <td>${u.email}</td>
          <td><span class="badge ${badgeClass}">${u.rol.toUpperCase()}</span></td>
          <td>${formattedDate}</td>
          <td>
            ${u.rol !== 'admin' ? `
              <button class="btn-icon-admin btn-delete-admin" onclick="deleteUserByAdmin(${u.id_usuario})" title="Eliminar Usuario">
                <span class="material-symbols-rounded">delete</span>
              </button>
            ` : '<span style="font-size:11px;color:var(--text-muted);">Protegido</span>'}
          </td>
        `;
        usersTableBody.appendChild(tr);
      });
    } catch (err) {
      usersTableBody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:var(--critical);">No se pudo cargar la lista de usuarios.</td></tr>';
    }
  }

  // --- DELETE USER ---
  window.deleteUserByAdmin = async function(id) {
    if (!confirm('¿Está seguro de que desea eliminar este usuario? Esto borrará toda su colección de plantas, historiales y configuraciones de forma permanente.')) return;
    try {
      const res = await fetch(`/api/admin/usuarios/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      showToast('Usuario Eliminado', 'El usuario y sus datos han sido eliminados.', 'success');
      loadAdminUsers();
    } catch (err) {
      showToast('Error', 'No se pudo eliminar al usuario.', 'warning');
    }
  };

  // --- READ CATALOG ---
  async function loadAdminCatalog() {
    if (!catalogTableBody) return;
    catalogTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Cargando catálogo...</td></tr>';

    try {
      const res = await fetch('/api/admin/plantas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const catalogList = await res.json();
      
      catalogTableBody.innerHTML = '';
      if (catalogList.length === 0) {
        catalogTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Catálogo vacío.</td></tr>';
        return;
      }

      catalogList.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.id_catalogo}</td>
          <td><img src="${item.imagen_url}" style="width:40px;height:40px;border-radius:4px;object-fit:cover;"></td>
          <td><strong>${item.nombre_comun}</strong></td>
          <td><em>${item.nombre_cientifico}</em></td>
          <td>Cada ${item.frecuencia_riego_dias} días</td>
          <td>${item.luz_recomendada || 'No especificada'}</td>
          <td>
            <div class="admin-actions">
              <button class="btn-icon-admin btn-edit-admin" onclick="editCatalogItemByAdmin(${item.id_catalogo})" title="Editar Planta">
                <span class="material-symbols-rounded">edit</span>
              </button>
              <button class="btn-icon-admin btn-delete-admin" onclick="deleteCatalogItemByAdmin(${item.id_catalogo})" title="Eliminar Planta">
                <span class="material-symbols-rounded">delete</span>
              </button>
            </div>
          </td>
        `;
        catalogTableBody.appendChild(tr);
      });
    } catch (err) {
      catalogTableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--critical);">No se pudo cargar el catálogo de plantas.</td></tr>';
    }
  }

  // --- UPDATE CATALOG (EDIT) ---
  window.editCatalogItemByAdmin = async function(id) {
    try {
      const res = await fetch(`/api/catalogo/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      const item = await res.json();

      document.getElementById('admin-catalog-form-title').textContent = 'Editar Planta del Catálogo';
      document.getElementById('admin-catalog-id').value = item.id_catalogo;
      document.getElementById('admin-cat-name-cientifico').value = item.nombre_cientifico;
      document.getElementById('admin-cat-name-comun').value = item.nombre_comun;
      document.getElementById('admin-cat-freq').value = item.frecuencia_riego_dias;
      document.getElementById('admin-cat-luz').value = item.luz_recomendada || '';
      document.getElementById('admin-cat-temp-min').value = item.temperatura_min !== null ? item.temperatura_min : '';
      document.getElementById('admin-cat-temp-max').value = item.temperatura_max !== null ? item.temperatura_max : '';
      document.getElementById('admin-cat-desc').value = item.descripcion || '';
      document.getElementById('admin-cat-img').value = item.imagen_url || '';

      if (formBox) formBox.classList.remove('hidden');
    } catch (err) {
      showToast('Error', 'No se pudieron obtener los datos de la planta.', 'warning');
    }
  };

  // --- DELETE CATALOG ITEM ---
  window.deleteCatalogItemByAdmin = async function(id) {
    if (!confirm('¿Está seguro de que desea eliminar esta planta del catálogo general? Esto eliminará todas las instancias de esta planta en las colecciones de los usuarios y favoritos asociados de forma permanente.')) return;
    try {
      const res = await fetch(`/api/admin/plantas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error();
      showToast('Planta Eliminada', 'La planta ha sido eliminada del catálogo.', 'success');
      loadAdminCatalog();
    } catch (err) {
      showToast('Error', 'No se pudo eliminar la planta del catálogo.', 'warning');
    }
  };

  // Inicializar sección
  renderAdminSection();
});
