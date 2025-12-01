
import inquirer from "inquirer";
import promptSync from "prompt-sync";
const prompt = promptSync();
import { Tareas } from "../models/Tareas";
import { GestorTareas } from "../src/GestorTareas";
import { mostrarTareaDetallada } from "../src/Funciones";

const gestor = new GestorTareas();





export async function ejecutarAccion(opcion: string) {

    let salir: false;


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

        case "2":
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
                            "2. Buscar por palabra clave",
                            "0. Volver"
                        ]
                    }
                ]);

                switch (subopcion[0]) {
                    case "1":
                        const palabra = prompt("Ingresá parte del título: ");

                        const resultados = gestor.buscarPorTitulo(palabra);

                        if (resultados.length === 0) {
                            console.log("\n❌ No se encontraron tareas.\n");
                            break;
                        }

                        const { seleccion } = await inquirer.prompt([
                            {
                                type: "list",
                                name: "seleccion",
                                prefix: "",
                                message: "Elegí una tarea:",
                                choices: resultados.map(t => ({
                                    name: `📌 ${t.titulo}   (${t.id.slice(0, 6)}...)`,
                                    value: t.id
                                }))
                            }
                        ]);

                        const tareaElegida = resultados.find(t => t.id === seleccion);
                        console.clear();
                        console.log(mostrarTareaDetallada(tareaElegida!));
                        prompt("\nENTER para continuar...");
                        break;
                    case "2":
                        const clave = prompt("Ingresá palabra clave: ");
                        const encontrados = gestor.buscarPalabraClave(clave);
                        if (encontrados.length === 0) {
                            console.log("\n❌ No se encontraron tareas.\n");
                            break;
                        }
                        const { seleccion1 } = await inquirer.prompt([
                            {
                                type: "list",
                                name: "seleccion",
                                prefix: "",
                                message: "Elegí una tarea:",
                                choices: encontrados.map(t => ({
                                    name: `📌 ${t.titulo}   (${t.id.slice(0, 6)}...)`,
                                    value: t.id
                                }))
                            }
                        ]);

                        const tareaElegida2 = encontrados.find(t => t.id === seleccion1);
                        console.clear();
                        console.log(mostrarTareaDetallada(tareaElegida!));
                        prompt("\nENTER para continuar...");
                        break;


                        break;
                    case "0":
                        volver = true;
                        break;
                }
            }

            break;
        case "3":
            console.clear();
            console.log("=== ORDENAR TAREAS ===\n");

            const { tipoOrden } = await inquirer.prompt([
                {
                    type: "list",
                    name: "tipoOrden",
                    prefix: "",
                    message: "¿Cómo querés ordenar las tareas?\n",
                    choices: [
                        { name: "📖 Ordenar por título", value: "titulo" },
                        { name: "🔥 Ordenar por dificultad", value: "dificultad" },
                        { name: "↩ Volver", value: "volver" }
                    ]
                }
            ]);

            if (tipoOrden === "volver") break;

            if (tipoOrden === "titulo") {
                gestor.ordenarTitulo();
            } else {
                gestor.ordenarDificultad();
            }

            const resultadoOrdenado = gestor.obtener();

            console.clear();
            console.log("=== RESULTADO ORDENADO ===\n");

            resultadoOrdenado.forEach(t => {
                console.log(`📌 ${t.titulo} (${t.id}) | Dificultad: ${t.dificultad}`);
            });

            await inquirer.prompt([{ type: "input", name: "pause", message: "\nENTER para continuar..." }]);
            break;
        case "4":
        case "4":
            console.clear();
            console.log("=== FILTRAR TAREAS ===\n");

            const { tipoFiltro } = await inquirer.prompt([
                {
                    type: "list",
                    name: "tipoFiltro",
                    prefix: "",
                    message: "¿Qué querés filtrar?",
                    choices: [
                        { name: "🎯 Filtrar por estado", value: "estado" },
                        { name: "🔥 Filtrar por dificultad", value: "dificultad" },
                        { name: "↩ Volver", value: "volver" }
                    ]
                }
            ]);

            if (tipoFiltro === "volver") break;

            let resultado: Tareas[] = [];

            
            if (tipoFiltro === "estado") {
                const estados = gestor.cantidadPorEstado();

                console.clear();
                console.log("=== CANTIDAD DE TAREAS POR ESTADO ===\n");

                Object.entries(estados).forEach(([estado, cant]) => {
                    console.log(`📌 ${estado}: ${cant}`);
                });

                await inquirer.prompt([{ type: "input", name: "pause", message: "\nENTER para continuar..." }]);
                break;
            }

            
            if (tipoFiltro === "dificultad") {
                const { dificultadElegida } = await inquirer.prompt([
                    {
                        type: "list",
                        name: "dificultadElegida",
                        prefix: "",
                        message: "Elegí una dificultad:",
                        choices: [
                            { name: "🌑🌑🌑 (Fácil)", value: "baja" },
                            { name: "🌓🌓🌓 (Media)", value: "media" },
                            { name: "🌕🌕🌕 (Alta)", value: "alta" }
                        ]
                    }
                ]);

                if (dificultadElegida === "baja") resultado = gestor.tareasBaja();
                if (dificultadElegida === "media") resultado = gestor.tareasMedia();
                if (dificultadElegida === "alta") resultado = gestor.tareasAlta();
            }

           
            console.clear();
            console.log("=== RESULTADOS DEL FILTRO ===\n");

            if (resultado.length === 0) {
                console.log("⚠ No se encontraron tareas.\n");
            } else {
                resultado.forEach(t => {
                    console.log(`📌 ${t.titulo} (${t.id}) | Dificultad: ${t.dificultad} | Estado: ${t.estado}`);
                });
            }

            await inquirer.prompt([
                { type: "input", name: "pause", message: "\nENTER para continuar..." }
            ]);

            break;


        case "5":
            console.clear();
            console.log("=== ✏️ MODIFICAR TAREA ===\n");

            const titulosEditar = gestor.obtenerSoloTitulos();
            if (titulosEditar.length === 0) {
                console.log("No hay tareas para modificar.\n");
                break;
            }

            const { idEditar } = await inquirer.prompt([
                {
                    type: "list",
                    name: "idEditar",
                    message: "Elegí una tarea para modificar:",
                    prefix: "",
                    choices: titulosEditar.map(t => ({
                        name: `📝  [ ${t.titulo} ] (${t.id})`,
                        value: t.id
                    }))
                }
            ]);

            const tareaOriginal = gestor.obtener().find(t => t.id === idEditar);

            if (!tareaOriginal) {
                console.log("❌ Error: tarea no encontrada.");
                break;
            }

            let volverEditar = false;

            while (!volverEditar) {
                console.clear();
                mostrarTareaDetallada(tareaOriginal);

                const { opcionEdit } = await inquirer.prompt([
                    {
                        type: "list",
                        name: "opcionEdit",
                        message: "¿Qué querés modificar?",
                        prefix: "",
                        choices: [
                            { name: "✏️  Editar título", value: "titulo" },
                            { name: "📄  Editar descripción", value: "descripcion" },
                            { name: "🔥  Editar dificultad", value: "dificultad" },
                            { name: "📘  Editar estado", value: "estado" },
                            { name: "↩️  Volver", value: "volver" }
                        ]
                    }
                ]);

                if (opcionEdit === "titulo") {
                    const nuevoTitulo = prompt("Nuevo título: ");
                    if (nuevoTitulo.trim() !== "") {
                        gestor.editar(idEditar, { titulo: nuevoTitulo });
                        console.log("\n✔ Título actualizado.\n");
                    } else {
                        console.log("\n❌ Título inválido, no se cambió.\n");
                    }
                    prompt("ENTER para continuar...");
                }

                else if (opcionEdit === "descripcion") {
                    const nuevaDesc = prompt("Nueva descripción: ");
                    gestor.editar(idEditar, { descripcion: nuevaDesc });
                    console.log("\n✔ Descripción actualizada.\n");
                    prompt("ENTER para continuar...");
                }

                else if (opcionEdit === "dificultad") {
                    const { nuevaDif } = await inquirer.prompt([
                        {
                            type: "list",
                            name: "nuevaDif",
                            message: "Nueva dificultad:",
                            prefix: "",
                            choices: [
                                { name: "🌑🌑🌑  (Fácil)", value: 1 },
                                { name: "🌓🌓🌓  (Media)", value: 2 },
                                { name: "🌕🌕🌕  (Alta)", value: 3 }
                            ]
                        }
                    ]);

                    gestor.editar(idEditar, { dificultad: nuevaDif });
                    console.log("\n✔ Dificultad actualizada.\n");
                    prompt("ENTER para continuar...");
                }

                else if (opcionEdit === "estado") {
                    const { nuevoEstado } = await inquirer.prompt([
                        {
                            type: "list",
                            name: "nuevoEstado",
                            message: "Nuevo estado:",
                            prefix: "",
                            choices: [
                                { name: "Pendiente", value: "Pendiente" },
                                { name: "En curso", value: "En curso" },
                                { name: "Terminada", value: "Terminada" },
                                { name: "Cancelada", value: "Cancelada" }
                            ]
                        }
                    ]);

                    gestor.editar(idEditar, { estado: nuevoEstado });
                    console.log("\n✔ Estado actualizado.\n");
                    prompt("ENTER para continuar...");
                }

                else if (opcionEdit === "volver") {
                    volverEditar = true;
                }
            }

            break;

        case "6":


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


        case "7":

            console.clear();
            console.log("=== ELIMINAR TAREA ===\n");
            const titulosEliminar = gestor.obtenerSoloTitulos();

            if (titulosEliminar.length === 0) {
                console.log("No hay tareas para eliminar.\n");
                break;
            }
            const { idEliminar } = await inquirer.prompt([
                {
                    type: "list",
                    name: "idEliminar",
                    message: "Elegí una tarea para eliminar: \n\nTITULOS:\n\n",
                    prefix: "",
                    choices: titulosEliminar.map(t => ({
                        name: `[ ${t.titulo} ] (${t.id})\n`,
                        value: t.id
                    }))
                }
            ]);
            gestor.eliminarSuave(idEliminar);

            console.log("\n✔ Tarea eliminada correctamente.\n");
            break;


        case "8": console.clear();
            console.log("=== PAPELERA DE RECICLAJE ===\n");

            const tareasEliminadas = gestor.obtenerPapelera();

            if (tareasEliminadas.length === 0) {
                console.log("La papelera está vacía.\n");
                break;
            }

            const { idElegido } = await inquirer.prompt([
                {
                    type: "list",
                    name: "idElegido",
                    message: "Elegí una tarea eliminada:",
                    prefix: "",
                    choices: tareasEliminadas.map(t => ({
                        name: `🗑️  [ ${t.titulo} ]  (${t.id})`,
                        value: t.id
                    }))
                }
            ]);

            const { accion } = await inquirer.prompt([
                {
                    type: "list",
                    name: "accion",
                    message: "¿Qué querés hacer con esta tarea?",
                    prefix: "",
                    choices: [
                        { name: "♻️  Restaurar", value: "restaurar" },
                        { name: "❌  Eliminar definitivamente", value: "borrar" },
                        { name: "↩️  Volver", value: "volver" }
                    ]
                }
            ]);

            if (accion === "restaurar") {
                gestor.restaurar(idElegido);
                console.log("\n✔ Tarea restaurada correctamente.\n");
            } else if (accion === "borrar") {
                gestor.eliminarDefinitivo(idElegido);
                console.log("\n🗑️ Tarea eliminada definitivamente.\n");
            }

            prompt("ENTER para continuar...");
            break;


        case "0":
            console.log("Saliendo...");
            process.exit(0);
    }

}


