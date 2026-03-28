import Swal from 'sweetalert2';

export const swalCustomTheme = Swal.mixin({
  customClass: {
    popup: 'swal-popup-custom',
    title: 'swal-title-custom',
    htmlContainer: 'swal-html-custom',
    confirmButton: 'swal-confirm-custom',
    cancelButton: 'swal-cancel-custom',
    input: 'swal-input-custom',
  },
  buttonsStyling: false,
  background: '#1a1a1a',
  color: '#f5f5f0',
  iconColor: '#d4af37',
  confirmButtonColor: '#d4af37',
  cancelButtonColor: '#333333',
  padding: '24px',
  borderRadius: '12px',
});

export const swalStyles = `
  <style>
    .swal-popup-custom {
      background: #1a1a1a !important;
      border: 1px solid #333333 !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5) !important;
    }
    .swal-title-custom {
      color: #d4af37 !important;
      font-family: var(--font-playfair), serif !important;
      font-size: 1.5rem !important;
      font-weight: 600 !important;
    }
    .swal-html-custom {
      color: #a3a3a3 !important;
    }
    .swal-text-custom {
      color: #f5f5f0 !important;
    }
    .swal-confirm-custom {
      background: linear-gradient(135deg, #d4af37 0%, #f5d67b 50%, #d4af37 100%) !important;
      color: #0c0c0c !important;
      border: none !important;
      padding: 12px 32px !important;
      border-radius: 8px !important;
      font-weight: 600 !important;
      transition: all 0.3s ease !important;
    }
    .swal-confirm-custom:hover {
      box-shadow: 0 0 20px rgba(212, 175, 55, 0.4) !important;
      transform: translateY(-1px) !important;
    }
    .swal-cancel-custom {
      background: #333333 !important;
      color: #f5f5f0 !important;
      border: 1px solid #444444 !important;
      padding: 12px 32px !important;
      border-radius: 8px !important;
      font-weight: 500 !important;
      transition: all 0.3s ease !important;
    }
    .swal-cancel-custom:hover {
      background: #404040 !important;
    }
    .swal-input-custom {
      background: #262626 !important;
      border: 1px solid #333333 !important;
      color: #f5f5f0 !important;
      border-radius: 8px !important;
      padding: 12px !important;
    }
    .swal-input-custom:focus {
      border-color: #d4af37 !important;
      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2) !important;
    }
    .swal-input-custom::placeholder {
      color: #525252 !important;
    }
    .swal-textarea-custom {
      background: #262626 !important;
      border: 1px solid #333333 !important;
      color: #f5f5f0 !important;
      border-radius: 8px !important;
      padding: 12px !important;
    }
    .swal-textarea-custom:focus {
      border-color: #d4af37 !important;
      box-shadow: 0 0 0 2px rgba(212, 175, 55, 0.2) !important;
    }
    .swal-textarea-custom::placeholder {
      color: #525252 !important;
    }
    .swal2-radio label {
      color: #f5f5f0 !important;
    }
    .swal2-radio input:checked {
      accent-color: #d4af37 !important;
    }
    .swal-show-popup {
      animation: swalFadeIn 0.3s ease-out !important;
    }
    .swal-show-backdrop {
      animation: swalFadeIn 0.3s ease-out !important;
    }
    .swal-hide-popup {
      animation: swalFadeOut 0.2s ease-in !important;
    }
    @keyframes swalFadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes swalFadeOut {
      from { opacity: 1; transform: scale(1); }
      to { opacity: 0; transform: scale(0.95); }
    }
    .swal2-icon.swal2-success {
      border-color: #d4af37 !important;
      color: #d4af37 !important;
    }
    .swal2-icon.swal2-success [class^=swal2-success-line] {
      background-color: #d4af37 !important;
    }
    .swal2-icon.swal2-error {
      border-color: #dc2626 !important;
      color: #dc2626 !important;
    }
    .swal2-icon.swal2-warning {
      border-color: #eab308 !important;
      color: #eab308 !important;
    }
    .swal2-icon.swal2-info {
      border-color: #3b82f6 !important;
      color: #3b82f6 !important;
    }
  </style>
`;

export const injectSwalStyles = () => {
  if (!document.getElementById('swal-custom-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'swal-custom-styles';
    styleElement.innerHTML = swalStyles;
    document.head.appendChild(styleElement);
  }
};

export const showWelcomeMessage = (userName: string) => {
  injectSwalStyles();
  Swal.fire({
    icon: 'success',
    title: '¡Bienvenido!',
    html: `
      <p style="color: #f5f5f0; font-size: 1.1rem;">Hola, <strong style="color: #d4af37;">${userName}</strong></p>
      <p style="color: #a3a3a3; margin-top: 8px;">Es un placer tenerte de vuelta en Decorations Enterprise</p>
    `,
    confirmButtonText: 'Continuar',
    timer: 4000,
    timerProgressBar: true,
    background: '#1a1a1a',
    color: '#f5f5f0',
    confirmButtonColor: '#d4af37',
    allowOutsideClick: false,
  });
};

export const showGoodbyeMessage = (userName: string) => {
  injectSwalStyles();
  return Swal.fire({
    icon: 'info',
    title: '¡Hasta pronto!',
    html: `
      <p style="color: #f5f5f0; font-size: 1.1rem;">Gracias por visitarnos, <strong style="color: #d4af37;">${userName}</strong></p>
      <p style="color: #a3a3a3; margin-top: 8px;">Tu sesión ha sido cerrada exitosamente</p>
    `,
    confirmButtonText: 'Aceptar',
    background: '#1a1a1a',
    color: '#f5f5f0',
    confirmButtonColor: '#d4af37',
    allowOutsideClick: false,
  });
};

export const showSuccess = (title: string, message: string) => {
  injectSwalStyles();
  Swal.fire({
    icon: 'success',
    title,
    html: `<p style="color: #a3a3a3;">${message}</p>`,
    confirmButtonText: 'Aceptar',
    background: '#1a1a1a',
    color: '#f5f5f0',
    confirmButtonColor: '#d4af37',
    timer: 2500,
    timerProgressBar: true,
  });
};

export const showError = (title: string, message: string) => {
  injectSwalStyles();
  Swal.fire({
    icon: 'error',
    title,
    html: `<p style="color: #a3a3a3;">${message}</p>`,
    confirmButtonText: 'Aceptar',
    background: '#1a1a1a',
    color: '#f5f5f0',
    confirmButtonColor: '#d4af37',
  });
};

export const showWarning = (title: string, message: string) => {
  injectSwalStyles();
  Swal.fire({
    icon: 'warning',
    title,
    html: `<p style="color: #a3a3a3;">${message}</p>`,
    confirmButtonText: 'Aceptar',
    background: '#1a1a1a',
    color: '#f5f5f0',
    confirmButtonColor: '#d4af37',
  });
};
