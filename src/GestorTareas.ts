import fs from "fs";


import {
    crearTareas,
    agregarTarea,
    marcarTareaCompletada,
    editarTarea,
    buscarPorPalabraClave,
    ordenarTitulo,
    ordenarPorDificultad,
    cantidadPorEstado,
    softDelete,
    hardDelete
} from "./Funciones";

import { Tareas } from "../models/Tareas";



export class GestorTareas {
    private lista: Tareas[] = [];
    private archivo = "tareas.json";



    constructor() {
        this.cargar();
    }


    private cargar() {
        if (!fs.existsSync(this.archivo)) {
            this.lista = [];
            return;
        }

        const data = fs.readFileSync(this.archivo, "utf8");
        const json = JSON.parse(data);

        this.lista = json.map((t: any) => Object.assign(new Tareas(t.titulo, 1), t));
    }


    private guardar() {
        fs.writeFileSync(this.archivo, JSON.stringify(this.lista, null, 2));
    }



    nueva(titulo: string, nivel: number, descripcion?: string) {
        const tarea = crearTareas(titulo, nivel, descripcion);
        this.lista = agregarTarea(this.lista, tarea);
        this.guardar();

    }

    eliminarSuave(id: string) {
        this.lista = softDelete(this.lista, id);
        this.guardar();
    }

    eliminarDefinitivo(id: string) {
        this.lista = hardDelete(this.lista, id);
        this.guardar();
    }


    

    completar(id: string) {
        this.lista = marcarTareaCompletada(this.lista, id);
        this.guardar();

    }

    editar(id: string, cambios: Partial<Tareas>) {
        this.lista = editarTarea(this.lista, id, cambios);
        this.guardar();

    }

    buscar(palabra: string): Tareas[] {
        return buscarPorPalabraClave(this.lista, palabra);
    }

    ordenarTitulo() {
        this.lista = ordenarTitulo(this.lista);
    }

    ordenarDificultad() {
        this.lista = ordenarPorDificultad(this.lista);
    }

    obtener(): Tareas[] {
        return [...this.lista];
    }

    resumenEstados() {
        return cantidadPorEstado(this.lista);
    }
}
