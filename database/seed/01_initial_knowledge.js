// database/seed/01_initial_knowledge.js
// 📚 Carga inicial de base de conocimiento

const initialKnowledge = [
  {
    title: 'Ley General de Cooperativas - Latinoamérica',
    content: `
      La Ley General de Cooperativas establece el marco legal para la creación,
      organización y funcionamiento de las cooperativas en la región.

      PRINCIPIOS FUNDAMENTALES:
      1. Gestión democrática: un asociado, un voto
      2. Participación económica equitativa
      3. Autonomía e independencia
      4. Educación, formación e información
      5. Cooperación entre cooperativas
      6. Interés por la comunidad

      REQUISITOS DE CONSTITUCIÓN:
      - Mínimo 20 asociados
      - Estatutos aprobados
      - Capital social suscrito
      - Inscripción en el registro correspondiente

      ÓRGANOS DE GOBIERNO:
      1. Asamblea General: máxima autoridad
      2. Consejo de Administración: gestión
      3. Comité de Vigilancia: control
      4. Gerencia: ejecución
    `,
    category: 'Legislación cooperativa',
    country: 'Latinoamérica',
    document_type: 'Ley',
    tags: ['ley', 'general', 'cooperativas', 'marco legal'],
    author: 'Legislación Regional'
  },
  {
    title: 'Control Democrático en Cooperativas',
    content: `
      El control democrático es el principio fundamental del cooperativismo.

      ELEMENTOS CLAVE:
      1. Asamblea General: decisión soberana
      2. Un asociado, un voto: igualdad
      3. Elecciones periódicas: renovación
      4. Participación activa: compromiso

      MECANISMOS DE CONTROL:
      - Votación en asambleas
      - Elección de directivos
      - Revocatoria de mandatos
      - Consultas populares
      - Comisiones de trabajo

      REQUISITOS LEGALES:
      - Quórum mínimo para asambleas
      - Mayorías calificadas para decisiones importantes
      - Actas de asambleas
      - Registro de acuerdos
    `,
    category: 'Gobierno cooperativo',
    country: 'Latinoamérica',
    document_type: 'Doctrina',
    tags: ['control', 'democrático', 'asamblea', 'voto'],
    author: 'Doctrina Cooperativa'
  },
  {
    title: 'Derechos y Obligaciones de Asociados',
    content: `
      DERECHOS DE LOS ASOCIADOS:
      1. Participar en asambleas y votar
      2. Elegir y ser elegido
      3. Recibir información
      4. Obtener servicios
      5. Participar en excedentes
      6. Retirarse voluntariamente

      OBLIGACIONES DE LOS ASOCIADOS:
      1. Cumplir con los estatutos
      2. Pagar aportes
      3. Asistir a asambleas
      4. Participar activamente
      5. Respetar decisiones
      6. Promover la cooperativa

      CAUSAS DE PÉRDIDA DE CALIDAD:
      1. Renuncia voluntaria
      2. Exclusión por incumplimiento
      3. Disolución de la cooperativa
      4. Fallecimiento
    `,
    category: 'Derechos de asociados',
    country: 'Latinoamérica',
    document_type: 'Doctrina',
    tags: ['derechos', 'obligaciones', 'asociados', 'participación'],
    author: 'Doctrina Cooperativa'
  },
  {
    title: 'Protección de Datos en Cooperativas',
    content: `
      MARCO LEGAL DE PROTECCIÓN DE DATOS:
      - Ley de Protección de Datos Personales
      - Reglamento de aplicación
      - Principios de consentimiento y finalidad

      OBLIGACIONES DE LA COOPERATIVA:
      1. Obtener consentimiento informado
      2. Garantizar seguridad de datos
      3. Mantener registros
      4. Atender derechos ARCO (Acceso, Rectificación, Cancelación, Oposición)
      5. Notificar violaciones

      DERECHOS DE LOS ASOCIADOS:
      - Acceder a sus datos
      - Rectificar información
      - Cancelar datos
      - Oponerse al tratamiento
      - Portabilidad de datos

      MEDIDAS DE SEGURIDAD:
      - Encriptación
      - Control de accesos
      - Copias de seguridad
      - Plan de respuesta a incidentes
    `,
    category: 'Protección de datos',
    country: 'Latinoamérica',
    document_type: 'Guía práctica',
    tags: ['datos', 'protección', 'privacidad', 'seguridad'],
    author: 'Guía Legal'
  },
  {
    title: 'Procedimiento de Fusión Cooperativa',
    content: `
      TIPOS DE FUSIÓN:
      1. Fusión por absorción: una cooperativa absorbe a otra(s)
      2. Fusión por integración: varias cooperativas crean una nueva

      REQUISITOS LEGALES:
      1. Acuerdo de asambleas (mayoría calificada)
      2. Informe de expertos
      3. Proyecto de fusión
      4. Aprobación de autoridades
      5. Publicación y notificación

      ETAPAS DEL PROCESO:
      1. Estudio de viabilidad
      2. Negociación de términos
      3. Acuerdo de fusión
      4. Aprobación en asambleas
      5. Trámites legales
      6. Registro e inscripción

      DERECHOS DE ASOCIADOS:
      - Derecho a información
      - Derecho a oposición
      - Derecho a retiro
      - Participación en nueva cooperativa
    `,
    category: 'Fusiones y reestructuración',
    country: 'Latinoamérica',
    document_type: 'Guía práctica',
    tags: ['fusión', 'absorción', 'integración', 'reestructuración'],
    author: 'Guía Legal'
  },
  {
    title: 'Estatutos Modelo para Cooperativas',
    content: `
      ESTRUCTURA DE ESTATUTOS:

      CAPÍTULO I: DISPOSICIONES GENERALES
      - Denominación, domicilio y duración
      - Objeto social
      - Principios cooperativos

      CAPÍTULO II: DE LOS ASOCIADOS
      - Requisitos de ingreso
      - Derechos y obligaciones
      - Pérdida de calidad

      CAPÍTULO III: DEL RÉGIMEN ECONÓMICO
      - Capital social
      - Aportes
      - Excedentes
      - Fondo de reserva

      CAPÍTULO IV: DE LA ADMINISTRACIÓN
      - Asamblea General
      - Consejo de Administración
      - Comité de Vigilancia
      - Gerencia

      CAPÍTULO V: DE LA DISOLUCIÓN Y LIQUIDACIÓN
      - Causas de disolución
      - Procedimiento de liquidación
      - Destino de bienes
    `,
    category: 'Estatutos modelo',
    country: 'Latinoamérica',
    document_type: 'Estatuto',
    tags: ['estatutos', 'modelo', 'estructura', 'reglamento'],
    author: 'Modelo Estatutos'
  }
];

module.exports = { initialKnowledge };