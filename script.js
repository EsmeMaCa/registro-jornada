document.querySelectorAll("button").forEach((btn) => {
  //encuentra todos los botones que hay y le da instrucciones
  btn.addEventListener("click", () => {
    //al darle click con el ratón actua
    const accion = btn.textContent.trim(); //ve que boton se ha pulsado

    if (accion === "INICIO") {
      //si se presiona el boton INICIO hace:
      localStorage.setItem("inicioJornada", Date.now()); //guarda el tiempo
      localStorage.removeItem("tiempoAcumulado"); //borra el tiempo anterior acumulado
    }

    if (
      //si se presiona el boton PAUSA, DESAYUNO, COMIDA, MÉDICO, PERSONAL u OTROS para el tiempo
      ["PAUSA", "DESAYUNO", "COMIDA", "MÉDICO", "PERSONAL", "OTROS"].includes(
        accion,
      )
    ) {
      const inicio = localStorage.getItem("inicioJornada");
      if (inicio) {
        //si hay tiempo acumulado
        const yaTrabajado = Date.now() - parseInt(inicio); //se calcula cuanto tiempo ha pasado desde el inicio
        const acumuladoAnterior = parseInt(
          //se coge el tiempo ya acumulado
          localStorage.getItem("tiempoAcumulado") || 0,
        );
        localStorage.setItem(
          //suma el tiempo trabajado con el nuevo y lo guarda
          "tiempoAcumulado",
          yaTrabajado + acumuladoAnterior,
        );
        localStorage.removeItem("inicioJornada"); //para el reloj
      }
    }

    if (accion === "REANUDAR") {
      //si se presiona el boton REANUDAR se pone el tiempo en marcha
      localStorage.setItem("inicioJornada", Date.now());
    }

    if (accion === "FIN") {
      //si se presiona el boton FIN borra los datos
      localStorage.clear();
    }

    window.location.href = btn.dataset.url; //cuando pulsas el boton te lleva a otra página
  });
});

function actualizarCronometro() {
  //muestra el tiempo en la pantalla
  const display = document.querySelector(".tiempo");
  if (!display) return; //si no existe el elemento no hace nada

  setInterval(() => {
    const inicio = localStorage.getItem("inicioJornada"); //mira si el reloj esta activo
    const acumulado = parseInt(localStorage.getItem("tiempoAcumulado") || 0); //coge el tiempo acumulado

    let tiempoTotalMS = acumulado;

    if (inicio) {
      //si el reloj esta activo suma el tiempo actual
      tiempoTotalMS += Date.now() - parseInt(inicio);
    }

    const totalSegundos = Math.floor(tiempoTotalMS / 1000); //aplica el tiempo en horas minutos y segundos, redondea para no tener decimales
    const horas = Math.floor(totalSegundos / 3600) //divide el total de segundos entre 3600 para saber las horas que hay
      .toString() //lo pone en texto
      .padStart(2, "0"); //hace que sean dos dígitos
    const minutos = Math.floor((totalSegundos % 3600) / 60) //quita kas horas completas y se queda con lo que sobra, p.j. 7500 segundos, 7500 % 3600 = 300 segundos, 300 / 60 = 5 min
      .toString()
      .padStart(2, "0");
    const segundos = (totalSegundos % 60).toString().padStart(2, "0"); //igual que minutos pero en segundos

    display.textContent = `${horas}:${minutos}:${segundos}`; //muestra el tiempo en pantalla
  }, 1000);
}

actualizarCronometro(); //actualiza el tiempo
