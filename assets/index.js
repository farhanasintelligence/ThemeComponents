$(document).ready(function () {
  // Mobile menu toggle
  $("#mobileMenuToggle").on("click", function () {
    $("#mobileMenu").addClass("active");
    $("body").addClass("menu-open");
  });

  // Close mobile menu
  $("#mobileMenuClose").on("click", function () {
    $("#mobileMenu").removeClass("active");
    $("body").removeClass("menu-open");
  });

  // Close menu when clicking outside
  $(document).on("click", function (e) {
    if (
      !$(e.target).closest("#mobileMenu").length &&
      !$(e.target).closest("#mobileMenuToggle").length &&
      $("#mobileMenu").hasClass("active")
    ) {
      $("#mobileMenu").removeClass("active");
      $("body").removeClass("menu-open");
    }
  });

  // Mobile submenu toggle
  $(".mobile-submenu-toggle").on("click", function () {
    $(this).next(".mobile-submenu").slideToggle(200);
    $(this).find(".mobile-menu-arrow").toggleClass("rotate-180");
  });

  // Share modal handlers (jQuery for open/close only)
  $(document).on("click", "#shareAdvertBtn", function (e) {
    e.preventDefault();
    $("#shareModalOverlay").addClass("active");
  });
  $(document).on("click", "#shareCloseBtn", function () {
    $("#shareModalOverlay").removeClass("active");
  });
  $(document).on("click", function (e) {
    const $overlay = $("#shareModalOverlay");
    if ($overlay.hasClass("active") && $(e.target).is("#shareModalOverlay")) {
      $overlay.removeClass("active");
    }
  });
});

// Numbers transition
const createOdometer = (el, value) => {
  const odometer = new Odometer({
    el: el,
    value: 0,
    format: "(,ddd)",
    theme: "minimal",
  });

  let hasRun = false;

  const options = {
    threshold: 0.5,
  };

  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !hasRun) {
        setTimeout(() => {
          odometer.update(value);
          hasRun = true;
        }, 200);
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);
  observer.observe(el);
};

document.addEventListener("DOMContentLoaded", () => {
  const clientsServedOdometer = document.querySelector(
    ".clients-served-odometer"
  );
  const happyCustomersOdometer = document.querySelector(
    ".happy-customers-odometer"
  );
  const vehiclesOdometer = document.querySelector(".vehicles-odometer");
  const yearsOdometer = document.querySelector(".years-odometer");

  if (clientsServedOdometer) createOdometer(clientsServedOdometer, 4500);
  if (happyCustomersOdometer) createOdometer(happyCustomersOdometer, 2750);
  if (vehiclesOdometer) createOdometer(vehiclesOdometer, 600);
  if (yearsOdometer) createOdometer(yearsOdometer, 12);

  // Testimonials Section
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");
  let prev = document.querySelector(".prev");
  let next = document.querySelector(".next");

  if (!slides.length == 0) {
    let slideIndex = 1;
    showSlides(slideIndex);

    function plusSlides(n) {
      showSlides((slideIndex += n));
    }

    let currentSlide = function (n) {
      showSlides((slideIndex = n));
    };

    function showSlides(n) {
      if (n > slides.length) {
        slideIndex = 1;
      }

      if (n < 1) {
        slideIndex = slides.length;
      }

      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }

      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }

      slides[slideIndex - 1].style.display = "block";
      dots[slideIndex - 1].className += " active";
    }
  }

  prev.addEventListener("click", () => {
    plusSlides(-1);
  });

  next.addEventListener("click", () => {
    plusSlides(1);
  });

  // Share logic (vanilla for robust API access)
  const overlay = document.getElementById("shareModalOverlay");
  const closeBtn = document.getElementById("shareCloseBtn");
  const copyBtn = document.getElementById("copyLinkBtn");
  const toast = document.getElementById("copyToast");
  const fb = document.getElementById("shareFacebook");
  const tw = document.getElementById("shareTwitter");
  const li = document.getElementById("shareLinkedIn");
  const wa = document.getElementById("shareWhatsApp");
  const ig = document.getElementById("shareInstagram");
  const mail = document.getElementById("shareEmail");

  // Build share URL and text
  const currentUrl = window.location.href;
  const pageTitle = document.title || "Check this advert";
  const shareText = `Have a look at this advert: ${pageTitle}`;

  // Prefer message intents over public posts where possible
  // Facebook Messenger (opens messenger.com with prefilled link)
  if (fb)
    fb.href = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
      currentUrl
    )}&app_id=0&redirect_uri=${encodeURIComponent(currentUrl)}`;
  // X (Twitter) DM deep link (best-effort; if not logged-in/unsupported, falls back to compose)
  if (tw)
    tw.href = `https://twitter.com/messages/compose?text=${encodeURIComponent(
      shareText + " " + currentUrl
    )}`;
  // LinkedIn message share (best-effort using share with mini composer)
  if (li)
    li.href = `https://www.linkedin.com/messaging/compose?body=${encodeURIComponent(
      shareText + "\n" + currentUrl
    )}`;
  // WhatsApp direct message
  if (wa)
    wa.href = `https://wa.me/?text=${encodeURIComponent(
      shareText + " " + currentUrl
    )}`;
  // Instagram has no web DM intent; open Instagram as info. We can try navigator.share fallback on click.
  if (ig) {
    ig.addEventListener("click", (e) => {
      e.preventDefault();
      if (navigator.share) {
        navigator
          .share({ title: pageTitle, text: shareText, url: currentUrl })
          .catch(() => {});
      } else {
        // Fallback: copy link and show toast
        if (copyBtn) copyBtn.click();
      }
    });
  }
  if (mail)
    mail.href = `mailto:?subject=${encodeURIComponent(
      pageTitle
    )}&body=${encodeURIComponent(shareText + "\n\n" + currentUrl)}`;

  function showToast() {
    if (!toast) return;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1600);
  }

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(currentUrl);
        showToast();
      } catch (err) {
        // Fallback for older browsers
        const ta = document.createElement("textarea");
        ta.value = currentUrl;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        showToast();
      }
    });
  }

  // native share button removed with share-footer

  if (closeBtn) {
    closeBtn.addEventListener(
      "click",
      () => overlay && overlay.classList.remove("active")
    );
  }

  // Close on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && overlay.classList.contains("active")) {
      overlay.classList.remove("active");
    }
  });
});

// Swiper handles the stacked list animation automatically

// Feature Section Swiper Sync
document.addEventListener("DOMContentLoaded", function () {
  const featureItems = document.querySelectorAll("[data-slide]");
  const swiperElement = document.getElementById("featuresSwiper");
  let currentSlide = 0;
  let progressIntervals = [];
  let swiperInstance = null;

  if (featureItems.length === 0 || !swiperElement) return;

  function updateProgressBars(activeIndex, progress = 0) {
    // Reset all progress bars
    progressIntervals.forEach((interval) => clearInterval(interval));
    progressIntervals = [];

    featureItems.forEach((item, i) => {
      const progressBar = item.querySelector(".progress-bar");
      if (progressBar) {
        if (i === activeIndex) {
          // Set progress based on autoplay progress
          progressBar.style.transition = "none";
          progressBar.style.width = progress + "%";
        } else {
          progressBar.style.width = "0%";
          progressBar.style.transition = "none";
        }
      }
    });
  }

  function updateActiveStates(index, progress = 0) {
    // Update feature items
    featureItems.forEach((item, i) => {
      if (i === index) {
        item.classList.add("border-blue-500", "bg-blue-50", "shadow-sm");
        item.classList.remove(
          "border-gray-200",
          "bg-white",
          "hover:border-gray-300"
        );

        // Update icon and text colors for active item
        const icon = item.querySelector(".aspect-square");
        if (icon) {
          icon.classList.add("bg-blue-600", "text-white");
          icon.classList.remove("bg-gray-100", "text-gray-600");
        }
      } else {
        item.classList.remove("border-blue-500", "bg-blue-50", "shadow-sm");
        item.classList.add("border-gray-200", "bg-white");

        // Reset icon and text colors for inactive items
        const icon = item.querySelector(".aspect-square");
        if (icon) {
          icon.classList.remove("bg-blue-600", "text-white");
          icon.classList.add("bg-gray-100", "text-gray-600");
        }
      }
    });

    // Update progress bars
    updateProgressBars(index, progress);
    currentSlide = index;
  }

  // Wait for Swiper to be ready
  function initializeSwiperSync() {
    swiperInstance = swiperElement.swiper;

    if (!swiperInstance) {
      // If swiper is not ready, wait a bit and try again
      setTimeout(initializeSwiperSync, 100);
      return;
    }

    // Add click handlers to feature items
    featureItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        updateActiveStates(index);
        // Update Swiper slide
        if (swiperInstance) {
          swiperInstance.slideTo(index);
        }
      });
    });

    // Listen to Swiper slide changes
    swiperInstance.on("slideChange", function () {
      const activeIndex = swiperInstance.activeIndex;
      updateActiveStates(activeIndex, 0); // Reset progress when slide changes
    });

    swiperInstance.on("autoplayTimeLeft", function (s, time, progress) {
      // Update progress bar based on autoplay progress
      const activeIndex = swiperInstance.activeIndex;
      const progressPercent = (1 - progress) * 100;
      updateProgressBars(activeIndex, progressPercent);
    });

    // Initialize
    updateActiveStates(0, 0);
  }

  // Start initialization when DOM is ready
  setTimeout(initializeSwiperSync, 100);
});
