/**
 * Authentication and Visit Scheduling Module
 * Handles login, registration, logout, and visit scheduling
 */
(function () {
  const API_BASE = 'http://localhost:5001/api';

  const feedbackModalEl = document.getElementById('authFeedbackModal');
  const feedbackModal = feedbackModalEl ? new bootstrap.Modal(feedbackModalEl) : null;

  const logoutConfirmModalEl = document.getElementById('logoutConfirmModal');
  const logoutConfirmModal = logoutConfirmModalEl ? new bootstrap.Modal(logoutConfirmModalEl) : null;
  const logoutYesBtn = document.getElementById('logout-confirm-yes');
  const logoutNoBtn = document.getElementById('logout-confirm-no');
  let logoutConfirmResolver = null;

  function askLogoutConfirm() {
    return new Promise((resolve) => {
      if (!logoutConfirmModal) {
        resolve(confirm('Are you sure you want to log out?'));
        return;
      }
      logoutConfirmResolver = resolve;
      logoutConfirmModal.show();
    });
  }

  if (logoutYesBtn) {
    logoutYesBtn.addEventListener('click', () => {
      if (logoutConfirmModal) logoutConfirmModal.hide();
      if (logoutConfirmResolver) logoutConfirmResolver(true);
      logoutConfirmResolver = null;
    });
  }

  if (logoutNoBtn) {
    logoutNoBtn.addEventListener('click', () => {
      if (logoutConfirmModal) logoutConfirmModal.hide();
      if (logoutConfirmResolver) logoutConfirmResolver(false);
      logoutConfirmResolver = null;
    });
  }

  function showAuthFeedback(title, message) {
    if (!feedbackModal) {
      alert(message || title || 'Notification');
      return;
    }
    document.getElementById('auth-feedback-title').textContent = title || 'Notice';
    document.getElementById('auth-feedback-message').textContent = message || '';
    feedbackModal.show();
  }

  function getToken() {
    return localStorage.getItem('nestfinder_jwt') || '';
  }

  function setToken(token) {
    if (token) {
      localStorage.setItem('nestfinder_jwt', token);
    }
  }

  function clearToken() {
    localStorage.removeItem('nestfinder_jwt');
  }

  function openAuthModal(mode) {
    const isLogin = mode === 'login';
    $('#authModalTitle').text(isLogin ? 'Login' : 'Create an account');
    $('#auth-name-group').toggle(!isLogin);
    $('#auth-name').prop('required', !isLogin);
    $('#auth-submit-btn').text(isLogin ? 'Login' : 'Register');
    $('#auth-error').hide();
    $('#auth-form')[0].reset();
    const html = isLogin
      ? "Don't have an account? <a href='#' id='auth-toggle-link'>Register</a>"
      : "Already have an account? <a href='#' id='auth-toggle-link'>Login</a>";
    $('#auth-toggle-text').html(html);
    $('#authModal').modal('show');
    $('#authModal').data('mode', mode);
  }

  function updateAuthNav() {
    const isLoggedIn = !!getToken();
    $('#nav-login-item, #nav-register-item').toggle(!isLoggedIn);
    $('#nav-logout-item').toggle(isLoggedIn);
  }

  function openScheduleModal(propertyId, propertyName) {
    const token = getToken();
    if (!token) {
      openAuthModal('login');
      return;
    }
    $('#schedule-form')[0].reset();
    $('#schedule-property-name').val(propertyName || 'Selected property');
    $('#scheduleModal').data('property-id', propertyId);
    $('#schedule-error').hide();
    $('#schedule-success').hide();
    $('#scheduleModal').modal('show');
  }

  // Event listeners
  $('#nav-login-link').on('click', function (e) {
    e.preventDefault();
    openAuthModal('login');
  });

  $('#nav-register-link').on('click', function (e) {
    e.preventDefault();
    openAuthModal('register');
  });

  $('#nav-logout-link').on('click', function (e) {
    e.preventDefault();
    askLogoutConfirm().then((ok) => {
      if (!ok) return;
      clearToken();
      updateAuthNav();
      showAuthFeedback('Logged out', 'You have been logged out successfully.');
    });
  });

  $('#nav-schedule-link').on('click', function (e) {
    e.preventDefault();
    const firstProperty = $('.schedule-link').first();
    if (firstProperty.length) {
      openScheduleModal(firstProperty.data('property-id'), firstProperty.data('property-name'));
    } else {
      openScheduleModal('', '');
    }
  });

  $(document).on('click', '.schedule-link', function (e) {
    e.preventDefault();
    const propertyId = $(this).data('property-id');
    const propertyName = $(this).data('property-name');
    openScheduleModal(propertyId, propertyName);
  });

  $(document).on('click', '#auth-toggle-link', function (e) {
    e.preventDefault();
    const currentMode = $('#authModal').data('mode') || 'login';
    openAuthModal(currentMode === 'login' ? 'register' : 'login');
  });

  $('#auth-form').on('submit', function (e) {
    e.preventDefault();
    const mode = $('#authModal').data('mode') || 'login';
    const name = $('#auth-name').val();
    const email = $('#auth-email').val();
    const password = $('#auth-password').val();
    const endpoint = mode === 'login' ? '/auth/login' : '/auth/register';

    $('#auth-error').hide();

    // Prepare request body - only include name for registration
    const requestBody = mode === 'login' 
      ? { email, password }
      : { name, email, password };

    $.ajax({
      url: API_BASE + endpoint,
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(requestBody),
      success: function (res) {
        setToken(res.token);
        $('#authModal').modal('hide');
        updateAuthNav();
        const isLogin = mode === 'login';
        showAuthFeedback(
          isLogin ? 'Login successful' : 'Registration successful',
          isLogin ? 'You are now logged in.' : 'Your account is ready. You are now logged in.'
        );
      },
      error: function (xhr) {
        const message =
          (xhr.responseJSON && xhr.responseJSON.message) ||
          xhr.statusText ||
          'Authentication failed';
        console.error('Auth error - auth.js:183', { status: xhr.status, response: xhr.responseText });
        $('#auth-error').text(message).show();
      },
    });
  });

  $('#schedule-form').on('submit', function (e) {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      $('#schedule-error').text('You must be logged in to schedule a visit.').show();
      return;
    }

    const propertyId = $('#scheduleModal').data('property-id') || 'custom';
    const propertyName = $('#schedule-property-name').val() || 'Custom property';
    const visitDate = $('#schedule-date').val();
    const notes = $('#schedule-notes').val();

    // Validate future datetime
    if (!visitDate || Number.isNaN(new Date(visitDate).getTime())) {
      $('#schedule-error').text('Please choose a valid date and time.').show();
      return;
    }
    if (new Date(visitDate).getTime() <= Date.now()) {
      $('#schedule-error').text('Please pick a future date/time for your visit.').show();
      return;
    }

    $('#schedule-error').hide();
    $('#schedule-success').hide();

    $.ajax({
      url: API_BASE + '/visits',
      method: 'POST',
      contentType: 'application/json',
      headers: {
        Authorization: 'Bearer ' + token,
      },
      data: JSON.stringify({ propertyId, propertyName, visitDate, notes }),
      success: function () {
        $('#schedule-success').text('Your visit has been scheduled!').show();
        $('#schedule-form')[0].reset();
      },
      error: function (xhr) {
        const message = (xhr.responseJSON && xhr.responseJSON.message) || 'Could not schedule visit';
        $('#schedule-error').text(message).show();
      },
    });
  });

  // Initialize auth navigation on page load
  updateAuthNav();
})();

