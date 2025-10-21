export const saveZoom = () => {
  const zoom = Math.round(window.devicePixelRatio * 100);
  localStorage.setItem('userZoom', zoom);
};

export const loadZoom = () => {
  const savedZoom = localStorage.getItem('userZoom');
  if (savedZoom) {
    const currentZoom = Math.round(window.devicePixelRatio * 100);
    if (savedZoom !== currentZoom.toString()) {
      const zoomFactor = parseFloat(savedZoom) / 100;
      document.body.style.zoom = zoomFactor;
    }
  }
};

export const initZoomManager = () => {
  loadZoom();
  
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      saveZoom();
    }, 250);
  });
  
  window.addEventListener('beforeunload', () => {
    saveZoom();
  });
};
