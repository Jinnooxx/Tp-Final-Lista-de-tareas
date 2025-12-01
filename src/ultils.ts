import inquirer  from "inquirer";

export async function menuFlechita() {
  const opcion = await inquirer.prompt([
    {
      type: "list",
      name: "menu",
      message: "Seleccioná una opción:",
      choices: [
        "📋 Ver tareas",
        "➕ Agregar tarea",
        "❌ Eliminar tarea",
        "🚪 Salir"
      ]
    }
  ]);

  console.log("Elegiste:", opcion.menu);
}
