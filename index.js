const template = document.createElement('topnav-template');

template.innerHTML = 

` <div class='topnav-container'>
    <ul class='topnav'>
      <li><a href='index.html'>Home</a></li>
      <li><a href='Offerings.html'>Services</a></li>
    </ul>
  </div>`;

  document.body.appendChild(template.content);