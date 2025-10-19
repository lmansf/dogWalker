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
