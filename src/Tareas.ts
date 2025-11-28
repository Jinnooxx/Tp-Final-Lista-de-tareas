
export type Dificultad = "🌑🌑🌑" | "🌓🌓🌓" | "🌕🌕🌕";

export function dificultadDesdeNumero(nivel: number): Dificultad {
  const opciones: Dificultad[] = ["🌑🌑🌑", "🌓🌓🌓", "🌕🌕🌕"];
  return opciones[nivel - 1] ?? "🌑🌑🌑";
}


export class Tareas {

    id: String;
    titulo: String;
    dificultad: Dificultad;
    eliminada: boolean = false;
    completada: boolean = false;

    constructor(titulo: String, nivelDificultad: number){

        this.id = crypto.randomUUID();
        this.titulo = titulo;
        this.dificultad = dificultadDesdeNumero(nivelDificultad);


    }

    completar(){

        this.completada = true;

    }

    eliminar(){
        
        this.eliminada = true;
    }


}