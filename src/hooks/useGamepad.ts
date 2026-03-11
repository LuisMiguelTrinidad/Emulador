import { useEffect, useRef} from 'react';
//Esto sólo funciona si "withGlobalTauri": true en tauri.conf.json, lo cual permite acceder a la API de
//eventos de Tauri desde frontend
const { listen } = (window as any).__TAURI__.event;

export function setController(onAction: (action: string) => void) {
  //useRef para almacenar el tiempo del último input y evitar acciones repetidas por el mismo input
  //useRef almacena un valor mutable que persiste durante el ciclo de vida del componente sin afectar el renderizado
  const lastActionTime = useRef(0);
  const COOLDOWN_MS = 200;
  const JOYSTICK_THRESHOLD = 0.9;
  const JOYSTICK_DEADZONE = 0.1;
  const joystick_last = useRef({
    x: 'n',
    y: 'n'
  });

  //Configuración del listener para mando al montar componente React
  useEffect(() => {
    //Variable para almacenar la función de limpieza del listener
    let unlisten: () => void;
    
    //Función asíncrona para configurar el listener de eventos del mando
    const listenerController = async () => {
      //Se ejecuta listen para escuchar eventos con etiqueta "mando-input"
      unlisten = await listen('mando-input', (event: { payload: any; }) => {
        //Obtención de datos del evento, que es un string formateado con la información del input del mando
        const raw = event.payload;
        //Control de cooldown para evitar acciones repetidas por el mismo input
        let cooldown = Date.now() - lastActionTime.current < COOLDOWN_MS;

        let action = null;

        //Botones
        if (!cooldown){
            if (raw.includes("ButtonPressed(South")) action = 'A';
            else if (raw.includes("ButtonPressed(East")) action = 'B';
            else if (raw.includes("ButtonPressed(Start")) action = 'START';
            else if (raw.includes("ButtonPressed(DPadUp")) action = 'UP';
            else if (raw.includes("ButtonPressed(DPadDown")) action = 'DOWN';
            else if (raw.includes("ButtonPressed(DPadLeft")) action = 'LEFT';
            else if (raw.includes("ButtonPressed(DPadRight")) action = 'RIGHT';
        }

        //Joystick
        if (raw.includes("AxisChanged(LeftStickY")) {
            const match = raw.match(/AxisChanged\(LeftStickY, ([^,]+)/);
            if (match) {
                const val = parseFloat(match[1]);
                if (val > JOYSTICK_THRESHOLD && joystick_last.current.y !== 'u') {
                    joystick_last.current.y = 'u';
                    if (!cooldown) action = 'UP';
                }
                else if (val < -JOYSTICK_THRESHOLD && joystick_last.current.y !== 'd') {
                    joystick_last.current.y = 'd';
                    if (!cooldown) action = 'DOWN';
                }
                else if (Math.abs(val) <= JOYSTICK_DEADZONE) {
                    joystick_last.current.y = 'n';
                }
            }
        }
        else if (raw.includes("AxisChanged(LeftStickX")) {
            const match = raw.match(/AxisChanged\(LeftStickX, ([^,]+)/);
            if (match) {
                const val = parseFloat(match[1]);

                if (val > JOYSTICK_THRESHOLD && joystick_last.current.x !== 'r') {
                    joystick_last.current.x = 'r';
                    if (!cooldown) action = 'RIGHT';
                }
                else if (val < -JOYSTICK_THRESHOLD && joystick_last.current.x !== 'l') {
                    joystick_last.current.x = 'l';
                    if (!cooldown) action = 'LEFT';
                }
                else if (Math.abs(val) <= JOYSTICK_DEADZONE) {
                    joystick_last.current.x = 'n';
                }
            }
        }

        if (action) {
          //Actualización del tiempo del último input
          lastActionTime.current = Date.now();
          //Llamada a la función onAction de App.jsx con la acción detectada
          onAction(action);
        }
      });
    };

    listenerController();

    //Se devuelve una función de limpieza que se ejecutará al desmontar el componente
    //para eliminar el listener y evitar fugas de memoria
    return () => {
      if (unlisten) unlisten();
    };
  //Declaración de onAction como dependencia del useEffect para que el listener se actualice si onAction cambia
  }, [onAction]);
}