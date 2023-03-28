function onBGChangeTestTracker() {

  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getActiveRange();
  var i = range.getRow();

  Logger.log('i=' + i);

  //Cambiar esta URL con la ubicación de la Hoja
  idBugTracker = SpreadsheetApp.openById('1iHKGXIu5ATuC7EplpryR6V4qqY4FO-egB_QPDf9R5R8');
  testTracker = SpreadsheetApp.getActive().getSheetByName("TestTracker")
  storageTestTracker = idBugTracker.getSheetByName("StorageTestTracker");


  timezone = new Date()
  horaInicioAlmuerzo = 13;
  horaFinAlmuerzo = 14;
  horaInicioJornada = 8;
  horaFinJornada = 17;
  milisegundos = 60 * 60 * 1000;

  hdeU = testTracker.getRange("A" + i);
  cp = testTracker.getRange("B" + i);
  tipoCP = testTracker.getRange("C" + i);
  horaTest = testTracker.getRange("D" + i);
  horaTestAjuste = testTracker.getRange("E" + i);
  factorAjuste = testTracker.getRange("F" + i);
  responsable = testTracker.getRange("G" + i);
  estadoCP = testTracker.getRange("H" + i);
  fechaApertura = testTracker.getRange("I" + i);
  horaApertura = testTracker.getRange("J" + i);
  fechaEstimada = testTracker.getRange("K" + i);
  horaEstimada = testTracker.getRange("L" + i);
  fechaQA = testTracker.getRange("M" + i);
  horaQA = testTracker.getRange("N" + i);
  horasAdicionales = testTracker.getRange("O" + i);
  estadoQA = testTracker.getRange("P" + i);
  tipoBloqueo = testTracker.getRange("Q" + i);

  switch (estadoCP.getValues().toString()) {

    case "Pendiente":
      if (i > 1) {
        fechaApertura.setValue("");
        horaApertura.setValue("");
        fechaEstimada.setValue("");
        horaEstimada.setValue("");
        fechaQA.setValue("");
        horaQA.setValue("");
        horasAdicionales.setValue("");
        estadoQA.setValue("");
        tipoBloqueo.setValue("");

        break;
      }

    case "En Progreso":
      fechaApertura.setValue(timezone);
      horaApertura.setValue(timezone);
      horarioLaboral();

      if (factorAjuste.getValues() == "Si") {
        confactorAjuste();
      } else {
        sinfactorAjuste();
      }

      guardarInformacion(i);
      break;

    case "Bloqueado":
      fechaApertura.setValue(timezone);
      horaApertura.setValue(timezone);
      horarioLaboral();

      fechaEstimada.setValue("");
      horaEstimada.setValue("");
      fechaQA.setValue("");
      horaQA.setValue("");
      horasAdicionales.setValue("");
      estadoQA.setValue("");

      break;

    case "Terminado":
      fechaQA.setValue(timezone);
      horaQA.setValue(timezone);
      horarioLaboral();

      adicional = calcularHorasAdicionales();
      horasAdicionales.setValue(adicional);
      validarAtrazo(adicional);
      guardarInformacion(i);

      break;

  }

}


function confactorAjuste() {

  var fecha = new Date(fechaApertura.getValues());
  var hora = new Date(horaApertura.getValues()).getHours();
  var minutos = new Date(horaApertura.getValues()).getMinutes();


  horaTestAjuste = new Number(horaTestAjuste.getValues());
  validarHora = validarHora(hora + horaTestAjuste);

  var diasCP = validarDiasFactorAjuste(horaTestAjuste);

  if (diasCP != 0) {
    fecha = new Date((fecha.getTime() + 24 * diasCP * milisegundos))
  }

  if (validarHora == "Almuerzo") {

    fechaEstimada.setValue(fecha);
    horaEstimada.setValue(Math.round(hora + horaTestAjuste + 1) + ":" + minutos);

  } else if (validarHora == "FinJornada") {

    if (diasCP != 0) {
      horaEstimada.setValue(horaApertura.getValues());

    } else {
      horasTrabajadas = Math.abs(Math.round(hora - horaFinJornada));
      horaEstimada.setValue(Math.round(Math.round(Math.abs(horaTestAjuste - horasTrabajadas) + horaInicioJornada)) + ":" + minutos);
    }

  } else {
    fechaEstimada.setValue(fecha);
    horaEstimada.setValue(Math.round(hora + horaTestAjuste) + ":" + minutos);
  }

  if (validarHora == "FinJornada") {

    validaFestivo = validarFestivo(fecha)

    if (validaFestivo == "Festivo") {
      fechaEstimada.setValue(new Date(fecha.getTime() + 48 * milisegundos))
    } else {
      fechaEstimada.setValue(new Date(fecha.getTime() + 24 * milisegundos))
    }
  }
}

function sinfactorAjuste() {

  var fecha = new Date(fechaApertura.getValues());
  var hora = new Date(horaApertura.getValues()).getHours();
  var minutos = new Date(horaApertura.getValues()).getMinutes();

  horaTest = new Number(horaTest.getValues());
  validarHora = validarHora(hora + horaTest);


  var diasCP = validarDiasFactorAjuste(horaTest);

  if (diasCP != 0) {
    fecha = new Date((fecha.getTime() + 24 * diasCP * milisegundos))
  }


  if (validarHora == "Almuerzo") {

    fechaEstimada.setValue(fecha);
    horaEstimada.setValue(Math.round(hora + horaTest + 1) + ":" + minutos);

  } else if (validarHora == "FinJornada") {

    if (diasCP != 0) {
      horaEstimada.setValue(horaApertura.getValues());

    } else {
      horasTrabajadas = Math.abs(Math.round(hora - horaFinJornada));
      horaEstimada.setValue(Math.round(Math.round(Math.abs(horaTest - horasTrabajadas) + horaInicioJornada)) + ":" + minutos);
    }

  } else {
    fechaEstimada.setValue(fecha);
    horaEstimada.setValue(Math.round(hora + horaTest) + ":" + minutos);
  }

  if (validarHora == "FinJornada") {

    validaFestivo = validarFestivo(fecha)

    if (validaFestivo == "Festivo") {
      fechaEstimada.setValue(new Date(fecha.getTime() + 48 * milisegundos))
    } else {
      fechaEstimada.setValue(new Date(fecha.getTime() + 24 * milisegundos))
    }
  }

}

function validarHora(hora) {

  if (hora >= horaInicioAlmuerzo && hora <= horaFinAlmuerzo) {
    return "Almuerzo";
  } else if (hora >= horaFinJornada) {
    return "FinJornada";
  } else {
    return "Habil";
  }
}

function validarDiasFactorAjuste(horas) {
  
  var dias = 0;

  if (horas > 8) {
    dias = Math.round(horas / 8);
  }
  
  return dias;


}


function validarFestivo(fecha) {
  var fechaValidar = new Date(fecha);
  var dia = fechaValidar.getUTCDay();

  if (dia == 5) {
    return "Festivo";

  } else {

    return "Habil";
  }

}

function horarioLaboral() {

  var fecha = new Date(fechaApertura.getValues());
  var hora = fecha.getHours();

  if (hora >= horaFinJornada) {
    horaApertura.setValue("17:00");
  } else if (hora <= horaInicioJornada) {
    horaApertura.setValue("8:00")
  }

  var fechaCalidad = new Date(fechaQA.getValues());
  var horaCalidad = fechaCalidad.getHours();

  if (horaCalidad >= horaFinJornada) {
    horaQA.setValue("17:00");
  } else if (horaCalidad <= horaInicioJornada) {
    horaQA.setValue("8:00")
  }

}

function calcularHorasAdicionales() {
  var horaInicio = new Date(horaEstimada.getValues()).getHours() + 1;
  var horaFin = new Date(horaQA.getValues()).getHours() + 1;
  var fechaInicio = new Date(fechaEstimada.getValue()).getMonth() + 1;
  var fechaFin = new Date(fechaQA.getValue()).getMonth() + 1;
  var diaInicio = new Date(fechaEstimada.getValue()).getDate();
  var diaFin = new Date(fechaQA.getValue()).getDate();
  var atrazo = "";

  Logger.log(fechaFin);
  Logger.log(fechaInicio);

  if (horaInicio.toString() != "NaN" && horaFin.toString() != "NaN") {
    if (fechaFin <= fechaInicio) {
      if (diaFin < diaInicio) {
        if (horaFin >= horaFinJornada) {
          atrazo = horaInicio - horaInicioJornada;
        }
      } else if (diaFin >= diaInicio) {
        atrazo = horaFin - horaInicio;
      }
    } else {
      atrazo = horaFin - horaInicio;
    }
  }

  return Math.abs(atrazo);
}

function validarAtrazo(adicional) {
  var fechaInicio = new Date(fechaEstimada.getValue()).getMonth() + 1;
  var fechaFin = new Date(fechaQA.getValue()).getMonth() + 1;
  var diaInicio = new Date(fechaEstimada.getValue()).getDate();
  var diaFin = new Date(fechaQA.getValue()).getDate();


  if (factorAjuste.getValues() == "Si") {

    if (fechaFin <= fechaInicio) {
      if (diaFin < diaInicio) {
        if (adicional >= horaTestAjuste.getValues()) {
          estadoQA.setValue("A tiempo");
        }
      }
      else {
        estadoQA.setValue("A tiempo");
      }
    } else {
      if (adicional => horaTestAjuste.getValues()) {
        estadoQA.setValue("Retraso");
      } else if (adicional <= horaTestAjuste.getValues()) {
        estadoQA.setValue("A tiempo");
      }
    }
  } else if (factorAjuste.getValues() == "No") {

    if (fechaFin <= fechaInicio) {
      if (diaFin < diaInicio) {
        if (adicional >= horaTest.getValues()) {
          estadoQA.setValue("A tiempo");
        }
      } else {
        estadoQA.setValue("A tiempo");
      }
    } else {
      if (adicional => horaTest.getValues()) {
        estadoQA.setValue("Retraso");
      } else if (adicional <= horaTest.getValues()) {
        estadoQA.setValue("A tiempo");
      }
    }

  }
}


function guardarInformacion(i) {
  estadoQAStorage = storageTestTracker.getRange("O" + i).getValue().toString();

  if (estadoQAStorage == "") {

    storageTestTracker.getRange("A" + i).setValue(hdeU.getValue());
    storageTestTracker.getRange("B" + i).setValue(cp.getValue());
    storageTestTracker.getRange("C" + i).setValue(tipoCP.getValue());
    storageTestTracker.getRange("D" + i).setValue(horaTest.getValue());
    storageTestTracker.getRange("E" + i).setValue(horaTestAjuste.getValue());
    storageTestTracker.getRange("F" + i).setValue(factorAjuste.getValue());
    storageTestTracker.getRange("G" + i).setValue(responsable.getValue());
    storageTestTracker.getRange("H" + i).setValue(estadoCP.getValue());
    storageTestTracker.getRange("I" + i).setValue(fechaApertura.getValue());
    storageTestTracker.getRange("J" + i).setValue(horaApertura.getValue());
    storageTestTracker.getRange("K" + i).setValue(fechaEstimada.getValue());
    storageTestTracker.getRange("L" + i).setValue(horaEstimada.getValue());
    storageTestTracker.getRange("M" + i).setValue(fechaQA.getValue());
    storageTestTracker.getRange("N" + i).setValue(horaQA.getValue());
    storageTestTracker.getRange("O" + i).setValue(horasAdicionales.getValue());
    storageTestTracker.getRange("P" + i).setValue(estadoQA.getValue());
    storageTestTracker.getRange("Q" + i).setValue(tipoBloqueo.getValue());
  }
}
