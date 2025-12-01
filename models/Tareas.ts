
export type Dificultad = "🌑🌑🌑" | "🌓🌓🌓" | "🌕🌕🌕";

export type EstadoTarea = "Pendiente" | "En curso" | "Terminada" | "Cancelada";

export function dificultadDesdeNumero(nivel: number): Dificultad {
    const opciones: Dificultad[] = ["🌑🌑🌑", "🌓🌓🌓", "🌕🌕🌕"];
    return opciones[nivel - 1] ?? "🌑🌑🌑";
}




export class Tareas {

    id: string;
    titulo: string;
    dificultad: Dificultad;
    descripcion?: string;
    estado: EstadoTarea;
    cracion?: Date;
    ultimaEdicion?: Date;
    vencimiento?: Date;
    eliminada: boolean = false;
    completada: boolean = false;

    constructor(titulo: string, nivelDificultad: number) {

        this.id = crypto.randomUUID();
        this.titulo = titulo;
        this.dificultad = dificultadDesdeNumero(nivelDificultad);
        this.estado = "Pendiente";
        this.cracion = new Date();
        this.ultimaEdicion = new Date();


    }

    completar() {

        this.completada = true;
        this.estado = "Terminada";
        this.ultimaEdicion = new Date();

    }

    eliminar() {

        this.eliminada = true;
    }


}