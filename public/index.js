// Render the site's top navigation. The page contains a
// <template id="topnav-template"> placeholder — populate it and replace
// it with the rendered content. If the template is missing, insert the
// markup at the top of the page as a fallback.
document.addEventListener('DOMContentLoaded', () => {
  const markup = `
    <div class='topnav-container'>
      <ul class='topnav'>
        <li><a href='index.html'>Home</a></li>
        <li><a href='Offerings.html'>Services</a></li>
      </ul>
    </div>`;

  const tpl = document.getElementById('topnav-template');
  if (tpl && tpl instanceof HTMLTemplateElement) {
    // Place markup into the template and replace the template element with its content
    tpl.innerHTML = markup;
    tpl.replaceWith(tpl.content.cloneNode(true));
    return;
  }

  // Fallback: insert directly before the main grid container
  const grid = document.querySelector('.grid-container');
  if (grid) {
    grid.insertAdjacentHTML('beforebegin', markup);
  } else {
    // As a last resort, prepend to body
    document.body.insertAdjacentHTML('afterbegin', markup);
  }
});

/* Calendly popup close helper
   - Watches the DOM for Calendly overlay/popup nodes and injects a close button
   - Hides the mobile CTA while the popup is open and restores it when closed
   - Allows closing via the close button, ESC key, or clicking the overlay background
*/
(function setupCalendlyClose() {
  const MOBILE_CTA_SELECTOR = '#mobile-book-button, .mobile-book-btn';

  function hideMobileCTA() {
    document.querySelectorAll(MOBILE_CTA_SELECTOR).forEach(el => {
      el.dataset.__origDisplay = el.style.display || '';
      el.style.display = 'none';
    });
  }

  function restoreMobileCTA() {
    document.querySelectorAll(MOBILE_CTA_SELECTOR).forEach(el => {
      if (el.dataset.__origDisplay !== undefined) {
        el.style.display = el.dataset.__origDisplay;
        delete el.dataset.__origDisplay;
      } else {
        el.style.display = '';
      }
    });
  }

  function closeCalendlyPopups() {
    // Remove common Calendly overlay/popup containers
    document.querySelectorAll('.calendly-overlay, .calendly-popup, .calendly-iframe').forEach(el => el.remove());
    // Some Calendly widgets create direct iframes under body
    document.querySelectorAll('iframe[src*="calendly.com"]').forEach(iframe => {
      const parent = iframe.parentElement;
      // If the iframe was injected as the only child, remove its parent overlay
      if (parent && (parent.classList.contains('calendly-overlay') || parent.classList.contains('calendly-popup'))) {
        parent.remove();
      } else {
        iframe.remove();
      }
    });
    restoreMobileCTA();
  }

  function addCloseButtonTo(node) {
    if (!node || node.dataset.__hasClose) return;
    node.dataset.__hasClose = '1';

    // Create a close button
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Close calendar');
    btn.innerText = '✕ Close';
    btn.className = 'calendly-close-btn';
    // Inline styles to avoid needing a stylesheet change
    Object.assign(btn.style, {
      position: 'fixed',
      top: '12px',
      right: '12px',
      zIndex: '2147483647',
      background: '#222',
      color: '#fff',
      border: 'none',
      padding: '10px 14px',
      borderRadius: '8px',
      fontSize: '16px',
      cursor: 'pointer',
      boxShadow: '0 6px 18px rgba(0,0,0,0.3)'
    });

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeCalendlyPopups();
    });

    // When overlay background is clicked (but not iframe), close
    node.addEventListener('click', (e) => {
      // If click target is the overlay itself (not the iframe/child), close
      if (e.target === node) {
        closeCalendlyPopups();
      }
    });

    // Add ESC key handler while open
    function onKey(e) {
      if (e.key === 'Escape') closeCalendlyPopups();
    }
    document.addEventListener('keydown', onKey, { once: false });

    // Insert the button into the overlay node (or the body if overlay isn't structured)
    try {
      node.appendChild(btn);
    } catch (err) {
      document.body.appendChild(btn);
    }

    // Hide mobile CTA while popup is open
    hideMobileCTA();
  }

  // Observe additions to the body for Calendly overlay/popup nodes
  const observer = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const n of m.addedNodes) {
        if (!(n instanceof Element)) continue;
        // Calendly uses classes like calendly-overlay, calendly-popup, or injects an iframe
        if (n.classList && (n.classList.contains('calendly-overlay') || n.classList.contains('calendly-popup') || n.classList.contains('calendly-iframe'))) {
          addCloseButtonTo(n);
          return;
        }
        // If an iframe is directly added with a Calendly src, wrap handling
        if (n.tagName === 'IFRAME' && n.src && n.src.indexOf('calendly.com') !== -1) {
          // try to add a close button to the iframe's parent
          addCloseButtonTo(n.parentElement || document.body);
          return;
        }
        // Some widgets may insert a div that contains the iframe
        if (n.querySelector && n.querySelector('iframe[src*="calendly.com"]')) {
          addCloseButtonTo(n);
          return;
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Expose a global close function for debugging or non-standard setups
  window.closeCalendlyPopups = closeCalendlyPopups;
})();
