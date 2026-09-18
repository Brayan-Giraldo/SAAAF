/* Confirmacion explicita antes de eliminar mediante POST. */
'use strict';
document.querySelectorAll('.confirm-delete').forEach(form=>form.addEventListener('submit',event=>{
  if(!window.confirm('Se eliminara este registro del modulo Java. Esta version no conserva historial de eliminacion. Continuar?'))event.preventDefault();
}));
