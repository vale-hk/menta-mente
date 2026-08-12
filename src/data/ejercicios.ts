export type Ejercicio =
  | {
      id: string;
      categoria: Categoria;
      titulo: string;
      instrucciones: string;
      tipo: "opcion-multiple";
      enunciado: string;
      opciones: string[];
      correcta: number;
    }
  | {
      id: string;
      categoria: Categoria;
      titulo: string;
      instrucciones: string;
      tipo: "seleccion-multiple";
      items: string[];
      correctas: number[];
    }
  | {
      id: string;
      categoria: Categoria;
      titulo: string;
      instrucciones: string;
      tipo: "orden";
      pasos: string[];
    }
  | {
      id: string;
      categoria: Categoria;
      titulo: string;
      instrucciones: string;
      tipo: "emparejar";
      pares: { izquierda: string; derecha: string }[];
    }
  | {
      id: string;
      categoria: Categoria;
      titulo: string;
      instrucciones: string;
      tipo: "texto";
      preguntas: { pregunta: string; respuestas: string[] }[];
    }
  | {
      id: string;
      categoria: Categoria;
      titulo: string;
      instrucciones: string;
      tipo: "memoria-lista";
      lista: string[];
      distractores?: string[];
      segundos: number;
    }
  | {
      id: string;
      categoria: Categoria;
      titulo: string;
      instrucciones: string;
      tipo: "clasificar";
      grupos: string[];
      items: { texto: string; grupo: string }[];
    }
  | {
      id: string;
      categoria: Categoria;
      titulo: string;
      instrucciones: string;
      tipo: "verdadero-falso";
      afirmaciones: { texto: string; correcta: boolean }[];
    };

export type Categoria = "atencion" | "memoria" | "funciones-ejecutivas" | "lenguaje";

export const categorias: { id: Categoria; titulo: string; resumen: string }[] = [
  {
    id: "atencion",
    titulo: "Atención",
    resumen: "Sostener y focalizar el foco atencional frente a distractores.",
  },
  {
    id: "memoria",
    titulo: "Memoria",
    resumen: "Codificación, retención y evocación de información cotidiana.",
  },
  {
    id: "funciones-ejecutivas",
    titulo: "Funciones ejecutivas",
    resumen: "Planificación, secuenciación, cálculo e inhibición.",
  },
  {
    id: "lenguaje",
    titulo: "Lenguaje",
    resumen: "Acceso léxico, denominación, comprensión y discurso.",
  },
];

export const ejercicios: Ejercicio[] = [
  // ATENCIÓN
  {
    id: "at-1",
    categoria: "atencion",
    titulo: "Rastreo de la letra objetivo",
    instrucciones: "Toque todas las letras «M» que encuentre. Cuando termine, revise su trabajo.",
    tipo: "seleccion-multiple",
    items: ["N", "M", "W", "M", "H", "N", "M", "V", "M", "W", "N", "M", "H", "M", "V", "N"],
    correctas: [1, 3, 6, 8, 11, 13],
  },
  {
    id: "at-2",
    categoria: "atencion",
    titulo: "El intruso de la serie",
    instrucciones: "Marque las palabras que NO pertenecen al grupo de las frutas.",
    tipo: "seleccion-multiple",
    items: ["Manzana", "Martillo", "Pera", "Escoba", "Naranja", "Silla", "Uva", "Plátano"],
    correctas: [1, 3, 5],
  },
  {
    id: "at-3",
    categoria: "atencion",
    titulo: "Continúe la secuencia",
    instrucciones: "Observe la serie y elija el número que sigue.",
    tipo: "opcion-multiple",
    enunciado: "2 · 4 · 6 · 8 · 10 · ?",
    opciones: ["11", "12", "14", "16"],
    correcta: 1,
  },
  {
    id: "at-4",
    categoria: "atencion",
    titulo: "Diferencias en el detalle",
    instrucciones: "Compare ambas listas y elija el elemento que cambió.",
    tipo: "opcion-multiple",
    enunciado: "Lista A: pan, leche, té, sal — Lista B: pan, leche, café, sal",
    opciones: ["Pan", "Leche", "Té por café", "Sal"],
    correcta: 2,
  },

  // MEMORIA
  {
    id: "me-1",
    categoria: "memoria",
    titulo: "Lista de compras del almacén",
    instrucciones:
      "Memorice la lista durante 30 segundos. Luego marque solo los productos que aparecían.",
    tipo: "memoria-lista",
    lista: ["Pan", "Leche", "Arroz", "Té", "Jabón", "Manzanas", "Aceite", "Huevos"],
    segundos: 30,
  },
  {
    id: "me-2",
    categoria: "memoria",
    titulo: "Memoria remota y datos personales",
    instrucciones: "Responda con una palabra o número. Ejercita la memoria semántica y autobiográfica.",
    tipo: "texto",
    preguntas: [
      { pregunta: "¿Cuántos días tiene una semana?", respuestas: ["7", "siete"] },
      { pregunta: "¿En qué mes se celebran las Fiestas Patrias en Chile?", respuestas: ["septiembre"] },
      { pregunta: "¿Cuál es la capital de Chile?", respuestas: ["santiago"] },
    ],
  },
  {
    id: "me-3",
    categoria: "memoria",
    titulo: "Pares asociados",
    instrucciones: "Una cada objeto con el lugar donde se guarda habitualmente.",
    tipo: "emparejar",
    pares: [
      { izquierda: "Tenedor", derecha: "Cajón de la cocina" },
      { izquierda: "Toalla", derecha: "Baño" },
      { izquierda: "Almohada", derecha: "Dormitorio" },
      { izquierda: "Martillo", derecha: "Caja de herramientas" },
    ],
  },

  // FUNCIONES EJECUTIVAS
  {
    id: "fe-1",
    categoria: "funciones-ejecutivas",
    titulo: "Planificar la once del domingo",
    instrucciones: "Ordene los pasos desde el primero hasta el último usando las flechas.",
    tipo: "orden",
    pasos: [
      "Definir cuánto dinero se puede gastar",
      "Hacer la lista de lo que falta",
      "Ir a comprar al almacén",
      "Preparar el té y la comida",
      "Poner la mesa",
      "Servir a los invitados",
    ],
  },
  {
    id: "fe-2",
    categoria: "funciones-ejecutivas",
    titulo: "Cálculo del vuelto",
    instrucciones: "Resuelva la situación cotidiana y elija la alternativa correcta.",
    tipo: "opcion-multiple",
    enunciado: "Compra pan por $2.300 y paga con $5.000. ¿Cuánto vuelto recibe?",
    opciones: ["$2.700", "$2.300", "$3.700", "$1.700"],
    correcta: 0,
  },
  {
    id: "fe-3",
    categoria: "funciones-ejecutivas",
    titulo: "Inhibición: haga lo contrario",
    instrucciones: "Si la palabra dice ARRIBA, elija ABAJO. Responda lo contrario de lo que lee.",
    tipo: "opcion-multiple",
    enunciado: "Palabra presentada: ARRIBA",
    opciones: ["Arriba", "Abajo", "Al lado", "Adelante"],
    correcta: 1,
  },
  {
    id: "fe-4",
    categoria: "funciones-ejecutivas",
    titulo: "Secuencia de la mañana",
    instrucciones: "Ordene la rutina de la mañana en el orden correcto.",
    tipo: "orden",
    pasos: ["Despertar", "Levantarse de la cama", "Lavarse la cara", "Vestirse", "Tomar desayuno"],
  },

  // LENGUAJE
  {
    id: "le-1",
    categoria: "lenguaje",
    titulo: "Fluencia semántica escrita",
    instrucciones: "Escriba una palabra en cada campo según la categoría pedida.",
    tipo: "texto",
    preguntas: [
      { pregunta: "Escriba el nombre de un animal que vuele", respuestas: ["pajaro", "pájaro", "aguila", "águila", "loro", "paloma", "gorrion", "gorrión", "colibri", "colibrí", "mosca", "abeja", "mariposa", "condor", "cóndor"] },
      { pregunta: "Escriba una fruta de color amarillo", respuestas: ["platano", "plátano", "limon", "limón", "pina", "piña", "mango", "membrillo"] },
      { pregunta: "Escriba una prenda de vestir para el frío", respuestas: ["chaleco", "abrigo", "parka", "bufanda", "gorro", "chaqueta", "sueter", "suéter", "guantes"] },
    ],
  },
  {
    id: "le-2",
    categoria: "lenguaje",
    titulo: "Refranes incompletos",
    instrucciones: "Complete el refrán eligiendo la alternativa correcta.",
    tipo: "opcion-multiple",
    enunciado: "«A quien madruga…»",
    opciones: ["…le duele la espalda", "…Dios lo ayuda", "…se le hace tarde", "…lo esperan"],
    correcta: 1,
  },
  {
    id: "le-3",
    categoria: "lenguaje",
    titulo: "Sinónimos",
    instrucciones: "Una cada palabra con su sinónimo.",
    tipo: "emparejar",
    pares: [
      { izquierda: "Alegre", derecha: "Contento" },
      { izquierda: "Veloz", derecha: "Rápido" },
      { izquierda: "Hermoso", derecha: "Bonito" },
      { izquierda: "Tranquilo", derecha: "Calmado" },
    ],
  },
  {
    id: "le-4",
    categoria: "lenguaje",
    titulo: "Comprensión de órdenes",
    instrucciones: "Lea con atención y elija la respuesta correcta.",
    tipo: "opcion-multiple",
    enunciado:
      "«María fue a la feria antes de pasar por la farmacia». ¿Dónde estuvo primero María?",
    opciones: ["En la farmacia", "En la feria", "En su casa", "En el almacén"],
    correcta: 1,
  },

  // ===== NUEVAS ACTIVIDADES =====

  // ATENCIÓN
  {
    id: "at-5",
    categoria: "atencion",
    titulo: "Cancelación de números pares",
    instrucciones: "Marque todos los números pares de la cuadrícula. Deje sin marcar los impares.",
    tipo: "seleccion-multiple",
    items: ["7", "12", "3", "20", "15", "8", "9", "4", "11", "18", "5", "6"],
    correctas: [1, 3, 5, 7, 9, 11],
  },
  {
    id: "at-6",
    categoria: "atencion",
    titulo: "Atención dividida: dos criterios",
    instrucciones:
      "Clasifique cada elemento según sea algo que se come o algo que se usa para limpiar.",
    tipo: "clasificar",
    grupos: ["Se come", "Sirve para limpiar"],
    items: [
      { texto: "Pan", grupo: "Se come" },
      { texto: "Escoba", grupo: "Sirve para limpiar" },
      { texto: "Queso", grupo: "Se come" },
      { texto: "Detergente", grupo: "Sirve para limpiar" },
      { texto: "Manzana", grupo: "Se come" },
      { texto: "Trapero", grupo: "Sirve para limpiar" },
    ],
  },
  {
    id: "at-7",
    categoria: "atencion",
    titulo: "Series alternadas",
    instrucciones: "Observe el patrón que alterna y elija el elemento que continúa.",
    tipo: "opcion-multiple",
    enunciado: "A · 1 · B · 2 · C · 3 · D · ?",
    opciones: ["E", "4", "5", "D"],
    correcta: 1,
  },

  // MEMORIA
  {
    id: "me-4",
    categoria: "memoria",
    titulo: "Recado telefónico",
    instrucciones:
      "Memorice el recado durante 25 segundos y luego marque solo los datos que aparecían.",
    tipo: "memoria-lista",
    lista: ["Doctora Rojas", "Martes", "10:30", "Consultorio 4", "Llevar carné"],
    segundos: 25,
  },
  {
    id: "me-5",
    categoria: "memoria",
    titulo: "Memoria de trabajo: orden inverso",
    instrucciones: "Lea la serie y responda por escrito según se indica.",
    tipo: "texto",
    preguntas: [
      { pregunta: "Serie 4 - 7 - 9. Escríbala al revés (sin espacios ni guiones)", respuestas: ["974"] },
      { pregunta: "Serie 2 - 5 - 8 - 1. Escríbala al revés", respuestas: ["1852"] },
      { pregunta: "Palabra CASA escrita al revés", respuestas: ["asac"] },
    ],
  },
  {
    id: "me-6",
    categoria: "memoria",
    titulo: "Memoria semántica: ¿verdadero o falso?",
    instrucciones: "Indique si cada afirmación es verdadera o falsa.",
    tipo: "verdadero-falso",
    afirmaciones: [
      { texto: "El invierno en Chile comienza en junio.", correcta: true },
      { texto: "Un año tiene trece meses.", correcta: false },
      { texto: "El agua hierve y se convierte en vapor.", correcta: true },
      { texto: "La luna sale durante el día y nunca de noche.", correcta: false },
    ],
  },

  // FUNCIONES EJECUTIVAS
  {
    id: "fe-5",
    categoria: "funciones-ejecutivas",
    titulo: "Organizar el trámite en el banco",
    instrucciones: "Ordene los pasos del trámite desde el primero hasta el último.",
    tipo: "orden",
    pasos: [
      "Reunir los documentos necesarios",
      "Sacar número de atención",
      "Esperar el turno",
      "Explicar el trámite al ejecutivo",
      "Firmar los papeles",
      "Guardar el comprobante",
    ],
  },
  {
    id: "fe-6",
    categoria: "funciones-ejecutivas",
    titulo: "Presupuesto de la semana",
    instrucciones: "Resuelva el cálculo y elija la alternativa correcta.",
    tipo: "opcion-multiple",
    enunciado:
      "Dispone de $20.000. Gasta $6.500 en verduras y $4.800 en carne. ¿Cuánto le queda?",
    opciones: ["$8.700", "$9.700", "$11.300", "$8.300"],
    correcta: 0,
  },
  {
    id: "fe-7",
    categoria: "funciones-ejecutivas",
    titulo: "Clasificar por urgencia",
    instrucciones: "Decida qué situaciones requieren atención inmediata y cuáles pueden esperar.",
    tipo: "clasificar",
    grupos: ["Atender ahora", "Puede esperar"],
    items: [
      { texto: "Se corta la luz de noche", grupo: "Atender ahora" },
      { texto: "Regar las plantas", grupo: "Puede esperar" },
      { texto: "Se quema una olla en la cocina", grupo: "Atender ahora" },
      { texto: "Ordenar el clóset", grupo: "Puede esperar" },
      { texto: "Olvidó tomar el remedio de la mañana", grupo: "Atender ahora" },
      { texto: "Devolver un libro prestado", grupo: "Puede esperar" },
    ],
  },

  // LENGUAJE
  {
    id: "le-5",
    categoria: "lenguaje",
    titulo: "Antónimos",
    instrucciones: "Una cada palabra con su significado contrario.",
    tipo: "emparejar",
    pares: [
      { izquierda: "Frío", derecha: "Caliente" },
      { izquierda: "Lleno", derecha: "Vacío" },
      { izquierda: "Antiguo", derecha: "Nuevo" },
      { izquierda: "Difícil", derecha: "Fácil" },
    ],
  },
  {
    id: "le-6",
    categoria: "lenguaje",
    titulo: "Definiciones: ¿de qué hablamos?",
    instrucciones: "Lea la definición y escriba la palabra correspondiente.",
    tipo: "texto",
    preguntas: [
      { pregunta: "Objeto que sirve para saber la hora", respuestas: ["reloj", "el reloj"] },
      { pregunta: "Lugar donde se compran los remedios", respuestas: ["farmacia", "la farmacia"] },
      { pregunta: "Persona que apaga los incendios", respuestas: ["bombero", "el bombero", "bomberos"] },
    ],
  },
  {
    id: "le-7",
    categoria: "lenguaje",
    titulo: "Categorías semánticas",
    instrucciones: "Clasifique cada palabra en la categoría a la que pertenece.",
    tipo: "clasificar",
    grupos: ["Animales", "Medios de transporte"],
    items: [
      { texto: "Caballo", grupo: "Animales" },
      { texto: "Micro", grupo: "Medios de transporte" },
      { texto: "Gato", grupo: "Animales" },
      { texto: "Tren", grupo: "Medios de transporte" },
      { texto: "Gallina", grupo: "Animales" },
      { texto: "Bicicleta", grupo: "Medios de transporte" },
    ],
  },
];
