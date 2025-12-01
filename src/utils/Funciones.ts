import { Tareas } from "../../models/Tareas";




export function crearTareas(titulo: string, nivel: number, descripcion?: string): Tareas {

    const t = new Tareas(titulo, nivel);
    if (descripcion) t.descripcion = descripcion;
    return t;


}




export function agregarTarea(lista: Tareas[], nueva: Tareas): Tareas[] {

    return [...lista, nueva];

}

export function softDelete(lista: Tareas[], id: string): Tareas[] {
    return lista.map(t => {
        if (t.id === id) {

            const tarea = new Tareas(t.titulo, 1);
            Object.assign(tarea, t);
            tarea.eliminada = true;
            tarea.ultimaEdicion = new Date();

            return tarea;
        }
        return t;
    });
}


export function hardDelete(lista: Tareas[], id: string): Tareas[] {
    return lista.filter(t => t.id !== id);
}


export function marcarTareaCompletada(lista: Tareas[], id: string): Tareas[] {
    return lista.map(t => {
        if (t.id !== id) return t;

        const nueva = { ...t };
        nueva.completada = true;
        nueva.estado = "Terminada";
        nueva.ultimaEdicion = new Date();

        return nueva as Tareas;
    });
}


export function editarTarea(
    lista: Tareas[],
    id: string,
    cambios: Partial<Tareas>
): Tareas[] {

    return lista.map(t => {
        if (t.id !== id) return t;

        const nueva = new Tareas(t.titulo, 1);

        Object.assign(nueva, t);

        Object.assign(nueva, cambios);

        nueva.ultimaEdicion = new Date();

        return nueva;
    });



}

export function ordenarTitulo(lista: Tareas[]): Tareas[] {

    return [...lista].sort((a, b) => a.titulo.localeCompare(b.titulo));

}

export function ordenarPorDificultad(lista: Tareas[]): Tareas[] {

    return [...lista].sort((a, b) => a.dificultad.localeCompare(b.dificultad));
}


export function cantidadPorEstado(lista: Tareas[]): Record<string, number> {
    return lista.reduce((acc, t) => {
        acc[t.estado] = (acc[t.estado] ?? 0) + 1;
        return acc;
    }, {} as Record<string, number>);
}


export function tareasAlta(lista: Tareas[]): Tareas[] {

    return lista.filter(t => t.dificultad === "🌕🌕🌕");

}

export function tareasMedia(lista: Tareas[]): Tareas[] {
    return lista.filter(t => t.dificultad === "🌓🌓🌓");
}

export function tareasBaja(lista: Tareas[]): Tareas[] {
    return lista.filter(t => t.dificultad === "🌑🌑🌑");
}


export function tareasVencidas(lista: Tareas[]): Tareas[] {
    const hoy = new Date();
    return lista.filter(t => t.vencimiento && t.vencimiento < hoy);
}


export function buscarTareaPorTitulo(tareas: Tareas[], titulo: string): Tareas[] {

    return tareas.filter(t => t.titulo.toLowerCase().includes(titulo.toLowerCase()));

}


export function buscarPorPalabraClave(
    tareas: Tareas[],
    palabra: string
): Tareas[] {
    const clave = palabra.toLowerCase();

    return tareas.filter(t =>
        t.titulo.toLowerCase().includes(clave) ||
        (t.descripcion?.toLowerCase().includes(clave) ?? false)
    );
}

export function obtenerTitulos(lista: Tareas[]): { id: string, titulo: string }[] {
    return lista
        .filter(t => !t.eliminada)
        .map(t => ({
            id: t.id,
            titulo: t.titulo
        }));
}



export function mostrarTareaDetallada(t: Tareas): string {
    return `
            === DETALLES DE LA TAREA ===

            📌 Título: ${t.titulo}\n
            📝 Descripción: ${t.descripcion || "—"}\n
            🔥 Dificultad: ${t.dificultad}\n
            📅 Creada: ${t.creacion}\n
            🛠 Última edición: ${t.ultimaEdicion || "—"}\n
            📍 Estado: ${t.estado}\n
            🗑 Eliminada: ${t.eliminada ? "Sí" : "No"}\n
            ⏳ Vencimiento: ${t.vencimiento || "—"}\n

            `;
}









