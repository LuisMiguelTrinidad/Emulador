mod controller;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        //Constructor de aplicación Tauri
        //setup() para ejecutar código de configuración antes de iniciar la aplicación, recibe una
        //función anónima (en js es () => {}, aquí || {})
        .setup(|app| {
            //Clonación del manejador de la aplicación para usarlo dentro del hilo de detección de mando
            let app_thread = app.handle().clone();

            controller::input_controller(app_thread);
            
            println!("Aplicación Tauri configurada");

            //Retorno de Ok (tipo Result) para indicar que la configuración se realizó correctamente
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![])
        .run(tauri::generate_context!())
        .expect("Error en inicio de aplicación Tauri");
}
