use gilrs::{Gilrs, Event};
use tauri::{AppHandle, Emitter}; 
use std::thread;
use std::time::Duration;


pub fn input_controller(app_thread: AppHandle) {
    //Hilo de detección de mando
    //move para pasar la propiedad de app_thread al interior del hilo, evitando problemas de concurrencia
    thread::spawn(move || {
        //Inicio librería Gilrs para detección de mando
        //new() retorna tipo Result, el cual es resuelto por unwrap()
        //let mut gilrs = Gilrs::new().unwrap();
        
        //Se puede diseccionar manualmente, es más largo pero se entiende mejor y da menos problemas
        let mut gilrs = match Gilrs::new() {
            Ok(g) => g,
            Err(e) => {
                println!("No se pudo inicializar el sistema de mandos: {}", e);
                return; 
            }
        };

        loop {
            //next_event() procesa cola de eventos del sistema operativo
            //Bucle while mientras next_event() retorne un Option tipo Some
            //.. para ignorar y no escribir resto de elementos en desestructuración
            while let Some(Event {event, ..}) = gilrs.next_event() {
                //Formateado de evento de mando como string
                let input = format!("{:?}", event);
                //println!("Input detectado: {:?}", event);
                //Emisión del evento formateado a la aplicación Tauri con etiqueta "mando-input"
                let _ = app_thread.emit("mando-input", input);
            }
            //Pausa para evitar exceso de uso de CPU
            thread::sleep(Duration::from_millis(50));
        }
    });
}