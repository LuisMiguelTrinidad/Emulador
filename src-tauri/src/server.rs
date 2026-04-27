//Para mapear JSON a objeto Rust
use serde::{Deserialize, Serialize};
use dotenvy::dotenv;
use std::env;

const URL_BASE: &str = "https://backendpython.procsmocscimsi.uk";
//const URL_BASE: &str = "http://127.0.0.1:8000";

////////////////////////////////////////////////////
// CLASES AUXILIARES
////////////////////////////////////////////////////


//derive, Serialize y Deserialize permite transformar JSON a Rust y de Rust a TS automáticamente

//Juegos con perfil asignado
#[derive(Serialize, Deserialize, Debug)]
pub struct JuegoId {
    pub id: i32,
    pub titulo: String,
    pub consola: String,
    // Usamos Option porque en tu base de datos puede ser null
    pub ruta: Option<String>,
}

//Juegos con o sin perfil asignado (es decir, descargados o sin descargar)
#[derive(Serialize, Deserialize, Debug)]
pub struct Juego {
    pub nombre: String,
    pub url_descarga: String,
    pub consola: String,
}

//Resultado de búsqueda de juegos
#[derive(Serialize, Deserialize, Debug)]
pub struct BusquedaJuegos {
    pub busqueda: String,
    pub total_resultados: i32,
    pub pagina_actual: i32,
    pub tamaño_pagina: i32,
    pub total_paginas: i32,
    pub juegos: Vec<Juego>,
}

//Respuesta login
#[derive(Serialize, Deserialize, Debug)]
pub struct LoginRespuesta {
    pub mensaje: String,
    pub usuario_id: i32,
}

//Petición register
#[derive(Serialize, Deserialize, Debug)]
pub struct RegistroRespuesta {
    pub id: i32,
    pub usuario: String,
}


////////////////////////////////////////////////////
// FUNCIONES FRONTEND
////////////////////////////////////////////////////


#[tauri::command]
//Retorna un Result (Ok con el vector de consolas, o Err con un String)
pub async fn get_biblioteca(id: i32) -> Result<Vec<JuegoId>, String> {
    dotenv().ok();

    let token_id = env::var("VITE_P_ACCESS_TOKEN_ID").map_err(|_| "Falta VITE_P_ACCESS_TOKEN_ID en el .env")?;
    let token = env::var("VITE_P_ACCESS_TOKEN").map_err(|_| "Falta VITE_P_ACCESS_TOKEN en el .env")?;

    let url = format!("{}/mi-biblioteca/{}", URL_BASE, id);

    let cliente = reqwest::Client::new();
    
    //reqwest::get hace petición GET a FastAPI
    //? es equivamente a match, comprimiendo código en una línea
    //let respuesta = reqwest::get(url).await.map_err(|e| e.to_string())?;

    //Se puede diseccionar casos, queda más largo pero se entiende mejor (o al menos ese es mi caso :s)
    let peticion = cliente.get(&url)
        .header("P-Access-Token-Id", token_id)
        .header("P-Access-Token", token)
        .send()
        .await;
        
        let respuesta = match peticion {
            Ok(res) => res,
            Err(e) => {
                return Err(format!("Error de red: {}", e));
            }
        };

    //Transforma cuerpo de respuesta JSON a un array de JuegosId
    let get_biblioteca = match respuesta.json::<Vec<JuegoId>>().await{
        Ok(datos) => datos,
        Err(e) => {
            return Err(format!("Error leyendo JSON: {}", e));
        }
    };

    return Ok(get_biblioteca);
}

#[tauri::command]
//Retorna juegos mediante búsqueda de forma paginada
pub async fn get_juegos(busqueda: String, pagina: i32, cantidad: i32, consola: String) -> Result<BusquedaJuegos, String> {
    dotenv().ok();

    let token_id = env::var("VITE_P_ACCESS_TOKEN_ID").map_err(|_| "Falta VITE_P_ACCESS_TOKEN_ID en el .env")?;
    let token = env::var("VITE_P_ACCESS_TOKEN").map_err(|_| "Falta VITE_P_ACCESS_TOKEN en el .env")?;

    let url = format!("{}/scrapper/buscar", URL_BASE);
    //Se requiere cliente porque se mandan querys
    let cliente = reqwest::Client::new();

    let peticion = cliente.get(&url)
        .header("P-Access-Token-Id", token_id)
        .header("P-Access-Token", token)
        .query(&[("search", &busqueda), ("page", &pagina.to_string()), ("size", &cantidad.to_string()), ("consola", &consola)])
        .send()
        .await;

    let respuesta = match peticion {
        Ok(res) => res,
        Err(e) => {
            return Err(format!("Error de red: {}", e));
        }
    };

    let get_juegos = match respuesta.json::<BusquedaJuegos>().await{
        Ok(datos) => datos,
        Err(e) => {
            return Err(format!("Error leyendo JSON: {}", e));
        }
    };

    return Ok(get_juegos);
}


////////////////////////////////////////////////////
// FUNCIONES LOGIN
////////////////////////////////////////////////////


#[tauri::command]
pub async fn login(usuario: String, contrasena: String) -> Result<LoginRespuesta, String> {
    println!("FUNCIONA COÑO");
    dotenv().ok();

    let token_id = env::var("VITE_P_ACCESS_TOKEN_ID").map_err(|_| "Falta VITE_P_ACCESS_TOKEN_ID en el .env")?;
    let token = env::var("VITE_P_ACCESS_TOKEN").map_err(|_| "Falta VITE_P_ACCESS_TOKEN en el .env")?;

    println!("{}////{}",token_id, token);

    let url = format!("{}/usuarios/login", URL_BASE);
    //Inicializa cliente HTTP
    let cliente = reqwest::Client::new();

    //.query() añade los parámetros a la URL (?usuario=X&contrasena=Y)
    let peticion = cliente.post(&url)
        .header("P-Access-Token-Id", token_id)
        .header("P-Access-Token", token)
        .query(&[("usuario", &usuario), ("contrasena", &contrasena)])
        .send()
        .await;

    let respuesta = match peticion {
        Ok(res) => res,
        Err(e) => return Err(format!("Error de red: {}", e)),
    };

    println!("Respuesta del servidor: {:?}", respuesta);

    //Retorna 401 o similar
    if !respuesta.status().is_success() {
        return Err("Credenciales incorrectas o hubo un problema.".to_string());
    }

    let datos = match respuesta.json::<LoginRespuesta>().await {
        Ok(data) => data,
        Err(e) => return Err(format!("Error leyendo JSON: {}", e)),
    };

    return Ok(datos);
}

#[tauri::command]
pub async fn register(usuario: String, contrasena: String) -> Result<RegistroRespuesta, String> {
    dotenv().ok();

    let token_id = env::var("VITE_P_ACCESS_TOKEN_ID").map_err(|_| "Falta VITE_P_ACCESS_TOKEN_ID en el .env")?;
    let token = env::var("VITE_P_ACCESS_TOKEN").map_err(|_| "Falta VITE_P_ACCESS_TOKEN en el .env")?;

    let url = format!("{}/usuarios/register", URL_BASE);
    //Inicializa cliente HTTP
    let cliente = reqwest::Client::new();

    //.query() añade los parámetros a la URL (?usuario=X&contrasena=Y)
    let peticion = cliente.post(&url)
        .header("P-Access-Token-Id", token_id)
        .header("P-Access-Token", token)
        .query(&[("usuario", &usuario), ("contrasena", &contrasena)])
        .send()
        .await;

    let respuesta = match peticion {
        Ok(res) => res,
        Err(e) => return Err(format!("Error de red: {}", e)),
    };

    //Retorna 400 o similar
    if !respuesta.status().is_success() {
        return Err("El usuario ya existe o hubo un problema.".to_string());
    }

    let datos = match respuesta.json::<RegistroRespuesta>().await {
        Ok(data) => data,
        Err(e) => return Err(format!("Error leyendo JSON: {}", e)),
    };

    return Ok(datos);
}


////////////////////////////////////////////////////
// FUNCIONES SERVER
////////////////////////////////////////////////////


#[tauri::command]
//Desvincula un juego de un perfil
pub async fn borrar_juego_cuenta(id_juego: i32, id_perfil: i32) -> Result<String, String> {
    dotenv().ok();

    let token_id = env::var("VITE_P_ACCESS_TOKEN_ID").map_err(|_| "Falta VITE_P_ACCESS_TOKEN_ID en el .env")?;
    let token = env::var("VITE_P_ACCESS_TOKEN").map_err(|_| "Falta VITE_P_ACCESS_TOKEN en el .env")?;

    let url = format!("{}/juegos/desvincular/{}", URL_BASE, id_juego);
    let cliente = reqwest::Client::new();

    let peticion = cliente.delete(&url)
        .header("P-Access-Token-Id", token_id)
        .header("P-Access-Token", token)
        .query(&[("perfil_id", id_perfil)])
        .send()
        .await;

    let respuesta = match peticion {
        Ok(res) => res,
        Err(e) => return Err(format!("Error de red al intentar eliminar: {}", e)),
    };

    //Si respuesta distinta a 200
    if !respuesta.status().is_success() {
        return Err("No se pudo desvincular el juego. Es posible que no exista o haya un error en el servidor.".to_string());
    }

    let datos = match respuesta.json::<String>().await {
        Ok(data) => data,
        Err(e) => return Err(format!("Error leyendo JSON: {}", e)),
    };

    return Ok(datos);
}


#[tauri::command]
//Inicia juego en Retroarch y cierra aplicación
pub async fn iniciar_juego(id_juego: i32, id_perfil: i32, app_handle: tauri::AppHandle) -> Result<String, String> {
    dotenv().ok();

    let token_id = env::var("VITE_P_ACCESS_TOKEN_ID").map_err(|_| "Falta VITE_P_ACCESS_TOKEN_ID en el .env")?;
    let token = env::var("VITE_P_ACCESS_TOKEN").map_err(|_| "Falta VITE_P_ACCESS_TOKEN en el .env")?;

    let url = format!("{}/loadgame/{}/{}", URL_BASE, id_perfil, id_juego);
    println!("Llamando a la API: {}", url);
    let server_host = "procsmocscimsi.uk";
    let cliente = reqwest::Client::new();

    let peticion = cliente.get(&url)
        .header("P-Access-Token-Id", token_id)
        .header("P-Access-Token", token)
        .send()
        .await;

    match peticion {
        Ok(res) if res.status().is_success() => {
            println!("Abriendo Moonlight");
            let moonlight = std::process::Command::new("flatpak")
                .arg("run")
                //Magia negra, no tocar los conjuros
                .arg("--socket=wayland")
                .arg("--env=QT_QPA_PLATFORM=wayland")
                .arg("--env=SDL_VIDEODRIVER=wayland")
                .arg("--env=XDG_SESSION_TYPE=wayland")
                .arg("com.moonlight_stream.Moonlight")
                .arg("stream")
                .arg(&server_host)
                .arg("Desktop")
                .spawn();
            match moonlight {
                Ok(_) => {
                    println!("Moonlight ejecutándose");
                    //Delay para que no se cague encima
                    std::thread::sleep(std::time::Duration::from_secs(1));
                    //Cierre de aplicaición Tauri
                    //app_handle.exit(0);
                    //Hay que retornar algo, aunque no se vea
                    Ok("Código oculto patrocinado por la sede del PSOE".to_string())
                }
                Err(e) => {
                    // Si falla, no cerramos Tauri para que el usuario pueda ver el error
                    Err(format!("Error al iniciar Moonlight: {}", e))
                }
            }
        },
        Ok(_) => Err("El backend no pudo iniciar el juego. Revisar FastAPI.".to_string()),
        Err(e) => Err(format!("Error de red al contactar con el servidor: {}", e)),
    }
}