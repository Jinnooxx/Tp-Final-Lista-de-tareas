import { Tareas } from "../src/Tareas";




export function agregarTarea(lista: Tareas[], nueva: Tareas): Tareas[]{

    return[...lista, nueva];

}

export function eliminarTareas(lista: Tareas[], id: string): Tareas[]{

    return lista.filter(t => t.id !== id);
}

export function ordenarPorTitulo(lista: Tareas[]): Tareas[]{

    return [...lista].sort((a,b) => a.titulo.localeCompare(b.titulo));
}