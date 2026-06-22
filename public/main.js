// public/main.js - Lógica Principal SPA Petalia (Frontend UI/UX)

document.addEventListener('DOMContentLoaded', () => {
  // --- CATALOGO Y MOCKS DE RESPALDO (Por si el servidor backend no responde) ---
  const MOCK_CATALOG = [
    { id_catalogo: 1, nombre_cientifico: 'Monstera Deliciosa', nombre_comun: 'Costilla de Adán', frecuencia_riego_dias: 7, luz_recomendada: 'Luz indirecta', abono_frecuencia_dias: 30, temperatura_min: 18, temperatura_max: 30, imagen_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600&auto=format&fit=crop' },
    { id_catalogo: 2, nombre_cientifico: 'Sansevieria Trifasciata', nombre_comun: 'Lengua de Suegra', frecuencia_riego_dias: 15, luz_recomendada: 'Luz indirecta', abono_frecuencia_dias: 45, temperatura_min: 15, temperatura_max: 35, imagen_url: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?q=80&w=600&auto=format&fit=crop' },
    { id_catalogo: 3, nombre_cientifico: 'Epipremnum Aureum', nombre_comun: 'Pothos', frecuencia_riego_dias: 5, luz_recomendada: 'Luz indirecta', abono_frecuencia_dias: 30, temperatura_min: 18, temperatura_max: 30, imagen_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=600&auto=format&fit=crop' },
    { id_catalogo: 4, nombre_cientifico: 'Ficus Lyrata', nombre_comun: 'Ficus Lira', frecuencia_riego_dias: 7, luz_recomendada: 'Luz brillante', abono_frecuencia_dias: 30, temperatura_min: 18, temperatura_max: 28, imagen_url: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?q=80&w=600&auto=format&fit=crop' },
    { id_catalogo: 5, nombre_cientifico: 'Aloe Vera', nombre_comun: 'Aloe Vera', frecuencia_riego_dias: 14, luz_recomendada: 'Sol directo', abono_frecuencia_dias: 60, temperatura_min: 10, temperatura_max: 35, imagen_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=600&auto=format&fit=crop' }
  ];

  const DEFAULT_PLANTS = [
    { id_planta_usuario: 1, id_catalogo: 1, nombre_personalizado: 'Panchita', fecha_adquisicion: '2026-05-10', fecha_ultimo_riego: '2026-06-15', fecha_ultimo_abono: '2026-06-01', favorita: 1, estado: 'Activa', imagen_url: 'https://images.unsplash.com/photo-1614594975525-e45190c55d0b?q=80&w=600&auto=format&fit=crop' },
    { id_planta_usuario: 2, id_catalogo: 5, nombre_personalizado: 'Beto', fecha_adquisicion: '2026-05-20', fecha_ultimo_riego: '2026-06-10', fecha_ultimo_abono: '2026-05-20', favorita: 0, estado: 'Activa', imagen_url: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?q=80&w=600&auto=format&fit=crop' },
    { id_planta_usuario: 3, id_catalogo: 4, nombre_personalizado: 'Lulú', fecha_adquisicion: '2026-06-01', fecha_ultimo_riego: '2026-06-16', fecha_ultimo_abono: '2026-06-01', favorita: 1, estado: 'Activa', imagen_url: 'https://images.unsplash.com/photo-1597055181300-e3633a207518?q=80&w=600&auto=format&fit=crop' }
  ];

  const DEFAULT_HISTORY = [
    { id_historial: 1, id_planta_usuario: 1, nombre_personalizado: 'Panchita', tipo_cuidado: 'Riego', fecha_realizada: '2026-06-15T10:00:00Z', observaciones: 'Se realizó riego correctamente' },
    { id_historial: 2, id_planta_usuario: 2, nombre_personalizado: 'Beto', tipo_cuidado: 'Fertilizacion', fecha_realizada: '2026-05-20T11:30:00Z', observaciones: 'Nutrición líquida foliar' },
    { id_historial: 3, id_planta_usuario: 3, nombre_personalizado: 'Lulú', tipo_cuidado: 'Riego', fecha_realizada: '2026-06-16T09:00:00Z', observaciones: 'Riego matutino abundante' }
  ];

  // Variables globales
  let token = localStorage.getItem('petalia_jwt_token') || null;
  let user = JSON.parse(localStorage.getItem('petalia_user_info')) || null;
  let plants = [];
  let historyLogs = [];
  let scheduledEvents = []; // {id, plantId, type, dateISO, notes}
  let activeFilter = 'all';
  let searchQuery = '';
  let selectedCatalogItem = null;
  let tempPhotoUrl = null;

  // Variables de control del catálogo oficial
  let catalogPage = 1;
  let catalogMaxPage = 1;
  let catalogSearchQuery = '';
  let catalogFilterIndoor = '';
  let catalogFilterSunlight = '';
  let catalogFilterPoisonous = '';

  // --- ELEMENTOS DEL DOM ---
  const authContainer = document.getElementById('auth-container');
  const appContainer = document.getElementById('app-container');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const toRegisterLink = document.getElementById('to-register');
  const toLoginLink = document.getElementById('to-login');

  const userDisplayName = document.getElementById('user-display-name');
  const profileName = document.getElementById('profile-name');
  const userAvatarInitial = document.getElementById('user-avatar-initial');
  const logoutBtn = document.getElementById('logout-btn');
  const openAddModalBtn = document.getElementById('open-add-modal-btn');
  const searchPlantsInput = document.getElementById('search-plants');

  const statTotalCount = document.getElementById('stat-total-count');
  const plantsGrid = document.getElementById('plants-grid');
  const alertsList = document.getElementById('alerts-list');
  const historyTimeline = document.getElementById('history-timeline');
  const notificationContainer = document.getElementById('notification-container');
  const notificationBellBtn = document.getElementById('notification-bell-btn');
  const notificationBadge = document.getElementById('notification-badge');
  const notificationDropdown = document.getElementById('notification-dropdown');
  const notificationDropdownList = document.getElementById('notification-dropdown-list');
  const dropdownAlertCount = document.getElementById('dropdown-alert-count');
  const riegoCurrentTime = document.getElementById('riego-current-time');
  const riegoNextTarget = document.getElementById('riego-next-target');
  const riegoTimelineNodeTime = document.getElementById('riego-timeline-node-time');
  // (floating bot panel references are initialized after DOM is ready below)

  // Modal agregar planta
  const addPlantModal = document.getElementById('add-plant-modal');
  const addPlantForm = document.getElementById('add-plant-form');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const btnCancelModal = document.getElementById('btn-cancel-modal');
  const catalogSearch = document.getElementById('catalog-search');
  const catalogSuggestions = document.getElementById('catalog-suggestions');
  const selectedCatalogId = document.getElementById('selected-catalog-id');
  const plantNickname = document.getElementById('plant-nickname');
  const plantAcquisitionDate = document.getElementById('plant-acquisition-date');
  const plantLastWatered = document.getElementById('plant-last-watered');
  const plantPhotoInput = document.getElementById('plant-photo-input');
  const photoPreview = document.getElementById('photo-preview');
  const photoPreviewWrapper = document.getElementById('photo-preview-wrapper');
  const removePhotoBtn = document.getElementById('remove-photo-btn');

  // Plant detail modal elements
  const plantDetailModal = document.getElementById('plant-detail-modal');
  const detailClose = document.getElementById('detail-close');
  const detailCloseBtn = document.getElementById('detail-close-btn');
  const detailName = document.getElementById('detail-name');
  const detailImage = document.getElementById('detail-image');
  const detailSpecies = document.getElementById('detail-species');
  const detailAcquired = document.getElementById('detail-acquired');
  const detailLastWatered = document.getElementById('detail-last-watered');
  const detailFrequency = document.getElementById('detail-frequency');
  const detailNextWatering = document.getElementById('detail-next-watering');

  // --- CONFIGURACIÓN E INICIALIZACIÓN ---
  function init() {
    setupDates();
    updateTimeDisplay();
    setInterval(updateTimeDisplay, 60000); // Actualiza la hora cada minuto
    initNotificationDropdown();
    initScheduleModal();

    if (token) {
      showApp();
    } else {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get('mode');
      if (mode === 'login' || mode === 'register') {
        authContainer.classList.remove('hidden');
        appContainer.classList.add('hidden');
        document.body.style.backgroundColor = '#e2f5e7';
        if (mode === 'login') {
          loginForm.classList.add('active');
          registerForm.classList.remove('active');
        } else {
          loginForm.classList.remove('active');
          registerForm.classList.add('active');
        }
      } else {
        window.location.href = 'landing.html';
      }
    }
  }

  function setupDates() {
    const todayStr = new Date().toISOString().split('T')[0];
    plantAcquisitionDate.value = todayStr;
    plantLastWatered.value = todayStr;
  }

  function drawWeeklyCalendar() {
    const gridDays = document.getElementById('calendar-grid-days');
    const detailedList = document.getElementById('calendar-events-detailed-list');
    const filterSelect = document.getElementById('calendar-plant-filter');
    if (!gridDays || !detailedList) return;
    gridDays.innerHTML = '';
    detailedList.innerHTML = '';
    // enforce week view layout
    gridDays.classList.remove('month-view', 'year-view');
    gridDays.classList.add('week-view');
    gridDays.style.gridTemplateColumns = 'repeat(7, 1fr)';

    // compute start of week (Monday)
    const current = new Date(calendarState.currentDate.getTime());
    const day = current.getDay();
    const diffToMonday = (day === 0) ? -6 : 1 - day; // monday as first
    const monday = new Date(current.getTime());
    monday.setDate(current.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);

    const titleSpan = document.getElementById('calendar-current-month-year');
    if (titleSpan) titleSpan.textContent = `Semana de ${formatDate(monday.toISOString())}`;

    const daysOfWeek = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    for (let i = 0; i < 7; i++) {
      const cellDate = new Date(monday.getTime());
      cellDate.setDate(monday.getDate() + i);
      const cell = document.createElement('div');
      cell.className = 'calendar-day-cell';
      const dayNum = document.createElement('span');
      dayNum.className = 'calendar-day-number';
      dayNum.textContent = `${daysOfWeek[i]} ${cellDate.getDate()}`;
      cell.appendChild(dayNum);

      // collect events similar to monthly
      const filterVal = filterSelect ? filterSelect.value : 'all';
      const targetPlants = filterVal === 'all' ? plants : plants.filter(p => p.id_planta_usuario === parseInt(filterVal));
      const dayEvents = [];
      targetPlants.forEach(plant => {
        // check history and scheduledEvents
        historyLogs.forEach(log => {
          const logDate = new Date(log.fecha_realizada); logDate.setHours(0, 0, 0, 0);
          if (logDate.getTime() === cellDate.getTime() && log.id_planta_usuario === plant.id_planta_usuario) {
            dayEvents.push({ type: log.tipo_cuidado === 'Riego' ? 'water' : 'abono', label: `${log.tipo_cuidado} ${plant.nombre_personalizado}` });
          }
        });
        scheduledEvents.forEach(se => {
          const evDate = new Date(se.dateISO); evDate.setHours(0, 0, 0, 0);
          if (evDate.getTime() === cellDate.getTime() && se.plantId === plant.id_planta_usuario) {
            dayEvents.push({ type: se.type, label: `${se.type} ${plant.nombre_personalizado}` });
          }
        });
      });

      if (dayEvents.length) {
        const icons = document.createElement('div'); icons.className = 'calendar-cell-icons';
        if (dayEvents.some(e => e.type === 'water')) {
          const icon = document.createElement('span'); icon.className = 'calendar-cell-icon water material-symbols-rounded'; icon.textContent = 'water_drop'; icons.appendChild(icon);
        }
        if (dayEvents.some(e => e.type === 'abono')) {
          const icon = document.createElement('span'); icon.className = 'calendar-cell-icon abono material-symbols-rounded'; icon.textContent = 'spa'; icons.appendChild(icon);
        }
        cell.appendChild(icons);
      }

      cell.addEventListener('click', () => openScheduleModal(cellDate));
      gridDays.appendChild(cell);
    }
  }

  function drawYearCalendar() {
    const gridDays = document.getElementById('calendar-grid-days');
    const detailedList = document.getElementById('calendar-events-detailed-list');
    if (!gridDays || !detailedList) return;
    gridDays.innerHTML = '';
    detailedList.innerHTML = '';

    const year = calendarState.currentDate.getFullYear();
    const titleSpan = document.getElementById('calendar-current-month-year');
    if (titleSpan) titleSpan.textContent = `${year}`;

    // render 12 month tiles
    // enforce year view layout
    gridDays.classList.remove('month-view', 'week-view');
    gridDays.classList.add('year-view');
    gridDays.style.gridTemplateColumns = 'repeat(auto-fit, minmax(140px, 1fr))';

    for (let m = 0; m < 12; m++) {
      const tile = document.createElement('div');
      tile.className = 'calendar-month-tile widget-card';
      tile.style.cursor = 'pointer';
      tile.innerHTML = `<strong>${MONTH_NAMES[m]}</strong>`;
      tile.addEventListener('click', () => {
        calendarState.view = 'month';
        calendarState.currentDate = new Date(year, m, 1);
        const viewSelect = document.getElementById('calendar-view-select'); if (viewSelect) viewSelect.value = 'month';
        drawCalendarByView();
      });
      gridDays.appendChild(tile);
    }
  }

  function updateTimeDisplay() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: false });
    if (riegoCurrentTime) riegoCurrentTime.textContent = timeStr;
  }

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

  // --- CONTROL DE VISTAS (SPA) ---

  function showApp() {
    authContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    document.body.style.backgroundColor = 'var(--bg-main)';
    if (user && user.nombre) {
      userDisplayName.textContent = user.nombre;
      profileName.textContent = user.nombre;
      userAvatarInitial.textContent = user.nombre.charAt(0).toUpperCase();
    }

    // Toggle Admin sidebar item
    const navAdmin = document.getElementById('nav-admin');
    if (navAdmin) {
      if (user && user.rol === 'admin') {
        navAdmin.classList.remove('hidden');
      } else {
        navAdmin.classList.add('hidden');
      }
    }

    initSectionNavigation();
    loadDashboardData();
  }

  // --- NAVEGACIÓN SPA ENTRE SECCIONES ---
  function initSectionNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        const section = item.dataset.section;
        if (section) {
          e.preventDefault();
          navigateToSection(section);
        }
      });
    });
  }

  function navigateToSection(sectionName) {
    // Ocultar todas las secciones
    document.querySelectorAll('.dashboard-section-view').forEach(section => {
      section.classList.add('hidden');
    });

    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(`section-${sectionName}`);
    if (targetSection) {
      targetSection.classList.remove('hidden');
    }

    // Actualizar active en menú
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    const activeNav = document.querySelector(`.nav-item[data-section="${sectionName}"]`);
    if (activeNav) activeNav.classList.add('active');

    // Renderizar contenido específico de la sección
    if (sectionName === 'favoritos') {
      renderFavoritesSection();
    } else if (sectionName === 'historial') {
      renderHistorialSection();
    } else if (sectionName === 'cuidados') {
      renderCuidadosSection();
    } else if (sectionName === 'mis-plantas') {
      renderMisPlantasSection();
    } else if (sectionName === 'riego') {
      renderRiegoSection();
    } else if (sectionName === 'calendario-mensual') {
      renderCalendarioMensualSection();
    } else if (sectionName === 'catalogo') {
      renderCatalogSection();
    }
  }

  function createPlantCard(plant) {
    const catalog = getCatalogItem(plant);
    const isWaterCrit = getDaysUntilWatering(plant) <= 0;
    const isAbonoCrit = getDaysUntilAbono(plant) <= 0;
    const daysLeftRiego = getDaysUntilWatering(plant);
    const daysLeftAbono = getDaysUntilAbono(plant);
    const imgUrl = plant.imagen_url || plant.catalog_imagen_url || catalog.imagen_url;

    const card = document.createElement('div');
    card.className = `plant-card-ref ${isWaterCrit ? 'card-critico' : ''}`;
    card.dataset.id = plant.id_planta_usuario;

    card.innerHTML = `
      <div class="plant-card-ref-media">
        <img src="${imgUrl}" alt="${plant.nombre_personalizado}">
        <button class="material-symbols-rounded btn-open-photo media-badge-left" data-id="${plant.id_planta_usuario}" title="Cambiar foto">camera_alt</button>
        <button class="material-symbols-rounded media-badge-right-delete" title="Eliminar Planta" data-id="${plant.id_planta_usuario}">delete</button>
        <button class="material-symbols-rounded btn-mark-watered media-badge-status ${isWaterCrit ? 'critical-icon' : ''}" data-id="${plant.id_planta_usuario}" title="Marcar como regada">
          ${isWaterCrit ? 'water_drop' : 'check'}
        </button>
      </div>
      <div class="plant-card-ref-body">
        <div class="plant-ref-name-group">
          <div class="plant-ref-name-with-heart">
            <span class="plant-ref-nickname">${plant.nombre_personalizado}</span>
            <button class="btn-favorite-heart ${plant.favorita === 1 ? 'active' : ''}" data-id="${plant.id_planta_usuario}" title="Favorito">
              <span class="material-symbols-rounded">${plant.favorita === 1 ? 'favorite' : 'favorite_border'}</span>
            </button>
          </div>
          <span class="plant-ref-species">${catalog.nombre_comun}</span>
        </div>

        <div class="plant-ref-indicators-pills">
          <span class="plant-indicator-pill ${isWaterCrit ? 'pill-crit' : 'pill-ok'}" title="Próximo riego">
            <span class="material-symbols-rounded">water_drop</span>
            <span>${daysLeftRiego <= 0 ? 'Riego ya' : `${daysLeftRiego}d`}</span>
          </span>
          <span class="plant-indicator-pill ${isAbonoCrit ? 'pill-warning' : 'pill-info'}" title="Próxima fertilización">
            <span class="material-symbols-rounded">spa</span>
            <span>${daysLeftAbono <= 0 ? 'Abono ya' : `${daysLeftAbono}d`}</span>
          </span>
          <span class="plant-indicator-pill pill-light" title="Luz recomendada">
            <span class="material-symbols-rounded">light_mode</span>
            <span>${translateSunlight(catalog.luz_recomendada).replace('Luz: ', '')}</span>
          </span>
        </div>

        <div class="plant-card-actions-row">
          <button class="btn-card-action btn-water" data-id="${plant.id_planta_usuario}" title="Registrar Riego">
            <span class="material-symbols-rounded">water_drop</span>
            <span>Regar</span>
          </button>
          <button class="btn-card-action btn-fertilize" data-id="${plant.id_planta_usuario}" title="Registrar Abono">
            <span class="material-symbols-rounded">spa</span>
            <span>Abonar</span>
          </button>
        </div>
      </div>
    `;
    // Abrir detalle al hacer click en la tarjeta (si no se hizo click en un botón)
    card.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      openPlantDetail(plant.id_planta_usuario);
    });

    return card;
  }

  // Declared at outer scope
  let activeDetailPlantId = null;

  const detailViewContainer = document.getElementById('detail-view-container');
  const detailEditFormContainer = document.getElementById('detail-edit-form-container');
  const detailEditBtn = document.getElementById('detail-edit-btn');
  const detailEditCancel = document.getElementById('detail-edit-cancel');
  const detailEditForm = document.getElementById('detail-edit-form');

  function resetDetailModalMode() {
    if (detailViewContainer) detailViewContainer.classList.remove('hidden');
    if (detailEditFormContainer) detailEditFormContainer.classList.add('hidden');
  }

  // Open plant detail modal
  function openPlantDetail(id) {
    activeDetailPlantId = id;
    resetDetailModalMode();

    const plant = plants.find(p => p.id_planta_usuario === id);
    if (!plant || !plantDetailModal) return;
    const catalog = getCatalogItem(plant);
    detailName.textContent = plant.nombre_personalizado;
    detailImage.src = plant.imagen_url || plant.catalog_imagen_url || catalog.imagen_url;
    detailSpecies.textContent = `Especie: ${catalog.nombre_comun} (${catalog.nombre_cientifico})`;
    
    // Format dates nicely
    detailAcquired.textContent = `Adquirida: ${plant.fecha_adquisicion ? formatDate(plant.fecha_adquisicion) : 'No registrada'}`;
    detailLastWatered.textContent = `Último riego: ${plant.fecha_ultimo_riego ? formatDate(plant.fecha_ultimo_riego) : 'No registrado'}`;
    
    const freq = plant.frecuencia_riego_dias || plant.catalog_frecuencia_riego_dias || catalog.frecuencia_riego_dias || 7;
    detailFrequency.textContent = `Frecuencia de riego: cada ${freq} días`;
    const days = getDaysUntilWatering(plant);
    detailNextWatering.textContent = days <= 0 ? 'Próximo riego: Hoy' : `Próximo riego: en ${days} días`;

    const descriptionEl = document.getElementById('detail-description');
    const careGuidesEl = document.getElementById('detail-care-guides');
    const annexContainer = document.getElementById('detail-annex-container');

    if (descriptionEl) descriptionEl.textContent = `Descripción: ${catalog.descripcion || 'Sin descripción disponible.'}`;
    if (careGuidesEl) careGuidesEl.textContent = `Cuidados Básicos: ${catalog.cuidados_basicos || 'Sin cuidados específicos sugeridos.'}`;

    // Minimalist badges for watering and sunlight
    const detailBadges = document.getElementById('detail-badges');
    if (detailBadges) {
      detailBadges.innerHTML = '';

      // Watering Badge
      const waterBadge = document.createElement('span');
      waterBadge.style = 'padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; background-color: var(--healthy-bg); border: 1px solid var(--healthy-border); color: var(--primary-dark); display: inline-flex; align-items: center; gap: 4px;';
      waterBadge.innerHTML = `<span class="material-symbols-rounded" style="font-size: 14px; color: var(--primary);">water_drop</span> <span>Riego: cada ${freq} días</span>`;
      detailBadges.appendChild(waterBadge);

      // Sunlight Badge
      if (catalog.luz_recomendada) {
        const lightBadge = document.createElement('span');
        lightBadge.style = 'padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 600; background-color: var(--warning-yellow-bg); border: 1px solid #fff59d; color: var(--warning-yellow); display: inline-flex; align-items: center; gap: 4px;';
        lightBadge.innerHTML = `<span class="material-symbols-rounded" style="font-size: 14px; color: var(--warning-yellow);">light_mode</span> <span>Luz: ${translateSunlight(catalog.luz_recomendada)}</span>`;
        detailBadges.appendChild(lightBadge);
      }
    }

    // Personal description display
    const personalDescContainer = document.getElementById('detail-personal-desc-container');
    const personalDescText = document.getElementById('detail-personal-description');
    if (personalDescContainer && personalDescText) {
      if (plant.descripcion_personal && plant.descripcion_personal.trim() !== '') {
        personalDescText.textContent = plant.descripcion_personal;
        personalDescContainer.classList.remove('hidden');
      } else {
        personalDescContainer.classList.add('hidden');
      }
    }

    // Hide custom photo annex since we prioritize it as main image
    if (annexContainer) {
      annexContainer.classList.add('hidden');
    }

    plantDetailModal.classList.add('show');
  }

  if (detailClose) detailClose.addEventListener('click', () => { plantDetailModal.classList.remove('show'); resetDetailModalMode(); });
  if (detailCloseBtn) detailCloseBtn.addEventListener('click', () => { plantDetailModal.classList.remove('show'); resetDetailModalMode(); });

  if (detailEditBtn) {
    detailEditBtn.addEventListener('click', () => {
      const plant = plants.find(p => p.id_planta_usuario === activeDetailPlantId);
      if (!plant) return;
      const catalog = getCatalogItem(plant);
      const freq = plant.frecuencia_riego_dias || plant.catalog_frecuencia_riego_dias || catalog.frecuencia_riego_dias || 7;

      document.getElementById('detail-edit-nickname').value = plant.nombre_personalizado || '';
      document.getElementById('detail-edit-frequency').value = freq;
      document.getElementById('detail-edit-acquired').value = plant.fecha_adquisicion ? plant.fecha_adquisicion.split('T')[0] : '';
      document.getElementById('detail-edit-last-watered').value = plant.fecha_ultimo_riego ? plant.fecha_ultimo_riego.split('T')[0] : '';
      document.getElementById('detail-edit-description').value = plant.descripcion_personal || '';

      detailViewContainer.classList.add('hidden');
      detailEditFormContainer.classList.remove('hidden');
    });
  }

  if (detailEditCancel) {
    detailEditCancel.addEventListener('click', resetDetailModalMode);
  }

  if (detailEditForm) {
    detailEditForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const plant = plants.find(p => p.id_planta_usuario === activeDetailPlantId);
      if (!plant) return;

      const nickname = document.getElementById('detail-edit-nickname').value;
      const freq = parseInt(document.getElementById('detail-edit-frequency').value, 10);
      const acqDate = document.getElementById('detail-edit-acquired').value;
      const lastWatered = document.getElementById('detail-edit-last-watered').value;
      const desc = document.getElementById('detail-edit-description').value;

      try {
        const response = await fetch(`/api/plantas/${activeDetailPlantId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            nombre_personalizado: nickname,
            frecuencia_riego_dias: freq,
            fecha_adquisicion: acqDate,
            fecha_ultimo_riego: lastWatered,
            descripcion_personal: desc
          })
        });

        if (!response.ok) throw new Error('Error al actualizar planta');
        const resData = await response.json();
        
        // Update local object
        Object.assign(plant, resData.data);

        showToast('Guardado', 'Los cambios han sido guardados correctamente.', 'success');
        resetDetailModalMode();
        
        // Refresh details display in the modal
        openPlantDetail(activeDetailPlantId);
        
        // Refresh other views
        refreshAllViews();
      } catch (err) {
        console.error('Error al guardar cambios de la planta:', err);
        showToast('Error', 'No se pudieron guardar los cambios en el servidor.', 'warning');
      }
    });
  }

  // Sidebar toggle
  const sidebarToggle = document.getElementById('sidebar-toggle');
  const appSidebar = document.querySelector('.app-sidebar');
  if (sidebarToggle && appSidebar) {
    sidebarToggle.addEventListener('click', () => {
      appSidebar.classList.toggle('collapsed');
      const icon = sidebarToggle.querySelector('span');
      if (appSidebar.classList.contains('collapsed')) icon.textContent = 'chevron_right';
      else icon.textContent = 'menu';
    });
  }

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  if (mobileMenuBtn && appSidebar) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      appSidebar.classList.toggle('collapsed');
    });
  }

  function renderFavoritesSection() {
    const favoritesGrid = document.getElementById('plants-grid-favoritos');
    if (!favoritesGrid) return;

    // Filter favorites and sort alphabetically by nombre_personalizado
    const favorites = plants
      .filter(p => p.favorita === 1)
      .sort((a, b) => a.nombre_personalizado.localeCompare(b.nombre_personalizado));

    favoritesGrid.innerHTML = '';

    const favoriteCountBadge = document.getElementById('stat-total-count-favoritas');
    if (favoriteCountBadge) {
      favoriteCountBadge.textContent = `(${favorites.length})`;
    }

    if (favorites.length === 0) {
      favoritesGrid.innerHTML = `
        <div class="empty-state-text" style="padding: 24px 0; width: 100%; text-align: center; grid-column: 1/-1;">
          <span class="material-symbols-rounded" style="font-size: 40px; color: var(--accent);">favorite_border</span>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 8px;">Aún no has marcado favoritos.</p>
        </div>
      `;
    } else {
      favorites.forEach(plant => {
        const card = createPlantCard(plant);
        favoritesGrid.appendChild(card);
      });
    }
  }

  function renderMisPlantasSection() {
    const grid = document.getElementById('plants-grid-full');
    if (!grid) return;
    grid.innerHTML = '';
    const colCount = document.getElementById('stat-total-count-coleccion');
    if (colCount) colCount.textContent = `(${plants.length})`;

    if (plants.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-text" style="text-align:center;padding:24px;grid-column:1/-1;">
          <span class="material-symbols-rounded" style="font-size:40px;color:var(--accent);">yard</span>
          <p style="font-size:13px;color:var(--text-muted);margin-top:8px;">Aún no tienes plantas registradas.</p>
        </div>
      `;
      return;
    }

    plants.forEach(plant => {
      const card = createPlantCard(plant);
      grid.appendChild(card);
    });
  }

  function renderCuidadosSection() {
    const grid = document.getElementById('cuidados-plant-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (plants.length === 0) {
      grid.innerHTML = `
        <div class="empty-state-text" style="text-align:center;padding:32px;grid-column:1/-1;">
          <span class="material-symbols-rounded" style="font-size:40px;color:var(--accent);">eco</span>
          <p style="font-size:13px;color:var(--text-muted);margin-top:8px;">Registra tus plantas para ver el plan de cuidados.</p>
        </div>
      `;
      return;
    }

    plants.forEach(plant => {
      const catalog = getCatalogItem(plant);
      const daysRiego = getDaysUntilWatering(plant);
      const daysAbono = getDaysUntilAbono(plant);
      const isWaterCrit = daysRiego <= 0;
      const isAbonoCrit = daysAbono <= 0;
      const imgUrl = plant.imagen_url || plant.catalog_imagen_url || catalog.imagen_url;
      const freq = plant.frecuencia_riego_dias || plant.catalog_frecuencia_riego_dias || catalog.frecuencia_riego_dias || 7;
      const riegoPercent = Math.max(0, Math.min(100, Math.round(((freq - Math.max(0, daysRiego)) / freq) * 100)));
      const abonoPercent = Math.max(0, Math.min(100, Math.round((((catalog.abono_frecuencia_dias || 30) - Math.max(0, daysAbono)) / (catalog.abono_frecuencia_dias || 30)) * 100)));

      const card = document.createElement('div');
      card.className = `cuidado-card ${isWaterCrit ? 'card-critico' : ''}`;
      card.innerHTML = `
        <div class="cuidado-card-img">
          <img src="${imgUrl}" alt="${plant.nombre_personalizado}">
        </div>
        <div class="cuidado-card-body" data-id="${plant.id_planta_usuario}">
          <div class="cuidado-card-name">${plant.nombre_personalizado}</div>
          <div class="cuidado-card-species">${catalog.nombre_comun}</div>

          <div class="cuidado-metric">
            <div class="cuidado-metric-header">
              <span class="material-symbols-rounded" style="color:var(--primary);font-size:16px;">water_drop</span>
              <span>Riego</span>
              <span class="cuidado-metric-val ${isWaterCrit ? 'text-critical' : 'text-healthy'}">${daysRiego <= 0 ? '¡Toca hoy!' : `En ${daysRiego} días`}</span>
            </div>
            <div class="cuidado-progress-bar"><div class="cuidado-progress-fill water" style="width:${riegoPercent}%;"></div></div>
          </div>

          <div class="cuidado-metric">
            <div class="cuidado-metric-header">
              <span class="material-symbols-rounded" style="color:var(--warning-yellow);font-size:16px;">spa</span>
              <span>Abono</span>
              <span class="cuidado-metric-val ${isAbonoCrit ? 'text-critical' : ''}">${daysAbono <= 0 ? '¡Toca hoy!' : `En ${daysAbono} días`}</span>
            </div>
            <div class="cuidado-progress-bar"><div class="cuidado-progress-fill abono" style="width:${abonoPercent}%;"></div></div>
          </div>

          <div class="cuidado-metric">
            <div class="cuidado-metric-header">
              <span class="material-symbols-rounded" style="color:#ff9800;font-size:16px;">light_mode</span>
              <span>Luz</span>
              <span class="cuidado-metric-val">${catalog.luz_recomendada}</span>
            </div>
          </div>

          <div class="cuidado-metric">
            <div class="cuidado-metric-header">
              <span class="material-symbols-rounded" style="color:#1e88e5;font-size:16px;">thermostat</span>
              <span>Temperatura</span>
              <span class="cuidado-metric-val">${catalog.temperatura_min}°C - ${catalog.temperatura_max}°C</span>
            </div>
          </div>

          <div class="plant-card-actions-row" style="margin-top:10px;">
            <button class="btn-card-action btn-water" data-id="${plant.id_planta_usuario}">
              <span class="material-symbols-rounded">water_drop</span>
              <span>Regar</span>
            </button>
            <button class="btn-card-action btn-fertilize" data-id="${plant.id_planta_usuario}">
              <span class="material-symbols-rounded">spa</span>
              <span>Abonar</span>
            </button>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  function renderHistorialSection() {
    const timeline = document.getElementById('history-timeline-full');
    if (!timeline) return;
    timeline.innerHTML = '';

    const sorted = [...historyLogs].sort((a, b) => new Date(b.fecha_realizada) - new Date(a.fecha_realizada));

    if (sorted.length === 0) {
      timeline.innerHTML = '<p style="font-size:12px;color:var(--text-muted);padding:8px;">Sin actividades registradas aún.</p>';
      return;
    }

    sorted.forEach(log => {
      const icon = log.tipo_cuidado === 'Fertilizacion' ? 'spa' : 'water_drop';
      const color = log.tipo_cuidado === 'Riego' ? 'var(--primary)' : 'var(--warning-yellow)';
      const item = document.createElement('div');
      item.className = 'timeline-item';
      item.innerHTML = `
        <div class="timeline-content" style="padding-bottom:8px;border-bottom:1px solid var(--border);margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;">
          <div>
            <strong style="font-size:13px;color:var(--primary-dark);">${log.tipo_cuidado}</strong> en <span>${log.nombre_personalizado}</span>
            <p style="font-size:11px;color:var(--text-muted);">${formatDate(log.fecha_realizada)} - ${log.observaciones || ''}</p>
          </div>
          <span class="material-symbols-rounded" style="color:${color};font-size:20px;">${icon}</span>
        </div>
      `;
      timeline.appendChild(item);
    });
  }

  function renderRiegoSection() {
    const container = document.getElementById('riego-plants-progress-container');
    if (!container) return;
    container.innerHTML = '';

    const sortedPlants = [...plants].sort((a, b) => getDaysUntilWatering(a) - getDaysUntilWatering(b));

    if (sortedPlants.length === 0) {
      container.innerHTML = '<p class="empty-state-text" style="font-size:12px;color:var(--text-muted);padding:16px;text-align:center;">Registra plantas para ver sus progresos de riego.</p>';
      return;
    }

    sortedPlants.forEach(plant => {
      const catalog = getCatalogItem(plant);
      const daysLeft = getDaysUntilWatering(plant);
      const totalDays = plant.frecuencia_riego_dias || plant.catalog_frecuencia_riego_dias || catalog.frecuencia_riego_dias || 7;

      const percent = Math.max(0, Math.min(100, Math.round((daysLeft / totalDays) * 100)));

      let color = '#4caf50';
      if (percent <= 20) {
        color = '#d84315';
      } else if (percent <= 50) {
        color = '#ff9800';
      }

      const imgUrl = plant.imagen_url || plant.catalog_imagen_url || catalog.imagen_url;

      const row = document.createElement('div');
      row.className = 'riego-plant-row';
      const daysUntilAbono = getDaysUntilAbono(plant);
      const showAbonoBtn = daysUntilAbono <= 7; // mostrar botón de abono si falta una semana o menos
      row.innerHTML = `
        <div class="riego-plant-info">
          <img src="${imgUrl}" alt="${plant.nombre_personalizado}" class="riego-plant-thumb">
          <div class="riego-plant-meta">
            <span class="riego-plant-name">${plant.nombre_personalizado}</span>
            <span class="riego-plant-species">${catalog.nombre_comun}</span>
          </div>
        </div>
        <div class="riego-progress-bar-wrapper">
          <div class="riego-progress-track">
            <div class="riego-progress-fill" style="width: ${percent}%; background-color: ${color};"></div>
          </div>
          <div class="riego-progress-labels">
            <span>Último: ${formatDate(plant.fecha_ultimo_riego)}</span>
            <span>${percent}% de humedad estimada</span>
            <span>Próximo: en ${daysLeft <= 0 ? 'Hoy mismo!' : `${daysLeft} días`}</span>
          </div>
        </div>
        <div class="riego-row-actions">
          <button class="btn-riego-row-action btn-water-action" data-id="${plant.id_planta_usuario}">
            <span class="material-symbols-rounded">water_drop</span>
            <span>Regar</span>
          </button>
          ${showAbonoBtn ? `<button class="btn-abono-row-action btn-fertilize" data-id="${plant.id_planta_usuario}"><span class="material-symbols-rounded">spa</span><span>Abonar</span></button>` : ''}
        </div>
      `;
      container.appendChild(row);
    });
  }

  // --- SECCIÓN CALENDARIO MENSUAL ---
  // Calendar state for navigation and view
  let calendarState = {
    currentDate: new Date(),
    view: 'month' // 'month' | 'week' | 'year'
  };

  const MONTH_NAMES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  function renderCalendarioMensualSection() {
    const filterSelect = document.getElementById('calendar-plant-filter');
    if (!filterSelect) return;

    // Guardar el valor seleccionado actual
    const selectedVal = filterSelect.value || 'all';

    // Popular el select con las plantas
    filterSelect.innerHTML = '<option value="all">Todas</option>';
    plants.forEach(plant => {
      const option = document.createElement('option');
      option.value = plant.id_planta_usuario;
      option.textContent = plant.nombre_personalizado;
      filterSelect.appendChild(option);
    });

    // Restaurar selección si existe en las nuevas opciones
    if ([...filterSelect.options].some(opt => opt.value === selectedVal)) {
      filterSelect.value = selectedVal;
    } else {
      filterSelect.value = 'all';
    }

    // Configurar el listener de cambio (evitando duplicaciones)
    filterSelect.onchange = () => {
      drawMonthlyCalendar();
    };

    // Setup navigation controls
    const prevBtn = document.getElementById('calendar-prev');
    const nextBtn = document.getElementById('calendar-next');
    const viewSelect = document.getElementById('calendar-view-select');
    const titleSpan = document.getElementById('calendar-current-month-year');

    if (viewSelect) {
      viewSelect.value = calendarState.view;
      viewSelect.onchange = () => {
        calendarState.view = viewSelect.value;
        // normalize currentDate to first of month for month view
        if (calendarState.view === 'month') calendarState.currentDate.setDate(1);
        drawCalendarByView();
      };
    }

    if (prevBtn) prevBtn.onclick = () => {
      if (calendarState.view === 'month') calendarState.currentDate.setMonth(calendarState.currentDate.getMonth() - 1);
      else if (calendarState.view === 'week') calendarState.currentDate.setDate(calendarState.currentDate.getDate() - 7);
      else calendarState.currentDate.setFullYear(calendarState.currentDate.getFullYear() - 1);
      drawCalendarByView();
    };
    if (nextBtn) nextBtn.onclick = () => {
      if (calendarState.view === 'month') calendarState.currentDate.setMonth(calendarState.currentDate.getMonth() + 1);
      else if (calendarState.view === 'week') calendarState.currentDate.setDate(calendarState.currentDate.getDate() + 7);
      else calendarState.currentDate.setFullYear(calendarState.currentDate.getFullYear() + 1);
      drawCalendarByView();
    };

    drawCalendarByView();
  }

  function drawCalendarByView() {
    if (calendarState.view === 'month') drawMonthlyCalendar();
    else if (calendarState.view === 'week') drawWeeklyCalendar();
    else drawYearCalendar();
  }

  function drawMonthlyCalendar() {
    const filterSelect = document.getElementById('calendar-plant-filter');
    const gridDays = document.getElementById('calendar-grid-days');
    const detailedList = document.getElementById('calendar-events-detailed-list');
    if (!gridDays || !detailedList) return;

    const filterVal = filterSelect ? filterSelect.value : 'all';
    gridDays.innerHTML = '';
    detailedList.innerHTML = '';
    // enforce month view class and columns
    gridDays.classList.remove('week-view', 'year-view');
    gridDays.classList.add('month-view');
    gridDays.style.gridTemplateColumns = 'repeat(7, 1fr)';

    const year = calendarState.currentDate.getFullYear();
    const month = calendarState.currentDate.getMonth();

    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    // Día de la semana (0: Dom, 1: Lun, ..., 6: Sáb)
    // Convertir a Lun=0, Mar=1, Mié=2, Jue=3, Vie=4, Sáb=5, Dom=6
    let startOffset = firstDay.getDay() - 1;
    if (startOffset < 0) startOffset = 6;

    // Total de días en Junio
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Celdas vacías iniciales
    for (let i = 0; i < startOffset; i++) {
      const emptyCell = document.createElement('div');
      emptyCell.className = 'calendar-day-cell empty';
      emptyCell.style.opacity = '0.3';
      gridDays.appendChild(emptyCell);
    }

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    // update title
    const titleSpan = document.getElementById('calendar-current-month-year');
    if (titleSpan) titleSpan.textContent = `${MONTH_NAMES[month]} ${year}`;

    // Renderizar días del mes
    for (let day = 1; day <= totalDays; day++) {
      const cellDate = new Date(year, month, day);
      cellDate.setHours(0, 0, 0, 0);

      const cell = document.createElement('div');
      cell.className = 'calendar-day-cell';

      const isToday = cellDate.getTime() === todayDate.getTime();
      if (isToday) cell.classList.add('today');

      const dayNum = document.createElement('span');
      dayNum.className = 'calendar-day-number';
      dayNum.textContent = day;
      cell.appendChild(dayNum);

      // Eventos de este día para el filtro seleccionado
      const targetPlants = filterVal === 'all'
        ? plants
        : plants.filter(p => p.id_planta_usuario === parseInt(filterVal));

      const dayEvents = [];

      targetPlants.forEach(plant => {
        const catalog = getCatalogItem(plant);

        // 1. Historial (Eventos pasados)
        historyLogs.forEach(log => {
          if (log.id_planta_usuario === plant.id_planta_usuario) {
            const logDate = new Date(log.fecha_realizada);
            logDate.setHours(0, 0, 0, 0);
            if (logDate.getTime() === cellDate.getTime()) {
              dayEvents.push({
                plant,
                type: log.tipo_cuidado === 'Riego' ? 'water' : 'abono',
                label: `${log.tipo_cuidado === 'Riego' ? 'Riego' : 'Abono'} de ${plant.nombre_personalizado}`,
                isPast: true
              });
            }
          }
        });

        // 2. Proyecciones futuras
        // Riego
        const lastWater = new Date(plant.fecha_ultimo_riego);
        lastWater.setHours(0, 0, 0, 0);
        let nextWater = new Date(lastWater.getTime());
        const freq = plant.frecuencia_riego_dias || plant.catalog_frecuencia_riego_dias || catalog.frecuencia_riego_dias || 7;
        for (let i = 1; i <= 5; i++) {
          nextWater.setDate(nextWater.getDate() + freq);
          const nextWaterTime = nextWater.getTime();
          if (nextWaterTime === cellDate.getTime() && nextWaterTime >= todayDate.getTime()) {
            dayEvents.push({
              plant,
              type: 'water',
              label: `Riego de ${plant.nombre_personalizado}`,
              isPast: false
            });
            break;
          }
        }

        // Abono
        const lastAbono = new Date(plant.fecha_ultimo_abono || plant.fecha_adquisicion);
        lastAbono.setHours(0, 0, 0, 0);
        let nextAbono = new Date(lastAbono.getTime());
        const abonoFreq = catalog.abono_frecuencia_dias || 30;
        for (let i = 1; i <= 2; i++) {
          nextAbono.setDate(nextAbono.getDate() + abonoFreq);
          const nextAbonoTime = nextAbono.getTime();
          if (nextAbonoTime === cellDate.getTime() && nextAbonoTime >= todayDate.getTime()) {
            dayEvents.push({
              plant,
              type: 'abono',
              label: `Abono de ${plant.nombre_personalizado}`,
              isPast: false
            });
            break;
          }
        }
      });

      // Añadir eventos programados manualmente
      scheduledEvents.forEach(se => {
        const evDate = new Date(se.dateISO);
        evDate.setHours(0, 0, 0, 0);
        if (evDate.getTime() === cellDate.getTime()) {
          dayEvents.push({
            plant: plants.find(p => p.id_planta_usuario === se.plantId) || { nombre_personalizado: 'Desconocida' },
            type: se.type === 'water' ? 'water' : 'abono',
            label: `${se.type === 'water' ? 'Riego' : 'Abono'} de ${(plants.find(p => p.id_planta_usuario === se.plantId) || {}).nombre_personalizado}` + (se.notes ? ` - ${se.notes}` : ''),
            isPast: false,
            isScheduled: true
          });
        }
      });

      // Si hay eventos, renderizamos iconos y tooltip
      if (dayEvents.length > 0) {
        const iconsContainer = document.createElement('div');
        iconsContainer.className = 'calendar-cell-icons';

        const hasWater = dayEvents.some(e => e.type === 'water');
        const hasAbono = dayEvents.some(e => e.type === 'abono');

        if (hasWater) {
          const icon = document.createElement('span');
          icon.className = 'calendar-cell-icon water material-symbols-rounded';
          icon.textContent = 'water_drop';
          iconsContainer.appendChild(icon);
        }
        if (hasAbono) {
          const icon = document.createElement('span');
          icon.className = 'calendar-cell-icon abono material-symbols-rounded';
          icon.textContent = 'spa';
          iconsContainer.appendChild(icon);
        }

        cell.appendChild(iconsContainer);

        // Tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'calendar-day-tooltip';
        tooltip.innerHTML = `<strong>Día ${day} de ${MONTH_NAMES[month]}:</strong>` +
          dayEvents.map(e => `• ${e.label}`).join('<br>');
        cell.appendChild(tooltip);
      }

      gridDays.appendChild(cell);

      // click to schedule an event on this day
      cell.addEventListener('click', () => {
        openScheduleModal(cellDate);
      });
    }

    // --- RENDERIZAR DETALLES CRONOLÓGICOS (LADO DERECHO) ---
    const eventsList = [];
    const targetPlantsForList = filterVal === 'all'
      ? plants
      : plants.filter(p => p.id_planta_usuario === parseInt(filterVal));

    targetPlantsForList.forEach(plant => {
      const catalog = getCatalogItem(plant);

      // Próximo Riego
      const lastWater = new Date(plant.fecha_ultimo_riego);
      const nextWater = new Date(lastWater.getTime());
      const freq = plant.frecuencia_riego_dias || plant.catalog_frecuencia_riego_dias || catalog.frecuencia_riego_dias || 7;
      nextWater.setDate(nextWater.getDate() + freq);
      nextWater.setHours(0, 0, 0, 0);

      eventsList.push({
        plant,
        type: 'water',
        date: nextWater,
        label: `Riego de ${plant.nombre_personalizado}`,
        icon: 'water_drop'
      });

      // Próximo Abono
      const lastAbono = new Date(plant.fecha_ultimo_abono || plant.fecha_adquisicion);
      const nextAbono = new Date(lastAbono.getTime());
      nextAbono.setDate(nextAbono.getDate() + (catalog.abono_frecuencia_dias || 30));
      nextAbono.setHours(0, 0, 0, 0);

      eventsList.push({
        plant,
        type: 'abono',
        date: nextAbono,
        label: `Abono de ${plant.nombre_personalizado}`,
        icon: 'spa'
      });
    });

    // Ordenar cronológicamente
    eventsList.sort((a, b) => a.date - b.date);

    if (eventsList.length === 0) {
      detailedList.innerHTML = '<p class="empty-state-text" style="font-size:12px;color:var(--text-muted);text-align:center;padding:24px;">Sin tareas programadas.</p>';
      return;
    }

    eventsList.forEach(ev => {
      const item = document.createElement('div');
      item.className = 'calendar-task-item';

      const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const dayName = daysOfWeek[ev.date.getDay()];
      const dateStr = formatDate(ev.date.toISOString());

      let dateDisplay = `${dayName} (${dateStr})`;

      item.innerHTML = `
        <div class="calendar-task-icon-circle ${ev.type}">
          <span class="material-symbols-rounded">${ev.icon}</span>
        </div>
        <div class="calendar-task-details">
          <span class="calendar-task-title">${ev.label}</span>
          <span class="calendar-task-date">${dateDisplay}</span>
        </div>
      `;
      detailedList.appendChild(item);
    });
  }

  // --- SCHEDULED EVENTS STORAGE ---
  function loadScheduledEvents() {
    const raw = localStorage.getItem('petalia_scheduled_events');
    scheduledEvents = raw ? JSON.parse(raw) : [];
  }

  function saveScheduledEvents() {
    localStorage.setItem('petalia_scheduled_events', JSON.stringify(scheduledEvents));
  }

  // --- SCHEDULE MODAL HANDLING ---
  function initScheduleModal() {
    loadScheduledEvents();
    const modal = document.getElementById('schedule-modal');
    if (!modal) return;
    const closeBtn = document.getElementById('schedule-close');
    const cancelBtn = document.getElementById('schedule-cancel');
    const form = document.getElementById('schedule-form');
    const dateInput = document.getElementById('schedule-date');
    const plantSelect = document.getElementById('schedule-plant');
    const notesInput = document.getElementById('schedule-notes');

    function populatePlants() {
      plantSelect.innerHTML = '';
      plants.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id_planta_usuario;
        opt.textContent = p.nombre_personalizado;
        plantSelect.appendChild(opt);
      });
    }

    closeBtn.addEventListener('click', () => { modal.classList.remove('show'); });
    cancelBtn.addEventListener('click', () => { modal.classList.remove('show'); });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const date = dateInput.value;
      const plantId = parseInt(plantSelect.value, 10);
      const type = document.getElementById('schedule-type').value;
      const notes = notesInput.value || '';
      if (!date || !plantId || !type) return;
      const ev = {
        id: Date.now(),
        plantId,
        type,
        dateISO: new Date(date).toISOString(),
        notes
      };
      scheduledEvents.push(ev);
      saveScheduledEvents();
      modal.classList.remove('show');
      refreshAllViews();
      showToast('Agendado', 'Evento agregado al calendario', 'success');
    });

    // Expose function to open modal with date
    window.openScheduleModal = function (dateObj) {
      populatePlants();
      loadScheduledEvents();
      const iso = new Date(dateObj.getTime());
      const yyyy = iso.getFullYear();
      const mm = String(iso.getMonth() + 1).padStart(2, '0');
      const dd = String(iso.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;
      dateInput.value = dateStr;
      modal.classList.add('show');
    };

    // Backwards compatible alias
    window.openScheduleModal = window.openScheduleModal;
  }

  function openScheduleModal(dateObj) { if (window.openScheduleModal) window.openScheduleModal(dateObj); }


  function saveSession(jwtToken, userInfo) {
    token = jwtToken;
    user = userInfo;
    localStorage.setItem('petalia_jwt_token', jwtToken);
    localStorage.setItem('petalia_user_info', JSON.stringify(userInfo));
  }

  // --- AUTENTICACIÓN EVENTOS ---
  if (toRegisterLink) {
    toRegisterLink.addEventListener('click', (e) => {
      e.preventDefault();
      loginForm.classList.remove('active');
      registerForm.classList.add('active');
    });
  }

  if (toLoginLink) {
    toLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      registerForm.classList.remove('active');
      loginForm.classList.add('active');
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;

      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Credenciales incorrectas');
        }

        const data = await response.json();
        saveSession(data.token, data.user);
        showToast('¡Sesión Iniciada!', 'Bienvenido de vuelta a Petalia.', 'success');
        showApp();
      } catch (err) {
        console.error('Error al iniciar sesión:', err.message);
        showToast('Error de Acceso', err.message || 'Credenciales incorrectas o servidor no disponible.', 'warning');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nombre = document.getElementById('register-name').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;

      // Frontend password validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
      if (!passwordRegex.test(password)) {
        showToast('Contraseña Insegura', 'Mínimo 8 caracteres, con una mayúscula, una minúscula, un número y un caracter especial.', 'warning');
        return;
      }

      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre, email, password })
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Error al registrar usuario');
        }

        const data = await response.json();
        saveSession(data.token, data.user);
        showToast('Registro Exitoso', 'Tu cuenta de Petalia ha sido creada.', 'success');
        showApp();
      } catch (err) {
        console.error('Error al registrar:', err.message);
        showToast('Error de Registro', err.message || 'No se pudo crear la cuenta.', 'warning');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      token = null;
      user = null;
      localStorage.removeItem('petalia_jwt_token');
      localStorage.removeItem('petalia_user_info');
      showToast('Sesión Finalizada', 'Has salido del sistema.', 'info');
      setTimeout(() => {
        window.location.href = 'landing.html';
      }, 1000);
    });
  }

  // Botón abrir modal desde sección Mis Plantas
  const openAddModalMisPlantasBtn = document.getElementById('open-add-modal-mis-plantas');
  if (openAddModalMisPlantasBtn) {
    openAddModalMisPlantasBtn.addEventListener('click', () => {
      addPlantModal.classList.add('show');
      setupDates();
    });
  }

  // --- CARGA DE DATOS DEL SERVIDOR / LOCAL STORAGE ---
  async function loadDashboardData() {
    try {
      const response = await fetch('/api/plantas', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Error al obtener plantas');
      const data = await response.json();
      plants = data;

      const resHist = await fetch('/api/historial', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resHist.ok) {
        historyLogs = await resHist.json();
      }
    } catch (err) {
      console.error('Error al cargar datos del jardín:', err.message);
      showToast('Error', 'No se pudieron cargar los datos del servidor.', 'warning');
      plants = [];
      historyLogs = [];
    }

    refreshAllViews();
  }

  // --- CONSEJOS DIARIOS DE JARDINERÍA ---
  const GARDENING_TIPS = [
    "Consejo del dia: Las Monsteras prefieren que el sustrato se seque por completo antes de volver a regar.",
    "Consejo del dia: El Aloe Vera adora el sol directo; riegalo solo cuando la tierra este totalmente seca.",
    "Consejo del dia: Limpia las hojas de tus plantas con un paño humedo para optimizar la fotosintesis.",
    "Consejo del dia: Las suculentas son propensas a la pudricion de raiz: prioriza el drenaje del sustrato.",
    "Consejo del dia: Fertiliza tus plantas verdes durante el periodo de crecimiento activo (primavera/verano).",
    "Consejo del dia: Evita colocar tus plantas cerca de corrientes de aire frio o calefactores directos.",
    "Consejo del dia: Si las puntas de las hojas se ponen marrones, es probable que a tu planta le falte humedad ambiental."
  ];

  function loadDailyTip() {
    const welcomeTipEl = document.querySelector('.welcome-box-subtitle');
    if (welcomeTipEl) {
      const randomTip = GARDENING_TIPS[Math.floor(Math.random() * GARDENING_TIPS.length)];
      welcomeTipEl.textContent = randomTip;
    }
  }

  // --- CALENDARIO DE RIEGOS FUTUROS (AGENDA CRONOLÓGICA) ---
  function renderCalendarTimeline() {
    const container = document.getElementById('calendario-riego-container');
    if (!container) return;
    container.innerHTML = '';

    const events = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    plants.forEach(plant => {
      const catalog = getCatalogItem(plant);

      // Evento de Riego
      const lastWater = new Date(plant.fecha_ultimo_riego);
      const nextWater = new Date(lastWater.getTime());
      const freq = plant.frecuencia_riego_dias || plant.catalog_frecuencia_riego_dias || catalog.frecuencia_riego_dias || 7;
      nextWater.setDate(nextWater.getDate() + freq);
      nextWater.setHours(0, 0, 0, 0);
      const diffWater = nextWater - today;
      const daysWater = Math.ceil(diffWater / (1000 * 60 * 60 * 24));

      events.push({
        plant,
        type: 'water',
        date: nextWater,
        daysLeft: daysWater,
        label: `Riego de ${plant.nombre_personalizado}`,
        icon: 'water_drop'
      });

      // Evento de Abono
      const lastAbono = new Date(plant.fecha_ultimo_abono || plant.fecha_adquisicion);
      const nextAbono = new Date(lastAbono.getTime());
      nextAbono.setDate(nextAbono.getDate() + (catalog.abono_frecuencia_dias || 30));
      nextAbono.setHours(0, 0, 0, 0);
      const diffAbono = nextAbono - today;
      const daysAbono = Math.ceil(diffAbono / (1000 * 60 * 60 * 24));

      events.push({
        plant,
        type: 'fertilize',
        date: nextAbono,
        daysLeft: daysAbono,
        label: `Abono de ${plant.nombre_personalizado}`,
        icon: 'spa'
      });
    });

    // Añadir eventos programados manualmente
    scheduledEvents.forEach(se => {
      const plant = plants.find(p => p.id_planta_usuario === se.plantId) || { nombre_personalizado: 'Desconocida' };
      const evDate = new Date(se.dateISO);
      evDate.setHours(0, 0, 0, 0);
      const diff = evDate - today;
      const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
      events.push({ plant, type: se.type === 'water' ? 'water' : 'fertilize', date: evDate, daysLeft, label: `${se.type === 'water' ? 'Riego' : 'Abono'} de ${plant.nombre_personalizado}${se.notes ? ' - ' + se.notes : ''}`, icon: se.type === 'water' ? 'water_drop' : 'spa', isScheduled: true });
    });

    // Ordenar cronológicamente por días restantes
    events.sort((a, b) => a.daysLeft - b.daysLeft);

    if (events.length === 0) {
      container.innerHTML = '<p class="empty-state-text" style="font-size:12px;color:var(--text-muted);padding:8px;">Sin tareas de mantenimiento programadas.</p>';
      return;
    }

    // Mostrar hasta 5 eventos principales
    events.slice(0, 5).forEach(ev => {
      let relativeDay = '';
      if (ev.daysLeft === 0) {
        relativeDay = 'Hoy';
      } else if (ev.daysLeft === 1) {
        relativeDay = 'Mañana';
      } else if (ev.daysLeft === -1) {
        relativeDay = 'Ayer (Vencido)';
      } else if (ev.daysLeft < -1) {
        relativeDay = `Hace ${Math.abs(ev.daysLeft)} días`;
      } else if (ev.daysLeft > 1 && ev.daysLeft <= 7) {
        const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        relativeDay = daysOfWeek[ev.date.getDay()];
      } else {
        relativeDay = formatDate(ev.date.toISOString());
      }

      const item = document.createElement('div');
      item.className = 'calendar-event-item';
      const dateText = (ev.daysLeft > 7 || ev.daysLeft < -1) ? relativeDay : `${relativeDay} (${formatDate(ev.date.toISOString())})`;
      item.innerHTML = `
        <div class="calendar-event-icon ${ev.type}">
          <span class="material-symbols-rounded">${ev.icon}</span>
        </div>
        <div class="calendar-event-details">
          <span class="calendar-event-title">${ev.label}</span>
          <span class="calendar-event-date">${dateText}</span>
        </div>
      `;
      container.appendChild(item);
    });
  }

  // --- PANEL DE NOTIFICACIONES DROPDOWN ---
  function initNotificationDropdown() {
    if (!notificationBellBtn || !notificationDropdown) return;

    notificationBellBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (!notificationDropdown.classList.contains('hidden')) {
        if (!notificationDropdown.contains(e.target) && !notificationBellBtn.contains(e.target)) {
          notificationDropdown.classList.add('hidden');
        }
      }
    });
  }

  function renderNotificationDropdown() {
    if (!notificationDropdownList) return;
    notificationDropdownList.innerHTML = '';

    const dropdownAlerts = [];

    plants.forEach(plant => {
      const daysWater = getDaysUntilWatering(plant);
      const daysAbono = getDaysUntilAbono(plant);

      if (daysWater <= 0) {
        dropdownAlerts.push({
          plant,
          type: 'critical',
          title: `¡${plant.nombre_personalizado} necesita riego urgente!`,
          desc: `Riego programado vencido hace ${Math.abs(daysWater)} días.`,
          icon: 'notifications_active',
          priority: 1 // Riego prioritario
        });
      }

      if (daysAbono <= 3) {
        dropdownAlerts.push({
          plant,
          type: 'warning',
          title: `Abono de ${plant.nombre_personalizado} recomendado`,
          desc: `Fertilización sugerida en ${daysAbono <= 0 ? 'hoy' : `${daysAbono} días`}.`,
          icon: 'spa',
          priority: 2
        });
      }
    });

    // Ordenar por prioridad (riego primero) y luego por días de vencimiento
    dropdownAlerts.sort((a, b) => a.priority - b.priority);

    // Badge principal de la campana y del header del dropdown
    const count = dropdownAlerts.length;
    if (notificationBadge) {
      notificationBadge.textContent = count;
      if (count > 0) {
        notificationBadge.classList.remove('hidden');
      } else {
        notificationBadge.classList.add('hidden');
      }
    }
    if (dropdownAlertCount) {
      dropdownAlertCount.textContent = count;
    }

    if (count === 0) {
      notificationDropdownList.innerHTML = `
        <div class="dropdown-empty">
          <p>¡Todo en orden! No hay alertas críticas en tu jardín.</p>
        </div>
      `;
      return;
    }

    // Tomar las últimas 3 alertas detalladas
    const top3 = dropdownAlerts.slice(0, 3);
    top3.forEach(alert => {
      const item = document.createElement('a');
      item.href = '#';
      item.className = `dropdown-item ${alert.type}`;
      item.innerHTML = `
        <span class="material-symbols-rounded dropdown-item-icon ${alert.type}">${alert.icon}</span>
        <div class="dropdown-item-text">
          <span class="dropdown-item-title">${alert.title}</span>
          <span class="dropdown-item-desc">${alert.desc}</span>
        </div>
      `;
      // Permitir que al hacer clic se navegue a la sección adecuada
      item.addEventListener('click', (e) => {
        e.preventDefault();
        notificationDropdown.classList.add('hidden');
        if (alert.type === 'critical') {
          navigateToSection('riego');
        } else {
          navigateToSection('cuidados');
        }
      });
      notificationDropdownList.appendChild(item);
    });
  }

  // --- REFRESCAR TODAS LAS VISTAS ACTIVAS ---
  function refreshAllViews() {
    renderDashboard();
    renderCalendarTimeline();
    renderNotificationDropdown();

    const activeTab = document.querySelector('.nav-item.active');
    if (activeTab) {
      const section = activeTab.dataset.section;
      if (section === 'favoritos') renderFavoritesSection();
      if (section === 'mis-plantas') renderMisPlantasSection();
      if (section === 'cuidados') renderCuidadosSection();
      if (section === 'historial') renderHistorialSection();
      if (section === 'riego') renderRiegoSection();
      if (section === 'calendario-mensual') renderCalendarioMensualSection();
    }
  }

  // --- WIDGET CONSEJO DEL DÍA / DATOS CURIOSOS ---
  function renderCuriosidadesWidget() {
    const list = document.getElementById('curiosidades-list');
    if (!list) return;
    list.innerHTML = '';

    // Si no hay plantas registradas, simular Panchita y Lulú como fallback
    let sourcePlants = plants.length > 0 ? plants : [
      { nombre_personalizado: 'Panchita', id_catalogo: 1 },
      { nombre_personalizado: 'Lulú', id_catalogo: 4 }
    ];

    // Seleccionar una planta para el consejo de rotación
    const plantForRotation = sourcePlants[Math.floor(Math.random() * sourcePlants.length)];
    const catalogRot = getCatalogItem(plantForRotation);
    const nicknameRot = plantForRotation.nombre_personalizado;

    let rotationAdvice = `Dale un giro de 90 grados a tu ${nicknameRot} cada semana para un crecimiento uniforme.`;
    if (catalogRot) {
      if (catalogRot.id_catalogo === 1) {
        rotationAdvice = `Dale un giro de 90 grados a tu ${nicknameRot} (Costilla de Adán) cada semana para un crecimiento uniforme.`;
      } else if (catalogRot.id_catalogo === 4) {
        rotationAdvice = `Gira tu Ficus Lirata ${nicknameRot} 90 grados cada semana para evitar que se incline hacia la luz.`;
      } else if (catalogRot.id_catalogo === 5) {
        rotationAdvice = `Gira tu Aloe Vera ${nicknameRot} mensualmente para que todas sus hojas reciban luz por igual.`;
      } else if (catalogRot.id_catalogo === 3) {
        rotationAdvice = `Rota la maceta de tu Pothos ${nicknameRot} periódicamente para que sus tallos crezcan parejos.`;
      } else if (catalogRot.id_catalogo === 2) {
        rotationAdvice = `Gira tu Sansevieria ${nicknameRot} mensualmente para mantener sus hojas verticales erguidas.`;
      }
    }

    // Seleccionar una planta para el dato científico (preferiblemente diferente si hay más de una)
    let plantForFact = sourcePlants[Math.floor(Math.random() * sourcePlants.length)];
    if (sourcePlants.length > 1 && plantForFact.id_planta_usuario === plantForRotation.id_planta_usuario) {
      plantForFact = sourcePlants.find(p => p.id_planta_usuario !== plantForRotation.id_planta_usuario) || plantForFact;
    }
    const catalogFact = getCatalogItem(plantForFact);
    const nicknameFact = plantForFact.nombre_personalizado;

    let scientificFact = `Un dato: Las plantas de interior como ${nicknameFact} mejoran la calidad del aire y reducen el estrés.`;
    if (catalogFact) {
      if (catalogFact.id_catalogo === 1) {
        scientificFact = `Un dato: La Monstera Deliciosa (${nicknameFact}) purifica el aire interior y ayuda a regular la humedad.`;
      } else if (catalogFact.id_catalogo === 4) {
        scientificFact = `Un dato: El Ficus Lirata (${nicknameFact}) limpia el aire de formaldehído y toxinas.`;
      } else if (catalogFact.id_catalogo === 5) {
        scientificFact = `Un dato: El Aloe Vera (${nicknameFact}) absorbe monóxido de carbono y libera oxígeno puro.`;
      } else if (catalogFact.id_catalogo === 3) {
        scientificFact = `Un dato: El Pothos (${nicknameFact}) elimina compuestos volátiles nocivos en habitaciones cerradas.`;
      } else if (catalogFact.id_catalogo === 2) {
        scientificFact = `Un dato: La Sansevieria (${nicknameFact}) produce oxígeno por la noche, ideal para dormitorios.`;
      }
    }

    const rotationLi = document.createElement('li');
    rotationLi.innerHTML = `
      <span class="material-symbols-rounded curio-icon">sync</span>
      <span>${rotationAdvice}</span>
    `;

    const factLi = document.createElement('li');
    factLi.innerHTML = `
      <span class="material-symbols-rounded curio-icon">eco</span>
      <span>${scientificFact}</span>
    `;

    list.appendChild(rotationLi);
    list.appendChild(factLi);
  }

  // --- RENDERIZADO DEL DASHBOARD (INICIO) ---
  function renderDashboard() {
    let filteredPlants = plants.filter(p => {
      return p.nombre_personalizado.toLowerCase().includes(searchQuery.toLowerCase()) ||
        getCatalogName(p.id_catalogo).toLowerCase().includes(searchQuery.toLowerCase());
    });

    plantsGrid.innerHTML = '';
    if (filteredPlants.length === 0) {
      plantsGrid.innerHTML = `
        <div class="empty-state-text" style="padding: 24px 0; width: 100%; text-align: center;">
          <span class="material-symbols-rounded" style="font-size: 40px; color: var(--accent);">yard</span>
          <p style="font-size: 13px; color: var(--text-muted); margin-top: 8px;">Sin plantas en la colección.</p>
        </div>
      `;
    } else {
      filteredPlants.forEach(plant => {
        const card = createPlantCard(plant);
        plantsGrid.appendChild(card);
      });
    }

    if (statTotalCount) statTotalCount.textContent = `(${plants.length})`;

    // Widgets auxiliares
    renderAlertsWidget();
    renderRecentTimeline();
    renderWateringAlgorithm();
    renderCuriosidadesWidget();
  }

  function renderAlertsWidget() {
    if (!alertsList) return;
    alertsList.innerHTML = '';
    let alertsCount = 0;

    plants.forEach(plant => {
      const isCrit = getDaysUntilWatering(plant) <= 0;
      const daysLeftAbono = getDaysUntilAbono(plant);

      if (isCrit) {
        alertsCount++;
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item-ref alert-critical';
        alertItem.innerHTML = `
          <div class="alert-item-icon-wrapper">
            <span class="material-symbols-rounded">notifications_active</span>
          </div>
          <div class="alert-item-text">
            <span class="alert-item-title">¡${plant.nombre_personalizado} - Toca Riego Ahora!</span>
            <span class="alert-item-desc">Necesita hidratación inmediata. Riego programado vencido.</span>
          </div>
        `;
        alertsList.appendChild(alertItem);
      }

      if (daysLeftAbono <= 3) {
        alertsCount++;
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item-ref alert-warning';
        alertItem.innerHTML = `
          <div class="alert-item-icon-wrapper">
            <span class="material-symbols-rounded">spa</span>
          </div>
          <div class="alert-item-text">
            <span class="alert-item-title">¡Fertilización recomendada!</span>
            <span class="alert-item-desc">Es momento de nutrir a ${plant.nombre_personalizado} pronto.</span>
          </div>
        `;
        alertsList.appendChild(alertItem);
      }
    });

    if (alertsCount === 0) {
      alertsList.innerHTML = `
        <div class="alert-item-ref alert-info">
          <div class="alert-item-icon-wrapper">
            <span class="material-symbols-rounded">workspace_premium</span>
          </div>
          <div class="alert-item-text">
            <span class="alert-item-title">¡Todo el jardín en orden!</span>
            <span class="alert-item-desc">Tus plantas se encuentran perfectamente cuidadas esta semana.</span>
          </div>
        </div>
      `;
    }

    // También incluir eventos programados que ocurren hoy o mañana
    const today = new Date(); today.setHours(0, 0, 0, 0);
    scheduledEvents.forEach(se => {
      const evDate = new Date(se.dateISO); evDate.setHours(0, 0, 0, 0);
      const daysLeft = Math.ceil((evDate - today) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 1) {
        alertsCount++;
        const alertItem = document.createElement('div');
        alertItem.className = 'alert-item-ref alert-info';
        alertItem.innerHTML = `
          <div class="alert-item-icon-wrapper">
            <span class="material-symbols-rounded">event</span>
          </div>
          <div class="alert-item-text">
            <span class="alert-item-title">Evento programado: ${se.type === 'water' ? 'Riego' : 'Abono'}</span>
            <span class="alert-item-desc">${formatDate(se.dateISO)} - ${se.notes || ''}</span>
          </div>
        `;
        alertsList.appendChild(alertItem);
      }
    });
  }

  function renderRecentTimeline() {
    const historyTimeline = document.getElementById('history-timeline');
    if (!historyTimeline) return;
    historyTimeline.innerHTML = '';

    const sorted = [...historyLogs].sort((a, b) => new Date(b.fecha_realizada) - new Date(a.fecha_realizada));

    if (sorted.length === 0) {
      historyTimeline.innerHTML = '<p class="empty-state-text" style="font-size:12px; color:var(--text-muted); padding: 8px;">Sin actividades previas.</p>';
      return;
    }

    sorted.forEach(log => {
      const item = document.createElement('div');
      item.className = 'timeline-item';

      const icon = log.tipo_cuidado === 'Fertilizacion' ? 'spa' : 'water_drop';
      const color = log.tipo_cuidado === 'Riego' ? 'var(--primary)' : 'var(--warning-yellow)';

      item.innerHTML = `
        <div class="timeline-content" style="padding-bottom: 8px; border-bottom: 1px solid var(--border); margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between;">
          <div>
            <strong style="font-size: 13px; color: var(--primary-dark);">${log.tipo_cuidado}</strong> en <span>${log.nombre_personalizado}</span>
            <p style="font-size: 11px; color: var(--text-muted);">${formatDate(log.fecha_realizada)} - ${log.observaciones || ''}</p>
          </div>
          <span class="material-symbols-rounded" style="color: ${color}; font-size: 18px;">${icon}</span>
        </div>
      `;
      historyTimeline.appendChild(item);
    });
  }

  function renderWateringAlgorithm() {
    if (plants.length === 0) {
      if (riegoNextTarget) riegoNextTarget.textContent = 'Ninguna planta';
      return;
    }

    const sortedByUrgency = [...plants].sort((a, b) => {
      return getDaysUntilWatering(a) - getDaysUntilWatering(b);
    });

    const target = sortedByUrgency[0];
    const days = getDaysUntilWatering(target);
    const catalog = getCatalogItem(target);

    let targetText = `${target.nombre_personalizado}: `;
    if (days <= 0) {
      targetText += '¡Hoy mismo!';
      if (riegoTimelineNodeTime) {
        riegoTimelineNodeTime.textContent = 'Riego Ya';
        riegoTimelineNodeTime.style.left = '100%';
        const fill = document.querySelector('.riego-timeline-fill');
        if (fill) fill.style.width = '100%';
      }
    } else {
      targetText += `En ${days} días`;
      const freq = target.frecuencia_riego_dias || target.catalog_frecuencia_riego_dias || catalog.frecuencia_riego_dias || 7;
      const percent = Math.max(0, Math.min(100, Math.round(((freq - days) / freq) * 100)));
      if (riegoTimelineNodeTime) {
        riegoTimelineNodeTime.textContent = `En ${days}d`;
        riegoTimelineNodeTime.style.left = `${percent}%`;
        const fill = document.querySelector('.riego-timeline-fill');
        if (fill) fill.style.width = `${percent}%`;
      }
    }

    if (riegoNextTarget) riegoNextTarget.textContent = targetText;
  }

  async function toggleFavorite(id) {
    const plant = plants.find(p => p.id_planta_usuario === id);
    if (!plant) return;

    const isFav = plant.favorita === 1;

    try {
      if (isFav) {
        const response = await fetch(`/api/favoritos/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al remover de favoritos');
      } else {
        const response = await fetch('/api/favoritos', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ id_planta_usuario: id })
        });
        if (!response.ok) throw new Error('Error al agregar a favoritos');
      }

      plant.favorita = isFav ? 0 : 1;
      refreshAllViews();
      showToast('Favorito', isFav ? 'Removido de favoritos' : 'Agregado a favoritos', 'success');
    } catch (err) {
      console.error('Error al cambiar favorito:', err.message);
      showToast('Error', 'No se pudo procesar la solicitud en el servidor.', 'warning');
    }
  }

  // Event Delegation global para botones interactivos de tarjetas
  appContainer.addEventListener('click', async (e) => {
    const target = e.target;

    // Botón de Riego
    const btnWater = target.closest('.btn-water') || target.closest('.btn-water-action');
    if (btnWater) {
      e.preventDefault();
      const id = parseInt(btnWater.dataset.id || btnWater.closest('[data-id]').dataset.id);
      btnWater.classList.add('pulse-click');
      setTimeout(() => btnWater.classList.remove('pulse-click'), 400);
      await performWatering(id);
      return;
    }

    // Botón de Abonar
    const btnFertilize = target.closest('.btn-fertilize');
    if (btnFertilize) {
      e.preventDefault();
      const id = parseInt(btnFertilize.dataset.id || btnFertilize.closest('[data-id]').dataset.id);
      btnFertilize.classList.add('pulse-click');
      setTimeout(() => btnFertilize.classList.remove('pulse-click'), 400);
      await performFertilizing(id);
      return;
    }

    // Botón Favorito (corazón)
    const btnFav = target.closest('.btn-favorite-heart');
    if (btnFav) {
      e.preventDefault();
      const id = parseInt(btnFav.dataset.id);
      await toggleFavorite(id);
      return;
    }

    // Botón Eliminar
    const btnDelete = target.closest('.media-badge-right-delete');
    if (btnDelete) {
      e.preventDefault();
      const id = parseInt(btnDelete.dataset.id);
      if (confirm('¿Quieres eliminar esta planta de tu jardín?')) {
        await performDeletion(id);
      }
      return;
    }

    // Botón abrir selector de foto desde tarjeta
    const btnOpenPhoto = target.closest('.btn-open-photo');
    if (btnOpenPhoto) {
      e.preventDefault();
      const id = parseInt(btnOpenPhoto.dataset.id);
      // asignar id al input de foto para cuando se suba asociarlo
      plantPhotoInput.dataset.targetId = id;
      plantPhotoInput.click();
      return;
    }

    // Botón marcar como regada (check)
    const btnMarkWatered = target.closest('.btn-mark-watered');
    if (btnMarkWatered) {
      e.preventDefault();
      const id = parseInt(btnMarkWatered.dataset.id);
      await performWatering(id);
      return;
    }
  });

  async function performWatering(id) {
    const todayStr = new Date().toISOString().split('T')[0];
    const plant = plants.find(p => p.id_planta_usuario === id);
    if (!plant) return;

    try {
      const response = await fetch(`/api/plantas/${id}/regar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('No se pudo registrar el riego');
      const data = await response.json();
      plant.fecha_ultimo_riego = data.fecha_ultimo_riego || todayStr;

      // Reload history
      const resHist = await fetch('/api/historial', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resHist.ok) {
        historyLogs = await resHist.json();
      }

      showToast('Planta Regada', `${plant.nombre_personalizado} ha sido regada correctamente.`, 'success');

      // Reactividad inmediata: alternar clases CSS en la tarjeta sin recargar página
      document.querySelectorAll(`.plant-card-ref[data-id="${id}"]`).forEach(card => {
        card.classList.remove('card-critico');
        card.classList.add('card-saludable');
        // Quitar card-saludable después de 3 segundos y dejar estado normal
        setTimeout(() => card.classList.remove('card-saludable'), 3000);
      });

      refreshAllViews();
    } catch (err) {
      console.error('Error al regar planta:', err.message);
      showToast('Error', 'No se pudo registrar el riego en el servidor.', 'warning');
    }
  }

  async function performFertilizing(id) {
    const todayStr = new Date().toISOString().split('T')[0];
    const plant = plants.find(p => p.id_planta_usuario === id);
    if (!plant) return;

    try {
      const response = await fetch(`/api/plantas/${id}/abonar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('No se pudo registrar el abono');
      const data = await response.json();
      plant.fecha_ultimo_abono = data.fecha_ultimo_abono || todayStr;

      // Reload history
      const resHist = await fetch('/api/historial', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (resHist.ok) {
        historyLogs = await resHist.json();
      }

      showToast('Planta Abonada', `${plant.nombre_personalizado} ha sido fertilizada correctamente.`, 'success');
      refreshAllViews();
    } catch (err) {
      console.error('Error al abonar planta:', err.message);
      showToast('Error', 'No se pudo registrar el abono en el servidor.', 'warning');
    }
  }

  async function performDeletion(id) {
    try {
      const response = await fetch(`/api/plantas/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('No se pudo eliminar la planta');

      plants = plants.filter(p => p.id_planta_usuario !== id);
      showToast('Eliminada', 'La planta ha sido removida de la colección.', 'info');
      refreshAllViews();
    } catch (err) {
      console.error('Error al eliminar planta:', err.message);
      showToast('Error', 'No se pudo eliminar la planta en el servidor.', 'warning');
    }
  }

  // (El handler del botón de consejo rápido ya está definido arriba en línea 651-660)

  // --- BUSCADOR DE PLANTAS ---
  if (searchPlantsInput) {
    searchPlantsInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      renderDashboard();
    });
  }

  // --- MODAL AGREGAR PLANTA ---
  if (openAddModalBtn) {
    openAddModalBtn.addEventListener('click', () => {
      addPlantModal.classList.add('show');
      setupDates();
    });
  }

  function closeModal() {
    addPlantModal.classList.remove('show');
    addPlantForm.reset();
    resetPhotoPreview();
    selectedCatalogItem = null;
    selectedCatalogId.value = '';
    const previewDiv = document.getElementById('catalog-plant-preview');
    if (previewDiv) {
      previewDiv.classList.add('hidden');
    }
  }

  closeModalBtn.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);
  addPlantModal.addEventListener('click', (e) => {
    if (e.target === addPlantModal) closeModal();
  });

  // Sugerencias catálogo
  if (catalogSearch) {
    catalogSearch.addEventListener('input', async (e) => {
      const val = e.target.value.trim();
      if (val.length < 2) {
        catalogSuggestions.innerHTML = '';
        catalogSuggestions.classList.add('hidden');
        return;
      }

      try {
        const response = await fetch(`/api/catalogo?search=${encodeURIComponent(val)}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error');
        const data = await response.json();
        renderSuggestions(data);
      } catch (err) {
        const items = MOCK_CATALOG.filter(item =>
          item.nombre_comun.toLowerCase().includes(val.toLowerCase()) ||
          item.nombre_cientifico.toLowerCase().includes(val.toLowerCase())
        );
        renderSuggestions(items);
      }
    });
  }

  function renderSuggestions(items) {
    catalogSuggestions.innerHTML = '';
    if (items.length === 0) {
      catalogSuggestions.innerHTML = '<div style="padding: 10px; font-size:12px; color:var(--text-muted);">Sin resultados</div>';
      catalogSuggestions.classList.remove('hidden');
      return;
    }

    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'catalog-suggestion-item';
      div.innerHTML = `
        <img src="${item.imagen_url}" class="suggestion-thumb">
        <div class="suggestion-details">
          <span class="suggestion-comun">${item.nombre_comun}</span>
          <span class="suggestion-cientifico">${item.nombre_cientifico}</span>
        </div>
      `;
      div.addEventListener('click', () => {
        selectedCatalogItem = item;
        catalogSearch.value = `${item.nombre_comun} (${item.nombre_cientifico})`;
        selectedCatalogId.value = item.id_catalogo;
        catalogSuggestions.classList.add('hidden');

        // Populate watering frequency
        const plantWateringFreq = document.getElementById('plant-watering-frequency');
        if (plantWateringFreq) {
          plantWateringFreq.value = item.frecuencia_riego_dias || 7;
        }

        // Populate and display selected catalog plant preview
        const previewDiv = document.getElementById('catalog-plant-preview');
        const previewImg = document.getElementById('preview-catalog-img');
        const previewName = document.getElementById('preview-catalog-name');
        const previewDesc = document.getElementById('preview-catalog-desc');

        if (previewDiv && previewImg && previewName && previewDesc) {
          previewImg.src = item.imagen_url || 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600';
          previewName.textContent = `${item.nombre_comun} (${item.nombre_cientifico})`;
          previewDesc.textContent = item.descripcion || 'Sin descripción disponible.';
          previewDiv.classList.remove('hidden');
        }
      });
      catalogSuggestions.appendChild(div);
    });
    catalogSuggestions.classList.remove('hidden');
  }

  // --- CAPTURA MULTIMEDIA HÍBRIDA (CÁMARA / ARCHIVO) ---
  const customFileUploadTrigger = document.getElementById('custom-file-upload-trigger');
  const cameraStreamWrapper = document.getElementById('camera-stream-wrapper');
  const cameraVideo = document.getElementById('camera-video');
  const cameraCaptureBtn = document.getElementById('camera-capture-btn');
  const cameraUploadFallbackBtn = document.getElementById('camera-upload-fallback-btn');
  const cameraCancelBtn = document.getElementById('camera-cancel-btn');
  let activeCameraStream = null;

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      activeCameraStream = stream;
      cameraVideo.srcObject = stream;
      customFileUploadTrigger.style.display = 'none';
      cameraStreamWrapper.classList.remove('hidden');
    } catch (err) {
      console.warn("Cámara no disponible o denegada, abriendo selector de archivos.", err);
      plantPhotoInput.click();
    }
  }

  function stopCamera() {
    if (activeCameraStream) {
      activeCameraStream.getTracks().forEach(track => track.stop());
      activeCameraStream = null;
    }
    if (cameraVideo) {
      cameraVideo.srcObject = null;
    }
  }

  if (customFileUploadTrigger) {
    customFileUploadTrigger.addEventListener('click', () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        startCamera();
      } else {
        plantPhotoInput.click();
      }
    });
  }

  if (cameraCaptureBtn) {
    cameraCaptureBtn.addEventListener('click', () => {
      const canvas = document.createElement('canvas');
      canvas.width = cameraVideo.videoWidth || 640;
      canvas.height = cameraVideo.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(cameraVideo, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          if (tempPhotoUrl) {
            URL.revokeObjectURL(tempPhotoUrl);
          }
          const capturedFile = new File([blob], 'captured_plant.png', { type: 'image/png' });

          // Asignar el archivo capturado al input file
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(capturedFile);
          plantPhotoInput.files = dataTransfer.files;

          tempPhotoUrl = URL.createObjectURL(blob);
          photoPreview.src = tempPhotoUrl;

          stopCamera();
          cameraStreamWrapper.classList.add('hidden');
          photoPreviewWrapper.classList.remove('hidden');
        }
      }, 'image/png');
    });
  }

  if (cameraUploadFallbackBtn) {
    cameraUploadFallbackBtn.addEventListener('click', () => {
      plantPhotoInput.click();
    });
  }

  if (cameraCancelBtn) {
    cameraCancelBtn.addEventListener('click', () => {
      stopCamera();
      cameraStreamWrapper.classList.add('hidden');
      if (customFileUploadTrigger) customFileUploadTrigger.style.display = '';
    });
  }

  // Previsualización de Fotos Local (Mocking / Fallback)
  plantPhotoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (tempPhotoUrl) {
        URL.revokeObjectURL(tempPhotoUrl);
      }
      tempPhotoUrl = URL.createObjectURL(file);
      photoPreview.src = tempPhotoUrl;

      stopCamera();
      if (cameraStreamWrapper) cameraStreamWrapper.classList.add('hidden');
      photoPreviewWrapper.classList.remove('hidden');
      if (customFileUploadTrigger) customFileUploadTrigger.style.display = 'none';
      // If file upload was triggered from a plant card, save the photo to that plant (demo)
      const targetId = parseInt(plantPhotoInput.dataset.targetId);
      if (targetId) {
        const plant = plants.find(p => p.id_planta_usuario === targetId);
        if (plant) {
          plant.imagen_url = tempPhotoUrl;
          localStorage.setItem('petalia_local_plants', JSON.stringify(plants));
          refreshAllViews();
          showToast('Foto actualizada', `${plant.nombre_personalizado} ahora tiene nueva foto.`, 'success');
        }
        delete plantPhotoInput.dataset.targetId;
      }
    }
  });

  removePhotoBtn.addEventListener('click', () => {
    resetPhotoPreview();
  });

  function resetPhotoPreview() {
    if (tempPhotoUrl) {
      URL.revokeObjectURL(tempPhotoUrl);
      tempPhotoUrl = null;
    }
    plantPhotoInput.value = '';
    photoPreview.src = '#';
    photoPreviewWrapper.classList.add('hidden');
    stopCamera();
    if (cameraStreamWrapper) cameraStreamWrapper.classList.add('hidden');
    if (customFileUploadTrigger) customFileUploadTrigger.style.display = '';
  }

  addPlantForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const catId = selectedCatalogId.value;
    const nickname = plantNickname.value;
    const acqDate = plantAcquisitionDate.value;
    const lastWateredDate = plantLastWatered.value;
    const personalDescInput = document.getElementById('plant-description');
    const personalDesc = personalDescInput ? personalDescInput.value : '';
    const wateringFreqInput = document.getElementById('plant-watering-frequency');
    const wateringFreq = wateringFreqInput ? wateringFreqInput.value : '';

    if (!catId) {
      showToast('Formulario Incompleto', 'Selecciona una planta del catálogo.', 'warning');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('id_catalogo', catId);
      formData.append('nombre_personalizado', nickname);
      formData.append('fecha_adquisicion', acqDate);
      formData.append('fecha_ultimo_riego', lastWateredDate);
      formData.append('descripcion_personal', personalDesc);
      formData.append('frecuencia_riego_dias', wateringFreq);
      if (plantPhotoInput.files[0]) {
        formData.append('foto', plantPhotoInput.files[0]);
      }

      const response = await fetch('/api/plantas', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!response.ok) throw new Error('Error al registrar planta en el servidor');

      closeModal();
      await loadDashboardData();
      showToast('Guardado', `Planta '${nickname}' añadida exitosamente.`, 'success');
    } catch (err) {
      console.error('Error al registrar planta:', err.message);
      showToast('Error', 'No se pudo guardar la planta en el servidor.', 'warning');
    }
  });

  // --- MÉTODOS DE CÁLCULO ---
  function getCatalogItem(idOrPlant) {
    if (idOrPlant && typeof idOrPlant === 'object') {
      return idOrPlant;
    }
    const id = parseInt(idOrPlant, 10);
    const plant = plants.find(p => p.id_catalogo === id);
    if (plant) return plant;
    return MOCK_CATALOG.find(item => item.id_catalogo === id) || MOCK_CATALOG[0];
  }

  function getCatalogName(id) {
    const item = getCatalogItem(id);
    return item ? item.nombre_comun : 'Planta Exótica';
  }

  function isPlantCritical(plant) {
    return getDaysUntilWatering(plant) <= 0;
  }

  function getDaysUntilWatering(plant) {
    const catalog = getCatalogItem(plant);
    const lastWatered = new Date(plant.fecha_ultimo_riego);
    const freq = plant.frecuencia_riego_dias || plant.catalog_frecuencia_riego_dias || catalog.frecuencia_riego_dias || 7;
    const nextWatered = new Date(lastWatered.getTime());
    nextWatered.setDate(nextWatered.getDate() + freq);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    nextWatered.setHours(0, 0, 0, 0);

    const diff = nextWatered - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function getDaysUntilAbono(plant) {
    const catalog = getCatalogItem(plant);
    const lastAbono = new Date(plant.fecha_ultimo_abono || plant.fecha_adquisicion);
    const nextAbono = new Date(lastAbono.getTime());
    nextAbono.setDate(nextAbono.getDate() + (catalog.abono_frecuencia_dias || 30));

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    nextAbono.setHours(0, 0, 0, 0);

    const diff = nextAbono - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const offset = date.getTimezoneOffset() * 60000;
    const adjusted = new Date(date.getTime() + offset);
    return adjusted.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  // --- TRADUCCIÓN Y REQUERIMIENTO DE RIEGO ---
  function translateWatering(w) {
    if (!w) return 'Moderado';
    const l = w.toLowerCase();
    if (l.includes('frequent')) return 'Riego: Frecuente';
    if (l.includes('average')) return 'Riego: Moderado';
    if (l.includes('minimum')) return 'Riego: Mínimo';
    if (l.includes('none')) return 'Riego: Ninguno';
    return `Riego: ${w}`;
  }

  function translateSunlight(s) {
    if (!s) return 'Luz: Indirecta';
    const item = Array.isArray(s) ? s[0] : s;
    const l = item.toLowerCase();
    if (l.includes('full_shade')) return 'Sombra completa';
    if (l.includes('part_shade')) return 'Sombra parcial';
    if (l.includes('sun-part_shade')) return 'Sol parcial';
    if (l.includes('full_sun')) return 'Sol directo';
    return `Luz: ${item}`;
  }

  // --- FUNCIONES DEL APARTADO DE CATÁLOGO ---
  async function renderCatalogSection() {
    const grid = document.getElementById('catalog-grid');
    const loader = document.getElementById('catalog-loader');
    const pageInfo = document.getElementById('catalog-page-info');
    const btnPrev = document.getElementById('btn-catalog-prev');
    const btnNext = document.getElementById('btn-catalog-next');

    if (!grid) return;
    grid.innerHTML = '';

    if (loader) loader.classList.remove('hidden');

    try {
      let url = `/api/catalogo/species-list?page=${catalogPage}`;
      if (catalogSearchQuery) url += `&q=${encodeURIComponent(catalogSearchQuery)}`;
      if (catalogFilterIndoor !== '') url += `&indoor=${catalogFilterIndoor}`;
      if (catalogFilterSunlight) url += `&sunlight=${catalogFilterSunlight}`;
      if (catalogFilterPoisonous !== '') url += `&poisonous=${catalogFilterPoisonous}`;

      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al obtener lista de especies');

      const response = await res.json();
      const items = response.data || [];
      catalogMaxPage = response.last_page || 1;

      if (loader) loader.classList.add('hidden');

      if (items.length === 0) {
        grid.innerHTML = `
          <div class="empty-state-text" style="text-align:center; padding:32px; grid-column:1/-1; width: 100%;">
            <span class="material-symbols-rounded" style="font-size:40px; color:var(--accent);">menu_book</span>
            <p style="font-size:14px; color:var(--text-muted); margin-top:8px;">No se encontraron especies con los filtros seleccionados.</p>
          </div>
        `;
        if (pageInfo) pageInfo.textContent = `Página ${catalogPage} de ${catalogMaxPage}`;
        if (btnPrev) btnPrev.disabled = true;
        if (btnNext) btnNext.disabled = true;
        return;
      }

      items.forEach(plant => {
        const card = createCatalogCard(plant);
        grid.appendChild(card);
      });

      if (pageInfo) pageInfo.textContent = `Página ${catalogPage} de ${catalogMaxPage}`;
      if (btnPrev) btnPrev.disabled = catalogPage <= 1;
      if (btnNext) btnNext.disabled = catalogPage >= catalogMaxPage;

    } catch (err) {
      console.error('Error al cargar catálogo:', err.message);
      if (loader) loader.classList.add('hidden');
      grid.innerHTML = `
        <div class="empty-state-text" style="text-align:center; padding:32px; grid-column:1/-1; width: 100%;">
          <span class="material-symbols-rounded" style="font-size:40px; color:var(--critical);">error</span>
          <p style="font-size:14px; color:var(--text-muted); margin-top:8px;">Error al conectar con la API del catálogo. Intenta de nuevo más tarde.</p>
        </div>
      `;
    }
  }

  function createCatalogCard(plant) {
    const card = document.createElement('div');
    card.className = 'plant-card-ref catalog-card-item';
    card.dataset.id = plant.id;

    const imgUrl = plant.default_image?.thumbnail || plant.default_image?.small_url || plant.default_image?.regular_url || 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600';
    const wateringText = translateWatering(plant.watering);
    const sunlightText = translateSunlight(plant.sunlight);
    const toxicityClass = plant.poisonous ? 'toxicity-poisonous' : 'toxicity-safe';

    // Descripción generada si no existe en la lista
    const description = `Especie clasificada como ${plant.common_name || 'planta exótica'}. Excelente opción para amantes de la naturaleza. ${sunlightText}.`;

    card.innerHTML = `
      <div class="plant-card-ref-media">
        <img src="${imgUrl}" alt="${plant.common_name || 'Especie'}">
        ${plant.poisonous ? `
        <span class="media-badge-left toxicity-poisonous" style="position: absolute; top: 12px; left: 12px; padding: 4px 8px; border-radius: 20px; font-size: 10px; font-weight: 700; color: white; background-color: var(--critical); display: inline-flex; align-items: center; gap: 4px; z-index: 2;">
          <span class="material-symbols-rounded" style="font-size: 12px;">warning</span>
          <span>Tóxica</span>
        </span>` : ''}
      </div>
      <div class="plant-card-ref-body" style="display: flex; flex-direction: column; gap: 10px; padding: 16px;">
        <div class="plant-ref-name-group">
          <span class="plant-ref-nickname" style="font-size: 16px; font-weight: 700; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${plant.common_name || 'Especie'}</span>
          <span class="plant-ref-species" style="font-size: 12px; font-style: italic; color: var(--text-muted); display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${(plant.scientific_name && plant.scientific_name[0]) || 'Unknown species'}</span>
        </div>

        <div class="plant-ref-indicators" style="display: flex; flex-direction: column; gap: 6px; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 8px 0; margin: 4px 0;">
          <div class="plant-indicator-row" style="display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: var(--text-muted);">
            <span class="material-symbols-rounded" style="font-size: 14px; color: var(--primary);">water_drop</span>
            <span>${wateringText}</span>
          </div>
          <div class="plant-indicator-row" style="display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: var(--text-muted);">
            <span class="material-symbols-rounded" style="font-size: 14px; color: #ff9800;">light_mode</span>
            <span>${sunlightText}</span>
          </div>
        </div>

        <p class="catalog-desc-clamp" style="font-size: 12px; color: var(--text-muted); line-height: 1.5; height: 36px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; text-overflow: ellipsis; margin-bottom: 8px;">
          ${description}
        </p>

        <div class="plant-card-actions-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: auto; width: 100%;">
          <button class="btn btn-secondary btn-catalog-details" data-id="${plant.id}" style="padding: 8px 12px; font-size: 11px; border-radius: var(--radius-sm); font-weight: 600; display: inline-flex; align-items: center; gap: 4px; justify-content: center;">
            <span class="material-symbols-rounded" style="font-size: 14px;">visibility</span>
            <span>Detalles</span>
          </button>
          <button class="btn btn-primary btn-catalog-cuidar" data-id="${plant.id}" style="padding: 8px 12px; font-size: 11px; border-radius: var(--radius-sm); font-weight: 600; display: inline-flex; align-items: center; gap: 4px; justify-content: center;">
            <span class="material-symbols-rounded" style="font-size: 14px;">yard</span>
            <span>Cuidar</span>
          </button>
        </div>
      </div>
    `;

    // Click on card body (not buttons) opens details
    card.addEventListener('click', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      openCatalogPlantDetail(plant.id);
    });

    return card;
  }

  async function openCatalogPlantDetail(id) {
    const modal = document.getElementById('catalog-detail-modal');
    if (!modal) return;

    try {
      const res = await fetch(`/api/catalogo/external/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Error al obtener detalles de la especie');
      const details = await res.json();

      const nameEl = document.getElementById('catalog-detail-name');
      const scientificEl = document.getElementById('catalog-detail-scientific');
      const imgEl = document.getElementById('catalog-detail-image');
      const benchmarkEl = document.getElementById('catalog-detail-watering-benchmark');
      const descEl = document.getElementById('catalog-detail-description');
      const badgesContainer = document.getElementById('catalog-detail-badges');
      const btnCuidar = document.getElementById('catalog-detail-btn-cuidar');

      if (nameEl) nameEl.textContent = details.common_name || 'Especie del Catálogo';
      if (scientificEl) scientificEl.textContent = Array.isArray(details.scientific_name) ? details.scientific_name.join(', ') : (details.scientific_name || '');
      if (imgEl) imgEl.src = details.default_image?.original_url || details.default_image?.regular_url || details.default_image?.thumbnail || 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600';

      // General watering benchmark
      if (benchmarkEl) {
        let benchmarkText = 'Riego recomendado: ';
        if (details.watering_general_benchmark) {
          const val = details.watering_general_benchmark.value || details.watering_general_benchmark;
          const unit = details.watering_general_benchmark.unit || 'días';
          benchmarkText += `Frecuencia aproximada de ${val} ${unit}`;
        } else if (details.watering) {
          benchmarkText += translateWatering(details.watering);
        } else {
          benchmarkText += 'Moderado';
        }
        benchmarkEl.innerHTML = `<span class="material-symbols-rounded" style="color: var(--primary);">water_drop</span> ${benchmarkText}`;
      }

      // Badges
      if (badgesContainer) {
        badgesContainer.innerHTML = '';

        // Indoor
        const indoorBadge = document.createElement('span');
        indoorBadge.style = 'padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background-color: var(--bg-main); border: 1px solid var(--border); color: var(--primary-dark); display: inline-flex; align-items: center; gap: 4px;';
        const isIndoor = details.indoor === true || details.indoor === 1;
        indoorBadge.innerHTML = `<span class="material-symbols-rounded" style="font-size: 14px;">${isIndoor ? 'home' : 'nature'}</span> <span>${isIndoor ? 'Interior' : 'Exterior'}</span>`;
        badgesContainer.appendChild(indoorBadge);

        // Sunlight
        if (details.sunlight) {
          const sunBadge = document.createElement('span');
          sunBadge.style = 'padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background-color: var(--bg-main); border: 1px solid var(--border); color: #e65100; display: inline-flex; align-items: center; gap: 4px;';
          sunBadge.innerHTML = `<span class="material-symbols-rounded" style="font-size: 14px;">light_mode</span> <span>${translateSunlight(details.sunlight)}</span>`;
          badgesContainer.appendChild(sunBadge);
        }

        // Poisonous (solo se muestra si es tóxica)
        const isPoisonous = details.poisonous === true || details.poisonous === 1;
        if (isPoisonous) {
          const poisonBadge = document.createElement('span');
          poisonBadge.style = `padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; color: white; display: inline-flex; align-items: center; gap: 4px; background-color: var(--critical);`;
          poisonBadge.innerHTML = `<span class="material-symbols-rounded" style="font-size: 14px;">warning</span> <span>Tóxica para mascotas</span>`;
          badgesContainer.appendChild(poisonBadge);
        }
      }

      // Description
      if (descEl) {
        descEl.textContent = details.description || 'Sin descripción detallada disponible en el catálogo externo para esta especie. Puedes registrarla en tu jardín e iniciar su cuidado botánico personalizado.';
      }

      // Button Cuida
      if (btnCuidar) {
        btnCuidar.onclick = () => {
          modal.classList.remove('show');
          selectCatalogPlantForCreation(details);
        };
      }

      modal.classList.add('show');
    } catch (err) {
      console.error('Error al cargar detalles de la planta:', err.message);
      showToast('Error', 'No se pudo obtener la información de detalles.', 'warning');
    }
  }

  function selectCatalogPlantForCreation(item) {
    let freq = 7;
    if (item.frecuencia_riego_dias) {
      freq = item.frecuencia_riego_dias;
    } else if (item.watering_general_benchmark) {
      freq = parseInt(item.watering_general_benchmark.value || item.watering_general_benchmark, 10) || 7;
    } else if (item.watering) {
      const w = item.watering.toLowerCase();
      if (w.includes('frequent')) freq = 3;
      else if (w.includes('average')) freq = 7;
      else if (w.includes('minimum')) freq = 14;
    }

    selectedCatalogItem = {
      id_catalogo: item.id || item.id_catalogo,
      nombre_comun: item.common_name || item.nombre_comun,
      nombre_cientifico: Array.isArray(item.scientific_name) ? item.scientific_name[0] : (item.nombre_cientifico || 'Unknown species'),
      descripcion: item.description || item.descripcion || '',
      imagen_url: item.default_image?.thumbnail || item.default_image?.small_url || item.default_image?.regular_url || item.imagen_url || 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?auto=format&fit=crop&q=80&w=600',
      frecuencia_riego_dias: freq
    };

    const catalogSearch = document.getElementById('catalog-search');
    const selectedCatalogId = document.getElementById('selected-catalog-id');
    const previewDiv = document.getElementById('catalog-plant-preview');
    const previewImg = document.getElementById('preview-catalog-img');
    const previewName = document.getElementById('preview-catalog-name');
    const previewDesc = document.getElementById('preview-catalog-desc');

    if (catalogSearch && selectedCatalogId) {
      catalogSearch.value = `${selectedCatalogItem.nombre_comun} (${selectedCatalogItem.nombre_cientifico})`;
      selectedCatalogId.value = selectedCatalogItem.id_catalogo;
    }

    if (previewDiv && previewImg && previewName && previewDesc) {
      previewImg.src = selectedCatalogItem.imagen_url;
      previewName.textContent = `${selectedCatalogItem.nombre_comun} (${selectedCatalogItem.nombre_cientifico})`;
      previewDesc.textContent = selectedCatalogItem.descripcion || 'Especie seleccionada desde el catálogo oficial.';
      previewDiv.classList.remove('hidden');
    }

    // Open add-plant-modal
    const addPlantModal = document.getElementById('add-plant-modal');
    if (addPlantModal) {
      addPlantModal.classList.add('show');
      setupDates();

      const plantWateringFreq = document.getElementById('plant-watering-frequency');
      if (plantWateringFreq) {
        plantWateringFreq.value = freq;
      }

      // Focus custom name input
      const plantNickname = document.getElementById('plant-nickname');
      if (plantNickname) plantNickname.focus();
    }
  }

  // --- REGISTRAR BINDINGS DE EVENTOS DEL CATÁLOGO ---
  function setupCatalogEventListeners() {
    const btnSearch = document.getElementById('btn-catalog-search');
    const btnReset = document.getElementById('btn-catalog-reset');
    const inputQ = document.getElementById('catalog-search-q');
    const selectIndoor = document.getElementById('catalog-filter-indoor');
    const selectSunlight = document.getElementById('catalog-filter-sunlight');
    const selectPoisonous = document.getElementById('catalog-filter-poisonous');
    const btnPrev = document.getElementById('btn-catalog-prev');
    const btnNext = document.getElementById('btn-catalog-next');
    const modal = document.getElementById('catalog-detail-modal');

    // Event delegation on grid for card action buttons
    const grid = document.getElementById('catalog-grid');
    if (grid) {
      grid.addEventListener('click', async (e) => {
        const target = e.target;

        // Detalle Button
        const btnDet = target.closest('.btn-catalog-details');
        if (btnDet) {
          e.preventDefault();
          const id = parseInt(btnDet.dataset.id, 10);
          await openCatalogPlantDetail(id);
          return;
        }

        // Cuidar Button
        const btnCuidar = target.closest('.btn-catalog-cuidar');
        if (btnCuidar) {
          e.preventDefault();
          const id = parseInt(btnCuidar.dataset.id, 10);

          // Fetch simple details from API to populate correctly
          try {
            const res = await fetch(`/api/catalogo/external/${id}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const details = await res.json();
              selectCatalogPlantForCreation(details);
            } else {
              showToast('Error', 'No se pudo precargar la información de la planta.', 'warning');
            }
          } catch (err) {
            console.error('Error preloading details:', err.message);
          }
          return;
        }
      });
    }

    if (btnSearch) {
      btnSearch.addEventListener('click', () => {
        catalogPage = 1;
        catalogSearchQuery = inputQ ? inputQ.value.trim() : '';
        catalogFilterIndoor = selectIndoor ? selectIndoor.value : '';
        catalogFilterSunlight = selectSunlight ? selectSunlight.value : '';
        catalogFilterPoisonous = selectPoisonous ? selectPoisonous.value : '';
        renderCatalogSection();
      });
    }

    if (inputQ) {
      inputQ.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          if (btnSearch) btnSearch.click();
        }
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', () => {
        catalogPage = 1;
        catalogSearchQuery = '';
        catalogFilterIndoor = '';
        catalogFilterSunlight = '';
        catalogFilterPoisonous = '';

        if (inputQ) inputQ.value = '';
        if (selectIndoor) selectIndoor.value = '';
        if (selectSunlight) selectSunlight.value = '';
        if (selectPoisonous) selectPoisonous.value = '';

        renderCatalogSection();
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (catalogPage > 1) {
          catalogPage--;
          renderCatalogSection();
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (catalogPage < catalogMaxPage) {
          catalogPage++;
          renderCatalogSection();
        }
      });
    }

    // Modal close hooks
    const closeBtn = document.getElementById('catalog-detail-close');
    const closeBtnFooter = document.getElementById('catalog-detail-close-btn');
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.classList.remove('show'));
    if (closeBtnFooter && modal) closeBtnFooter.addEventListener('click', () => modal.classList.remove('show'));
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('show');
      });
    }
  }

  // --- BOOTSTRAPPING ADDITIONAL COMPONENT ON INIT ---
  const originalInit = init;
  init = function () {
    setupCatalogEventListeners();
    originalInit();
  };

  init();
});
