/* El formulario no se habilita hasta obtener el token del mismo origen. */
'use strict';
fetch('token', {credentials:'same-origin',cache:'no-store'})
  .then(response => {if(!response.ok)throw new Error('No fue posible preparar el formulario');return response.json();})
  .then(data => {document.getElementById('csrf-token').value=data.token;document.getElementById('guardar-html').disabled=false;})
  .catch(error => {document.getElementById('token-error').textContent=error.message+'. Abre esta pagina desde Tomcat, no como archivo local.';});
