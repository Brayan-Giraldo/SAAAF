# Validaciones implementadas

1. Se valida que usuario y contrasena esten presentes.
2. El usuario debe tener entre 4 y 40 caracteres.
3. El usuario admite letras minusculas, numeros, punto, guion y guion bajo.
4. La contrasena debe tener entre 8 y 72 caracteres.
5. No se permiten usuarios duplicados.
6. La comparacion de la contrasena se realiza contra un hash `scrypt` almacenado con salt aleatorio.
7. Una autenticacion invalida siempre retorna HTTP 401 y un mensaje generico para no revelar si el usuario existe.
