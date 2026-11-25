$(document).ready(function () {

  /* ================================================
     1. OpenSeadragon — pan & zoom for large images
     ================================================ */
  const viewer = OpenSeadragon({
    id: "openseadragon",

    // First image
    tileSources: {
      type: "image",
      url: "images/gambar1.jpg",
    },

    // Show whole image on load, do not crop
    homeFillsViewer: false,      // home = fit-inside (no crop)
    visibilityRatio: 0.5,        // allow some panning to edges
    constrainDuringPan: true,
    minZoomImageRatio: 0.8,      // allow zooming out a little
    maxZoomPixelRatio: 4,        // allow up to 4x pixel zoom (see details)

    // Hide built-in nav — we use our own + / − / ⟲ buttons
    showNavigationControl: false,

    // Smooth gestures
    animationTime: 0.8,
    springStiffness: 10,
    gestureSettingsMouse: {
      clickToZoom: false,
      dblClickToZoom: true,
      scrollToZoom: true,
      pinchToZoom: true,
      flickEnabled: true,
      flickMomentum: 0.5,
    },
    gestureSettingsTouch: {
      pinchToZoom: true,
      flickEnabled: true,
    },

    // Nicer background
    backgroundColor: "#0b1220",
  });

  /* ================================================
     2. Custom zoom buttons
     ================================================ */
  $("#zoomIn").on("click", function () {
    viewer.viewport.zoomBy(1.5);
    viewer.viewport.applyConstraints();
  });

  $("#zoomOut").on("click", function () {
    viewer.viewport.zoomBy(0.7);
    viewer.viewport.applyConstraints();
  });

  $("#resetView").on("click", function () {
    viewer.viewport.goHome();
  });

  /* ================================================
     3. Checkbox → switch map
     ================================================ */
  const $checkboxes = $('input[name="gambar"]');

  $checkboxes.on("change", function () {
    // Prevent unchecking the only selected one
    if (!this.checked) {
      this.checked = true;
      return;
    }

    // Single-select
    $checkboxes.not(this).prop("checked", false);

    // Load the chosen map into OpenSeadragon
    viewer.open({
      type: "image",
      url: $(this).val(),
    });
  });

  /* ================================================
     4. Hide / show sidebar ("Legenda")
     ================================================ */
  const $sidebar  = $("#sidebar");
  const $showMenu = $("#showMenu");
  const $toggle   = $("#toggleMenu");

  function isMobile() {
    return window.innerWidth <= 768;
  }

  // Hide sidebar
  $toggle.on("click", function () {
    if (isMobile()) {
      const h = $sidebar.outerHeight();
      $sidebar.css("height", h);
      $sidebar.animate({ height: 0 }, 400, function () {
        $showMenu.fadeIn(200);
        viewer.forceResize();
      });
    } else {
      $sidebar.animate({ width: 0 }, 400, function () {
        $showMenu.fadeIn(200);
        viewer.forceResize();
      });
    }
  });

  // Show sidebar again
  $showMenu.on("click", function () {
    $showMenu.fadeOut(150, function () {
      if (isMobile()) {
        $sidebar.animate({ height: "40vh" }, 400, function () {
          $sidebar.css("height", "");
          viewer.forceResize();
        });
      } else {
        $sidebar.animate({ width: 340 }, 400, function () {
          viewer.forceResize();
        });
      }
    });
  });

  /* ================================================
     5. Resize safety (rotate / desktop↔mobile)
     ================================================ */
  let wasMobile = isMobile();
  $(window).on("resize", function () {
    const nowMobile = isMobile();
    if (nowMobile !== wasMobile) {
      wasMobile = nowMobile;
      $sidebar.css({ width: "", height: "" });
      $showMenu.hide();
      viewer.forceResize();
    }
  });

  /* ================================================
     6. Auto-hide hint
     ================================================ */
  setTimeout(function () {
    $("#hint").fadeOut(700);
  }, 5000);

});