
import inquirer from "inquirer";
import promptSync from "prompt-sync";
const prompt = promptSync();
import { Tareas } from "../models/Tareas";
import { GestorTareas } from "../src/GestorTareas";
import { mostrarTareaDetallada } from "../src/Funciones";

const gestor = new GestorTareas();





export async function ejecutarAccion(opcion: string) {

    switch (opcion) {

        case "1":
            console.clear();
            console.log("=== LISTA DE TAREAS ===\n");

            const titulos = gestor.obtenerSoloTitulos();

            if (titulos.length === 0) {
                console.log("No hay tareas para mostrar.\n");
                break;
            }

            const { idSeleccionado } = await inquirer.prompt([
                {
                    type: "list",
                    name: "idSeleccionado",
                    message: "Elegí una tarea para ver detalles: \n\nTITULOS:\n\n",
                    prefix: "",
                    choices: titulos.map(t => ({
                    name: `[ ${t.titulo} ] (${t.id})\n`,
                    value: t.id
                    }))
                }
            ]);

            const tarea = gestor.obtener().find(t => t.id === idSeleccionado);

            console.clear();
            console.log(mostrarTareaDetallada(tarea!));

            prompt("ENTER para continuar...");
            break;

        case "2": {
            let volver = false;

            while (!volver) {
                const { subopcion } = await inquirer.prompt([
                    {
                        type: "list",
                        name: "subopcion",
                        message: "Submenú de búsqueda:",
                        prefix: "",
                        choices: [
                            "1. Buscar por título",
                            "2. Buscar por ID",
                            "0. Volver"
                        ]
                    }
                ]);

                switch (subopcion[0]) {
                    case "1":
                        console.log("Buscar por título...");
                        break;
                    case "2":
                        console.log("Buscar por ID...");
                        break;
                    case "0":
                        volver = true;
                        break;
                }
            }

            break;
        }
        case "6": {

            console.clear();
            console.log("=== AGREGAR TAREA ===\n");

            const titulo = prompt("Título: ");
            const { nivel } = await inquirer.prompt([
                {
                    type: "list",
                    name: "nivel",
                    message: "Elegí dificultad:",
                    prefix: "",
                    choices: [
                        { name: "🌑🌑🌑  (Fácil)", value: 1 },
                        { name: "🌓🌓🌓  (Media)", value: 2 },
                        { name: "🌕🌕🌕  (Alta)", value: 3 }
                    ]
                }
            ]);

            const descripcion = prompt("Descripción: ");

            gestor.nueva(titulo, nivel, descripcion);

            console.log("\n✔ Tarea agregada correctamente.\n");
            break;
        }

        case "0":
            console.log("Saliendo...");
            process.exit(0);
    }
}
