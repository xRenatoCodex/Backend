import { z } from 'zod';

// 1. Definimos los listados de opciones permitidas como constantes
const QUE_SE_ENCONTRO_OPTIONS = [
    "ATASCAMIENTO / AGARROTAMIENTO", "BUENAS CONDICIONES", "buscar que se encontro",
    "CONTAMINACIÓN / MATERIAL EXTRAÑO", "CONTAMINACIÓN DE FLUIDO", "DEFECTO DE RECUBRIMIENTO",
    "DEFECTO DE SOLDADURA", "DEFLECTOR SUELTO", "DEFORMACIÓN / DEFLEXIÓN", "DESGASTE",
    "DESGASTE ADHESIVO", "DESGASTE ESCALONADO", "DESGASTE Y FISURAS", "DESPRENDIMIENTO DE MATERIAL",
    "DETERIORO", "EROSIÓN POR CAVITACIÓN", "FALTA DE DOCUMENTO TÉCNICO", "FALTA DE LUBRICACIÓN",
    "FISURAS", "FRETTING", "FUERA DE ESPECIFICACIONES", "FUGA", "HILOS ALTOS",
    "INDENTACIÓN / HENDIDURA", "NO APLICA", "ÓXIDO / CORROSIÓN", "PARTE / REPUESTO FALTANTE",
    "PARTE / REPUESTO NO CAT", "PARTE(S) NO PERTENECE(N) A COMPONENTE", "PICADURAS", "POROSIDAD",
    "POSIBLES FISURAS", "RAYADURAS", "ROTURA / FRACTURA", "SCORING"
] as const;

const DONDE_SE_ENCONTRO_OPTIONS = [
    "ACOPLE CON SLEEVE 2.0", "ALOJAMIENTO DE BEARING", "ALOJAMIENTO DE INYECTOR",
    "ALOJAMIENTO DE PIN", "ALOJAMIENTO DE SELLO", "ALOJAMIENTO DE SELLO DUO CONE",
    "ALOJAMIENTO EJE PIVOT", "ALOJAMIENTO INTERNO DE PIN", "ALOJAMIENTOS", "ALOJAMIENTOS ROSCADOS",
    "BARRA ECUALIZADORA", "buscar donde se encontro", "CANAL CHAVETERO",
    "CANAL CHAVETERO / DIAMETRO EXTERIOR", "CANAL GUÍA", "CARA DEL DIENTE", "CONTRAPESO",
    "DIAMETRO DE ASENTAMIENTO", "DIAMETRO DE BOCINA", "DIÁMETRO EXTERNO", "DIÁMETRO INTERNO",
    "EJE", "ESTRUCTURA / CUERPO", "FALDA", "GALERÍAS DE LUBRICACIÓN", "GENERAL", "HOUSING",
    "IMPACTO DE BOGGIES", "INSERTO", "LATERAL", "MATERIAL DE FRICCIÓN", "nueva revisión",
    "nuevaimagenes", "nuevapo", "nuevoplan", "nuevoregistro", "PARABRISAS", "PARRILLAS DE CAUCHO",
    "PARTE / SUPERFICIE EXTERIOR", "PARTE / SUPERFICIE INTERIOR", "PERNO(S)", "PIEZA", "PIEZA ENTERA",
    "PIN DE TRABA", "prueba 7", "PUÑO DE BIELA Y BANCADA", "RANURA DE ANILLOS", "REPUESTO",
    "RODAJE", "RODILLOS PESTAÑA SIMPLE Y DOBLE", "RODILLOS Y RUEDAS", "RODILLOS Y/O RUEDAS GUÍAS",
    "RUEDA GUIA", "SEGMENTO ROSCADO", "SELLO(S)", "SHAFT PIVOT", "SOPORTE", "SOPORTE DE PIN",
    "SUPERFICIE DE COMBUSTIÓN", "SUPERFICIE DE CONTACTO", "SUPERFICIE DE CONTACTO CON MANIFOLD",
    "SUPERFICIE DE VISOR", "SUPERFICIE EXTERNA", "SUPERFICIE PLANA", "UBICACION NUEVA",
    "UNIÓN SOLDADA", "UNION TUBO FRAME", "UNION TUBO Y NUT", "VOLANTE", "ZONA DE PLANCHA",
    "ZONA DE RODADURA", "ZONA DE SELLADO", "ZONA DENTADA", "ZONA ESTRIADA", "ZONA EXTERNA",
    "ZONA EXTERNA Y ZONA DENTADA", "ZONA EXTERNA, ZONA DE CONCENTRACION DE ESFUERZO", "ZONA INTERNA"
] as const;

const QUE_SE_VA_REALIZAR_OPTIONS = [
    "EVALUAR", "EVALUAR/RECUPERAR", "FALTANTE", "FUERA DE SERVICIO", "RECUPERAR", "REUTILIZAR"
] as const;

// Agrupamos todas las posibles opciones "adicionales" para validación estricta
const ADICIONALES_OPTIONS = [
    "INTERNA", "PROVEEDOR", "SOLDADURA/MECANIZADO", "CORE / REMAN", "NUEVO"
] as const;

// 2. Definimos sub-esquemas reutilizables
const AmountChangeSchema = z.object({
    type: z.enum(["set", "add", "remove"]).describe("El tipo de operación a realizar sobre el valor"),
    value: z.number().describe("El valor numérico asociado a la operación")
});

// 3. Esquema Principal
export const MaintenanceRecordSchema = z.object({
    part_number: z.string().regex(/^[A-Za-z]{5,7}$/, "Debe contener entre 5 a 7 letras sin espacios").nullable()
        .describe("El número de parte mencionado. Si no se menciona, null."),

    cantidad: AmountChangeSchema.nullable()
        .describe("Cambio en la cantidad de items. Null si no aplica."),

    horas: AmountChangeSchema.nullable()
        .describe("Cambio en las horas registradas. Null si no aplica."),

    que_se_encontro: z.enum(QUE_SE_ENCONTRO_OPTIONS).nullable()
        .describe("La condición o hallazgo encontrado en la pieza."),

    donde_se_encontro: z.enum(DONDE_SE_ENCONTRO_OPTIONS).nullable()
        .describe("La ubicación específica dentro del componente donde se encontró el hallazgo."),

    que_se_va_realizar: z.enum(QUE_SE_VA_REALIZAR_OPTIONS).nullable()
        .describe("La acción principal a tomar."),

    que_se_va_realizar_adicional: z.enum(ADICIONALES_OPTIONS).nullable()
        .describe("Detalle adicional de la acción. Debe ser coherente con la acción principal (ej. si es FUERA DE SERVICIO, solo puede ser CORE / REMAN o NUEVO)."),

    comentarios_internos: z.string().nullable()
        .describe("Comentarios técnicos o internos sobre el hallazgo."),

    comentarios_externos: z.string().nullable()
        .describe("Comentarios dirigidos al cliente o reporte externo.")
});