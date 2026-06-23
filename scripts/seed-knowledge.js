// scripts/seed-knowledge.js
// 📚 BASE DE CONOCIMIENTO COMPLETA PARA LEGAL-iCoop

const { Client, Databases } = require('node-appwrite');

// Configuración
const PROJECT_ID = '6a38b6df001711622c4b';
const DATABASE_ID = '6a38d4a10015c8312dec';
const API_KEY = 'standard_216561a33a29b2e89dd5f94af3ef7ba8051eea692f580133f4126d989f077eec60ec91a80b0604dd412bf50d50ea133e64c725bc69fb8473f1003b03a19014a5de7f134d8f2f1f8b74e02966fa5e7a90d23168f161cfc17321c6a4904cfe3134174a352c978dfe76ec7edd821d4c98ac30ed44253ddbc35b3df2065536ae85b0';
const ENDPOINT = 'https://appwrite.muxiistudio.com/v1';
const COLLECTION_ID = 'conocimiento_base';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new Databases(client);

// 📚 TODOS LOS DOCUMENTOS (17)
const knowledgeData = [
  // ==========================================================
  // 1. LEGISLACIÓN COOPERATIVA
  // ==========================================================
  {
    Titulo: 'Ley General de Cooperativas - Marco Legal Completo',
    Contenido: `LEY GENERAL DE COOPERATIVAS - DISPOSICIONES GENERALES

CAPÍTULO I: NATURALEZA Y PRINCIPIOS

Artículo 1.- Las cooperativas son asociaciones autónomas de personas que se unen voluntariamente para satisfacer sus necesidades y aspiraciones económicas, sociales y culturales en común, mediante una empresa de propiedad conjunta y de gestión democrática.

Artículo 2.- Principios cooperativos:
1. Adhesión voluntaria y abierta
2. Gestión democrática (un asociado, un voto)
3. Participación económica de los asociados
4. Autonomía e independencia
5. Educación, formación e información
6. Cooperación entre cooperativas
7. Interés por la comunidad

CAPÍTULO II: CONSTITUCIÓN

Artículo 3.- Requisitos para constituir una cooperativa:
1. Mínimo 20 asociados (o 5 en cooperativas de trabajo)
2. Estatutos sociales aprobados
3. Capital social suscrito
4. Inscripción en el registro público

Artículo 4.- El capital social se integra con los aportes de los asociados.

CAPÍTULO III: ÓRGANOS DE GOBIERNO

Artículo 5.- Son órganos de la cooperativa:
1. Asamblea General: máxima autoridad
2. Consejo de Administración: gestión y representación
3. Comité de Vigilancia: control interno
4. Gerencia: ejecución administrativa

Artículo 6.- La Asamblea General se reúne ordinariamente una vez al año y extraordinariamente cuando sea convocada.

CAPÍTULO IV: DE LOS ASOCIADOS

Artículo 7.- Son derechos de los asociados:
1. Participar en asambleas
2. Elegir y ser elegido
3. Recibir información
4. Participar en excedentes
5. Retirarse voluntariamente

Artículo 8.- Son obligaciones de los asociados:
1. Cumplir con los estatutos
2. Pagar los aportes
3. Asistir a asambleas
4. Participar activamente en la cooperativa

CAPÍTULO V: RÉGIMEN ECONÓMICO

Artículo 9.- El ejercicio económico coincide con el año calendario.

Artículo 10.- Los excedentes se distribuyen así:
- 20% para el Fondo de Reserva
- 10% para el Fondo de Educación
- Restante según trabajo aportado o consumo

CAPÍTULO VI: DISOLUCIÓN Y LIQUIDACIÓN

Artículo 11.- Causas de disolución:
1. Acuerdo de Asamblea General
2. Reducción del número de asociados
3. Imposibilidad de cumplir el objeto social
4. Declaración de quiebra`,
    Resumen: 'Marco legal completo para cooperativas - 11 artículos principales',
    Categoria: 'Legislación cooperativa',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Ley',
    Etiquetas: 'ley,general,cooperativas,principios,constitución,asociados,órganos',
    Estado: 'active'
  },
  {
    Titulo: 'Normativa de Cooperativas de Ahorro y Crédito',
    Contenido: `NORMATIVA ESPECIAL PARA COOPERATIVAS DE AHORRO Y CRÉDITO

CAPÍTULO I: DEFINICIÓN Y OBJETO

Artículo 1.- Las cooperativas de ahorro y crédito son entidades financieras cooperativas que tienen por objeto promover el ahorro y otorgar crédito a sus asociados.

Artículo 2.- Su actividad se rige por:
1. Ley General de Cooperativas
2. Ley de Bancos y Entidades Financieras (aplicable en parte)
3. Normativa de la Superintendencia de Bancos

CAPÍTULO II: REQUISITOS ESPECIALES

Artículo 3.- Para su constitución requieren:
1. Mínimo 50 asociados
2. Capital mínimo suscrito de acuerdo a la ley
3. Autorización de la Superintendencia de Bancos

Artículo 4.- Deben llevar contabilidad de acuerdo a normas financieras.

CAPÍTULO III: OPERACIONES PERMITIDAS

Artículo 5.- Pueden realizar:
1. Captación de ahorros de asociados
2. Otorgamiento de préstamos a asociados
3. Inversiones en instrumentos financieros
4. Servicios financieros complementarios

Artículo 6.- No pueden:
1. Realizar operaciones con no asociados
2. Ofrecer servicios bancarios no autorizados

CAPÍTULO IV: RATIOS FINANCIEROS

Artículo 7.- Deben mantener:
1. Liquidez mínima: 15%
2. Encaje legal: según normativa
3. Solvencia: 10% del activo

CAPÍTULO V: CONTROL Y SUPERVISIÓN

Artículo 8.- Están sujetas a:
1. Auditoría externa anual
2. Supervisión de la Superintendencia de Bancos
3. Informes periódicos de cumplimiento`,
    Resumen: 'Normativa especial para cooperativas de ahorro y crédito',
    Categoria: 'Legislación cooperativa',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Ley',
    Etiquetas: 'ahorro,crédito,financiero,bancos,supervisión',
    Estado: 'active'
  },
  {
    Titulo: 'Marco Legal para Cooperativas Agropecuarias',
    Contenido: `MARCO LEGAL PARA COOPERATIVAS AGROPECUARIAS

CAPÍTULO I: DEFINICIÓN

Artículo 1.- Las cooperativas agropecuarias tienen por objeto:
1. Producción agrícola y pecuaria
2. Transformación de productos
3. Comercialización de la producción
4. Provisión de insumos

CAPÍTULO II: REQUISITOS ESPECIALES

Artículo 2.- Para su constitución requieren:
1. Mínimo 10 asociados
2. Objeto social definido
3. Zona de influencia geográfica

CAPÍTULO III: BENEFICIOS LEGALES

Artículo 3.- Tienen acceso a:
1. Crédito preferencial
2. Exenciones fiscales
3. Asistencia técnica del estado

CAPÍTULO IV: OBLIGACIONES

Artículo 4.- Deben:
1. Fomentar la producción
2. Promover la asociatividad
3. Contribuir al desarrollo rural

CAPÍTULO V: PRODUCCIÓN Y COMERCIALIZACIÓN

Artículo 5.- Pueden:
1. Producir directamente
2. Transformar productos
3. Comercializar en conjunto
4. Exportar directamente

Artículo 6.- Los excedentes se distribuyen según:
1. Trabajo aportado: 60%
2. Capital aportado: 20%
3. Fondo de reserva: 20%`,
    Resumen: 'Marco legal para cooperativas agropecuarias',
    Categoria: 'Legislación cooperativa',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Ley',
    Etiquetas: 'agropecuarias,campo,producción,agrícola,pecuario',
    Estado: 'active'
  },

  // ==========================================================
  // 2. GOBIERNO COOPERATIVO
  // ==========================================================
  {
    Titulo: 'Control Democrático en Cooperativas - Guía Completa',
    Contenido: `GUÍA DE CONTROL DEMOCRÁTICO EN COOPERATIVAS

1. CONCEPTO Y PRINCIPIOS

El control democrático es el principio fundamental que garantiza la participación de todos los asociados en las decisiones de la cooperativa.

PRINCIPIOS BÁSICOS:
1. Un asociado, un voto (independientemente del capital aportado)
2. Participación activa en asambleas
3. Transparencia en la gestión
4. Rendición de cuentas
5. Elecciones periódicas

2. MECANISMOS DE CONTROL

2.1. ASAMBLEA GENERAL
- Máximo órgano de decisión
- Participación de todos los asociados
- Decisiones por mayoría
- Quórum mínimo: 50% de asociados

2.2. CONSEJO DE ADMINISTRACIÓN
- Elegido por la Asamblea
- Representa a la cooperativa
- Gestiona el día a día
- Rinde cuentas anualmente

2.3. COMITÉ DE VIGILANCIA
- Control interno
- Revisa cuentas y gestión
- Informa a la Asamblea
- Elegido por la Asamblea

2.4. ASAMBLEAS SECTORIALES
- Por áreas o regiones
- Recogen opiniones
- Proponen iniciativas

3. DERECHOS DE PARTICIPACIÓN

Los asociados tienen derecho a:
1. Votar en asambleas
2. Ser elegidos para cargos
3. Presentar propuestas
4. Recibir información
5. Ser consultados en decisiones importantes

4. OBLIGACIONES DE PARTICIPACIÓN

Los asociados deben:
1. Asistir a asambleas
2. Participar activamente
3. Informarse sobre la gestión
4. Cumplir con los acuerdos

5. GARANTÍAS DEL CONTROL DEMOCRÁTICO

1. Estatutos claros y democráticos
2. Reglamentos de participación
3. Mecanismos de revocatoria
4. Auditorías externas
5. Informes periódicos`,
    Resumen: 'Guía completa del control democrático en cooperativas',
    Categoria: 'Gobierno cooperativo',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Guía práctica',
    Etiquetas: 'democracia,participación,voto,asamblea,control',
    Estado: 'active'
  },
  {
    Titulo: 'Asamblea General - Manual de Funcionamiento',
    Contenido: `MANUAL DE FUNCIONAMIENTO DE LA ASAMBLEA GENERAL

1. NATURALEZA Y COMPETENCIAS

La Asamblea General es el máximo órgano de decisión de la cooperativa. Está integrada por todos los asociados y sus decisiones son vinculantes.

COMPETENCIAS EXCLUSIVAS:
1. Aprobar y reformar estatutos
2. Elegir y remover directivos
3. Aprobar planes y presupuestos
4. Aprobar estados financieros
5. Distribuir excedentes
6. Decidir sobre fusión o disolución

2. TIPOS DE ASAMBLEA

2.1. ASAMBLEA ORDINARIA
- Se celebra una vez al año
- Dentro de los 3 meses siguientes al cierre del ejercicio
- Orden del día: memoria, balances, distribución de excedentes

2.2. ASAMBLEA EXTRAORDINARIA
- Se convoca cuando es necesario
- Para temas urgentes o importantes
- Puede ser a solicitud de asociados (20%)

3. CONVOCATORIA

REQUISITOS DE CONVOCATORIA:
1. Antelación mínima: 15 días
2. Publicación: medios de comunicación
3. Comunicación individual
4. Orden del día definido
5. Documentación disponible

4. QUÓRUM Y VOTACIÓN

QUÓRUM:
- Primera convocatoria: 50% de asociados
- Segunda convocatoria: 20% de asociados

VOTACIÓN:
- Mayoría simple: más de la mitad
- Mayoría calificada: 2/3 o 3/4 para decisiones especiales
- Voto secreto: elecciones y decisiones personales

5. DESARROLLO DE LA ASAMBLEA

1. Registro de asistencia
2. Verificación de quórum
3. Designación de secretario
4. Lectura y aprobación del orden del día
5. Desarrollo de puntos
6. Votaciones
7. Cierre y acta

6. ACTAS

La asamblea debe quedar documentada en acta que contenga:
1. Fecha y lugar
2. Lista de asistentes
3. Orden del día
4. Resoluciones adoptadas
5. Firma de presidente y secretario

7. IMPUGNACIÓN

Las decisiones pueden impugnarse si:
1. Hay vicios de convocatoria
2. Se violan derechos de asociados
3. Existe conflicto de intereses
4. La decisión es contraria a la ley`,
    Resumen: 'Manual completo de funcionamiento de la Asamblea General',
    Categoria: 'Gobierno cooperativo',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Guía práctica',
    Etiquetas: 'asamblea,convocatoria,quórum,votación,actas',
    Estado: 'active'
  },
  {
    Titulo: 'Elecciones y Consejo de Administración',
    Contenido: `GUÍA DE ELECCIONES Y FUNCIONAMIENTO DEL CONSEJO DE ADMINISTRACIÓN

1. ELECCIONES

PROCESO ELECTORAL:
1. Convocatoria: 30 días antes
2. Inscripción de candidatos: 15 días antes
3. Campaña electoral: 7 días antes
4. Día de votación: Asamblea
5. Juramentación: inmediata

REQUISITOS PARA CANDIDATOS:
1. Ser asociado activo
2. Tener antigüedad mínima: 1 año
3. No tener conflictos de interés
4. No estar inhabilitado
5. Tener capacidad legal

DURACIÓN DEL MANDATO:
- Consejo de Administración: 2 años
- Comité de Vigilancia: 2 años
- Posible reelección: 1 vez

2. CONSEJO DE ADMINISTRACIÓN

COMPOSICIÓN:
- Presidente
- Vicepresidente
- Secretario
- Tesorero
- Vocales (según estatutos)

FUNCIONES:
1. Representar a la cooperativa
2. Ejecutar decisiones de la Asamblea
3. Administrar los bienes
4. Elaborar planes y presupuestos
5. Contratar y supervisar gerencia
6. Convocar a Asambleas

OBLIGACIONES:
1. Actuar con lealtad y buena fe
2. Rendir cuentas
3. Mantener confidencialidad
4. Evitar conflictos de interés
5. Asistir a reuniones

REUNIONES:
- Frecuencia: mínimo mensual
- Quórum: mayoría de miembros
- Decisiones: por mayoría

REMOCIÓN:
- Por incumplimiento de funciones
- Por pérdida de confianza
- Por Asamblea General
- Por renuncia voluntaria

3. GERENCIA

Es el ejecutor de las decisiones del Consejo.

FUNCIONES:
1. Ejecutar políticas
2. Dirigir operaciones
3. Administrar personal
4. Informar al Consejo
5. Representar operativamente

RELACIÓN CON EL CONSEJO:
- Nombrado por el Consejo
- No es miembro del Consejo
- Asiste a reuniones con voz pero sin voto
- Depende directamente del Consejo

4. RESPONSABILIDADES

Los directivos responden por:
1. Daños causados por dolo o culpa
2. Incumplimiento de deberes
3. Uso indebido de bienes
4. Conflictos de interés no declarados`,
    Resumen: 'Guía de elecciones y funcionamiento del Consejo de Administración',
    Categoria: 'Gobierno cooperativo',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Guía práctica',
    Etiquetas: 'elecciones,consejo,directivos,gerencia,responsabilidad',
    Estado: 'active'
  },

  // ==========================================================
  // 3. DERECHOS DE ASOCIADOS
  // ==========================================================
  {
    Titulo: 'Derechos y Obligaciones de los Asociados - Guía Completa',
    Contenido: `GUÍA COMPLETA DE DERECHOS Y OBLIGACIONES DE ASOCIADOS

1. DERECHOS DE LOS ASOCIADOS

DERECHOS POLÍTICOS:
1. Participar en asambleas
2. Elegir y ser elegido
3. Votar en todas las decisiones
4. Ser informado oportunamente
5. Presentar propuestas y quejas

DERECHOS ECONÓMICOS:
1. Participar en excedentes
2. Recibir servicios de la cooperativa
3. Obtener información financiera
4. Conocer el estado de sus aportes
5. Recibir compensación por aportes

DERECHOS SOCIALES:
1. Formación y capacitación
2. Participación en actividades sociales
3. Información sobre la cooperativa
4. Trato igualitario

DERECHOS LEGALES:
1. Impugnar decisiones
2. Acudir a la justicia
3. Solicitar información
4. Retirarse voluntariamente
5. Ser escuchado

DERECHOS DE INFORMACIÓN:
1. Acceder a estados financieros
2. Conocer planes y proyectos
3. Recibir convocatorias
4. Obtener copia de estatutos

2. OBLIGACIONES DE LOS ASOCIADOS

OBLIGACIONES BÁSICAS:
1. Cumplir estatutos y reglamentos
2. Pagar aportes
3. Asistir a asambleas
4. Participar activamente
5. Respetar decisiones

OBLIGACIONES ECONÓMICAS:
1. Realizar los aportes acordados
2. Responder por las deudas
3. Contribuir al fondo de reserva
4. Cubrir pérdidas según estatutos

OBLIGACIONES DE LEALTAD:
1. Actuar de buena fe
2. No competir con la cooperativa
3. Mantener confidencialidad
4. Promover la cooperativa

OBLIGACIONES SOCIALES:
1. Participar en formación
2. Colaborar en actividades
3. Integrar comisiones
4. Fomentar la participación

3. CAUSAS DE PÉRDIDA DE CALIDAD

PÉRDIDA AUTOMÁTICA:
1. Fallecimiento
2. Disolución de la cooperativa
3. Declaración de incapacidad

PÉRDIDA VOLUNTARIA:
1. Renuncia escrita
2. Retiro voluntario

PÉRDIDA POR DECISIÓN:
1. Exclusión por incumplimiento grave
2. Exclusión por falta de pago
3. Exclusión por conducta incompatible

PROCEDIMIENTO DE EXCLUSIÓN:
1. Notificación al asociado
2. Audiencia previa
3. Decisión motivada
4. Derecho a impugnación

4. PROCEDIMIENTO DE RETIRO

1. Solicitud escrita
2. Plazo de preaviso: 30 días
3. Liquidación de aportes
4. Devolución según estatutos
5. Certificado de retiro

5. RECURSOS DEL ASOCIADO

CONTRA DECISIONES DE LA COOPERATIVA:
1. Recurso de reconsideración
2. Recurso de apelación
3. Recurso ante la Asamblea

CONTRA ACTOS DE DIRECTIVOS:
1. Queja ante el Comité de Vigilancia
2. Solicitud de revocatoria
3. Denuncia ante autoridades`,
    Resumen: 'Guía completa de derechos y obligaciones de asociados',
    Categoria: 'Derechos de asociados',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Guía práctica',
    Etiquetas: 'derechos,obligaciones,asociados,exclusión,retiro',
    Estado: 'active'
  },
  {
    Titulo: 'Participación de Asociados en Excedentes',
    Contenido: `GUÍA DE PARTICIPACIÓN EN EXCEDENTES COOPERATIVOS

1. CONCEPTO DE EXCEDENTES

Los excedentes son los resultados positivos de la cooperativa después de deducir todos los gastos y costos.

CARACTERÍSTICAS:
1. No son utilidades empresariales
2. Son retornos de la actividad cooperativa
3. Se distribuyen entre los asociados
4. Se basan en la participación

2. DISTRIBUCIÓN DE EXCEDENTES

DESTINO DE EXCEDENTES:
1. Fondo de Reserva: 20%
2. Fondo de Educación: 10%
3. Fondo de Solidaridad: 5%
4. Retorno a Asociados: 65%

BASE DE REPARTO:
- Cooperativas de trabajo: según trabajo aportado
- Cooperativas de consumo: según consumo
- Cooperativas de ahorro: según ahorro
- Cooperativas mixtas: según participación en actividades

CRITERIOS DE DISTRIBUCIÓN:
1. Participación efectiva
2. Permanencia en la cooperativa
3. Cumplimiento de obligaciones
4. Resultados de la gestión

3. FONDOS DE LA COOPERATIVA

FONDO DE RESERVA:
- Destino: cubrir pérdidas
- Garantizar solvencia
- No distribuible
- Intangible

FONDO DE EDUCACIÓN:
- Capacitación de asociados
- Formación cooperativa
- Investigación
- Desarrollo

FONDO DE SOLIDARIDAD:
- Ayuda a asociados
- Proyectos comunitarios
- Desarrollo local
- Obras sociales

4. DEVOLUCIÓN DE EXCEDENTES

PROCEDIMIENTO:
1. Determinación del resultado
2. Aprobación en Asamblea
3. Cálculo del retorno por asociado
4. Abono en cuenta del asociado
5. Pago o reinversión

FORMAS DE PAGO:
1. En efectivo
2. En servicios
3. En acciones o aportes
4. En productos

5. ASPECTOS LEGALES

Los excedentes NO SON:
1. Utilidades empresariales
2. Dividendos accionarios
3. Remuneración al capital

CONTROL:
1. Auditoría externa
2. Comité de Vigilancia
3. Supervisión estatal
4. Aprobación en Asamblea

6. PROHIBICIONES

No se pueden repartir excedentes:
1. Sin aprobación de Asamblea
2. Si hay pérdidas acumuladas
3. Si se afecta el capital social
4. Sin constituir los fondos obligatorios`,
    Resumen: 'Guía de distribución y participación en excedentes cooperativos',
    Categoria: 'Derechos de asociados',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Guía práctica',
    Etiquetas: 'excedentes,retorno,distribución,fondos,reserva',
    Estado: 'active'
  },

  // ==========================================================
  // 4. PROTECCIÓN DE DATOS
  // ==========================================================
  {
    Titulo: 'Protección de Datos Personales en Cooperativas',
    Contenido: `GUÍA DE PROTECCIÓN DE DATOS EN COOPERATIVAS

1. MARCO LEGAL

La protección de datos personales es un derecho fundamental que debe ser respetado por todas las cooperativas.

PRINCIPIOS RECTORES:
1. Consentimiento: el asociado debe autorizar
2. Finalidad: uso específico
3. Proporcionalidad: solo datos necesarios
4. Calidad: datos veraces y actualizados
5. Seguridad: protección adecuada
6. Confidencialidad: acceso restringido

2. DERECHOS DE LOS ASOCIADOS

DERECHOS ARCO:
1. Acceso: conocer sus datos
2. Rectificación: corregir datos
3. Cancelación: eliminar datos
4. Oposición: negarse al tratamiento

OTROS DERECHOS:
1. Portabilidad: trasladar datos
2. Limitación: restringir uso
3. Impugnación: reclamar
4. Información: ser informado

3. OBLIGACIONES DE LA COOPERATIVA

OBLIGACIONES GENERALES:
1. Obtener consentimiento
2. Informar claramente
3. Mantener registros
4. Implementar medidas de seguridad
5. Atender derechos ARCO

OBLIGACIONES DE SEGURIDAD:
1. Datos encriptados
2. Acceso restringido
3. Copias de seguridad
4. Plan de contingencia
5. Auditoría de seguridad

OBLIGACIONES DE NOTIFICACIÓN:
1. Informar sobre uso de datos
2. Notificar violaciones
3. Comunicar cambios
4. Reportar a autoridades

4. PROCEDIMIENTO DE ATENCIÓN

RECEPCIÓN DE SOLICITUDES:
1. Identificar al solicitante
2. Registrar la solicitud
3. Informar plazo de respuesta

PLAZOS:
- Acceso: 15 días
- Rectificación: 15 días
- Cancelación: 15 días
- Oposición: 15 días

RESPUESTA:
1. Resolución motivada
2. Comunicación por escrito
3. Informe al solicitante
4. Registro del procedimiento

5. MEDIDAS DE SEGURIDAD

MEDIDAS TÉCNICAS:
1. Encriptación de datos
2. Firewalls
3. Control de accesos
4. Autenticación

MEDIDAS ORGANIZATIVAS:
1. Política de datos
2. Capacitación del personal
3. Registro de accesos
4. Responsable de datos

MEDIDAS FÍSICAS:
1. Seguridad de instalaciones
2. Archivo seguro
3. Documentos bajo llave

6. VIOLACIONES DE DATOS

PROCEDIMIENTO ANTE VIOLACIÓN:
1. Detección
2. Evaluación
3. Contención
4. Notificación
5. Investigación
6. Corrección

SANCIONES:
1. Multas económicas
2. Suspensión de actividades
3. Responsabilidad penal
4. Daños y perjuicios

7. BUENAS PRÁCTICAS

RECOMENDACIONES:
1. Minimizar datos
2. Revisar periódicamente
3. Capacitar al personal
4. Actualizar medidas
5. Documentar procesos`,
    Resumen: 'Guía completa de protección de datos en cooperativas',
    Categoria: 'Protección de datos',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Guía práctica',
    Etiquetas: 'datos,protección,privacidad,seguridad,consentimiento',
    Estado: 'active'
  },

  // ==========================================================
  // 5. ESTATUTOS Y REGLAMENTOS
  // ==========================================================
  {
    Titulo: 'Estatutos Modelo para Cooperativas - Estructura Completa',
    Contenido: `ESTATUTOS MODELO PARA COOPERATIVAS

CAPÍTULO I: DISPOSICIONES GENERALES

Artículo 1.- Denominación
La cooperativa se denominará "..." y tendrá su domicilio en ...

Artículo 2.- Duración
La cooperativa tendrá duración indefinida.

Artículo 3.- Objeto Social
La cooperativa tiene por objeto ...
1. Prestar servicios a sus asociados
2. Promover el desarrollo integral
3. Fomentar la cooperación

CAPÍTULO II: DE LOS ASOCIADOS

Artículo 4.- Requisitos de Ingreso
1. Ser mayor de edad
2. Capacidad legal
3. Compartir principios cooperativos
4. Aprobar período de prueba
5. Pagar aportes iniciales

Artículo 5.- Derechos de los Asociados
1. Participar en asambleas
2. Elegir y ser elegido
3. Recibir información
4. Participar en excedentes
5. Usar servicios de la cooperativa
6. Retirarse voluntariamente

Artículo 6.- Obligaciones de los Asociados
1. Cumplir estatutos
2. Pagar aportes
3. Asistir a asambleas
4. Participar activamente
5. Respetar decisiones

Artículo 7.- Pérdida de Calidad
1. Renuncia voluntaria
2. Exclusión por incumplimiento
3. Fallecimiento
4. Disolución de la cooperativa

CAPÍTULO III: RÉGIMEN ECONÓMICO

Artículo 8.- Capital Social
El capital social está constituido por los aportes de los asociados.

Artículo 9.- Aportes
1. Mínimo: 1 cuota social
2. Máximo: según estatutos
3. Devolución: al retiro del asociado

Artículo 10.- Excedentes
Se distribuyen según:
1. Fondo de Reserva: 20%
2. Fondo de Educación: 10%
3. Retorno a Asociados: 70%

CAPÍTULO IV: GOBIERNO Y ADMINISTRACIÓN

Artículo 11.- Órganos de Gobierno
1. Asamblea General
2. Consejo de Administración
3. Comité de Vigilancia

Artículo 12.- Asamblea General
Es el máximo órgano de decisión.

Artículo 13.- Consejo de Administración
Compuesto por:
- Presidente
- Vicepresidente
- Secretario
- Tesorero
- Vocales

Artículo 14.- Comité de Vigilancia
Controla la gestión de la cooperativa.

CAPÍTULO V: DISOLUCIÓN Y LIQUIDACIÓN

Artículo 15.- Causas de Disolución
1. Acuerdo de Asamblea
2. Reducción de asociados
3. Imposibilidad de operar

Artículo 16.- Liquidación
Los bienes se destinan a:
1. Pagar deudas
2. Devolver aportes
3. Fines comunitarios

CAPÍTULO VI: REFORMAS

Artículo 17.- Las reformas requieren:
1. Propuesta del Consejo
2. Aprobación de 2/3 de asociados
3. Registro y publicación

CAPÍTULO VII: DISPOSICIONES FINALES

Artículo 18.- Todo lo no previsto se rige por la Ley General de Cooperativas.`,
    Resumen: 'Estatutos modelo completos para cooperativas',
    Categoria: 'Estatutos modelo',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Estatuto',
    Etiquetas: 'estatutos,modelo,estructura,asociados,gobierno',
    Estado: 'active'
  },
  {
    Titulo: 'Reglamento Interno de Trabajo para Cooperativas',
    Contenido: `REGLAMENTO INTERNO DE TRABAJO PARA COOPERATIVAS

CAPÍTULO I: DISPOSICIONES GENERALES

Artículo 1.- Objeto
Este reglamento regula las relaciones entre la cooperativa y sus asociados en el desarrollo de las actividades laborales.

Artículo 2.- Ámbito de Aplicación
Aplica a todos los asociados que prestan servicios en la cooperativa.

Artículo 3.- Principios
1. Trabajo decente
2. Igualdad de oportunidades
3. Participación democrática

CAPÍTULO II: DEBERES Y DERECHOS

Artículo 4.- Deberes de los Asociados
1. Cumplir con el reglamento
2. Realizar el trabajo asignado
3. Mantener la disciplina
4. Cuidar los bienes
5. Asistir a capacitaciones

Artículo 5.- Derechos de los Asociados
1. Condiciones dignas de trabajo
2. Participación en decisiones
3. Acceso a la información
4. Formación continua

CAPÍTULO III: JORNADA LABORAL

Artículo 6.- Horario
1. Jornada máxima: 8 horas diarias
2. 48 horas semanales
3. Descanso semanal: 1 día

Artículo 7.- Horas Extraordinarias
1. Máximo 2 horas diarias
2. Remuneración especial
3. Voluntarias

CAPÍTULO IV: VACACIONES Y PERMISOS

Artículo 8.- Vacaciones
1. 15 días hábiles al año
2. Programación anticipada
3. Acumulación permitida

Artículo 9.- Permisos
1. Enfermedad: justificado
2. Maternidad: según ley
3. Paternidad: según ley
4. Permisos especiales

CAPÍTULO V: SEGURIDAD Y SALUD

Artículo 10.- Condiciones
1. Ambiente seguro
2. Equipo de protección
3. Capacitación en seguridad

Artículo 11.- Accidentes
1. Reporte inmediato
2. Investigación
3. Medidas correctivas

CAPÍTULO VI: CAPACITACIÓN

Artículo 12.- Formación
1. Capacitación permanente
2. Actualización
3. Desarrollo de habilidades

Artículo 13.- Evaluación
1. Periódica
2. Participativa
3. Orientada a la mejora

CAPÍTULO VII: SANCIONES

Artículo 14.- Faltas
1. Leves: llamado de atención
2. Graves: suspensión
3. Muy graves: expulsión

Artículo 15.- Procedimiento
1. Notificación
2. Audiencia
3. Decisión motivada
4. Derecho a defensa

CAPÍTULO VIII: DISPOSICIONES FINALES

Artículo 16.- Todo lo no previsto se resuelve según la ley y los estatutos.`,
    Resumen: 'Reglamento interno de trabajo para cooperativas',
    Categoria: 'Estatutos modelo',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Reglamento',
    Etiquetas: 'reglamento,trabajo,horario,vacaciones,sanciones',
    Estado: 'active'
  },

  // ==========================================================
  // 6. FUSIONES Y REESTRUCTURACIÓN
  // ==========================================================
  {
    Titulo: 'Procedimiento de Fusión Cooperativa - Guía Completa',
    Contenido: `GUÍA COMPLETA DE FUSIÓN COOPERATIVA

1. TIPOS DE FUSIÓN

FUSIÓN POR ABSORCIÓN:
- Una cooperativa absorbe a otra(s)
- La absorbente mantiene su identidad
- La absorbida desaparece como persona jurídica

FUSIÓN POR INTEGRACIÓN:
- Dos o más cooperativas se unen
- Crean una nueva cooperativa
- Las originales desaparecen

2. REQUISITOS LEGALES

REQUISITOS DOCUMENTALES:
1. Proyecto de fusión
2. Estados financieros
3. Informe de expertos
4. Certificaciones
5. Aprobaciones

REQUISITOS DE ASAMBLEA:
1. Quórum especial (2/3)
2. Mayoría calificada
3. Votación nominal
4. Acta de asamblea

REQUISITOS ADMINISTRATIVOS:
1. Publicación de convocatoria
2. Notificación a autoridades
3. Registro de acuerdos
4. Protocolización

3. ETAPAS DEL PROCESO

ETAPA 1: ESTUDIO DE VIABILIDAD
- Análisis financiero
- Evaluación legal
- Impacto en asociados
- Plan de fusión

ETAPA 2: NEGOCIACIÓN
- Condiciones de la fusión
- Relación de intercambio
- Acuerdo de fusión
- Firma del acuerdo

ETAPA 3: APROBACIÓN
- Convocatoria a asambleas
- Información a asociados
- Debate y votación
- Aprobación formal

ETAPA 4: REGISTRO
- Inscripción de acuerdos
- Publicación
- Actualización de registros
- Notificaciones

4. DERECHOS DE ASOCIADOS

DERECHOS DURANTE EL PROCESO:
1. Información oportuna
2. Participación en decisiones
3. Derecho a oposición
4. Derecho a retiro

DERECHOS DESPUÉS DE LA FUSIÓN:
1. Integración en nueva cooperativa
2. Mantenimiento de derechos
3. Participación equitativa
4. Protección de aportes

5. ASPECTOS LABORALES

Los trabajadores de las cooperativas fusionadas:
1. Conservan sus derechos
2. Se integran a la nueva cooperativa
3. No hay despido por fusión
4. Se respetan antigüedades

6. ASPECTOS FISCALES

IMPUESTOS:
1. Impuesto de transferencia
2. Impuesto a la renta
3. IVA aplicable
4. Exenciones posibles

BENEFICIOS FISCALES:
1. No hay ganancia patrimonial
2. Exención de impuestos
3. Créditos fiscales
4. Incentivos a la fusión

7. IMPUGNACIÓN

Los asociados pueden impugnar:
1. Dentro de los 30 días
2. Por vicios en el proceso
3. Por lesión de derechos
4. Ante autoridades competentes`,
    Resumen: 'Guía completa del procedimiento de fusión cooperativa',
    Categoria: 'Fusiones y reestructuración',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Guía práctica',
    Etiquetas: 'fusión,absorción,integración,reestructuración,asamblea',
    Estado: 'active'
  },
  {
    Titulo: 'Reestructuración y Disolución de Cooperativas',
    Contenido: `GUÍA DE REESTRUCTURACIÓN Y DISOLUCIÓN

1. REESTRUCTURACIÓN

TIPOS DE REESTRUCTURACIÓN:
1. Reorganización administrativa
2. Reestructuración financiera
3. Reorientación estratégica
4. Transformación societaria

CAUSAS:
1. Problemas económicos
2. Cambios en el mercado
3. Necesidades de los asociados
4. Cumplimiento legal

PROCEDIMIENTO:
1. Estudio de diagnóstico
2. Plan de reestructuración
3. Aprobación en Asamblea
4. Implementación
5. Seguimiento

2. DISOLUCIÓN

CAUSAS DE DISOLUCIÓN:
1. Acuerdo de la Asamblea General
2. Reducción del número de asociados
3. Imposibilidad de cumplir el objeto social
4. Declaración de quiebra o insolvencia
5. Pérdida total del capital

PROCEDIMIENTO:
1. Convocatoria a Asamblea Extraordinaria
2. Decisión de disolución
3. Nombramiento de liquidador
4. Proceso de liquidación
5. Extinción de la cooperativa

3. LIQUIDACIÓN

ETAPAS:
1. Inventario de bienes
2. Pago de obligaciones
3. Devolución de aportes
4. Destino de excedentes

ORDEN DE PAGO:
1. Acreedores laborales
2. Acreedores tributarios
3. Acreedores comerciales
4. Devolución de aportes

DESTINO DE BIENES:
1. Pagar deudas
2. Devolver aportes
3. Entregar a otra cooperativa
4. Destinar a fines comunitarios

4. RESPONSABILIDAD

RESPONSABILIDAD DE DIRECTIVOS:
1. Por actos de mala fe
2. Por incumplimiento de deberes
3. Por daños causados

RESPONSABILIDAD DE ASOCIADOS:
1. Hasta el valor de sus aportes
2. Por obligaciones personales
3. Por actos ilícitos

5. PLAZOS

El proceso de liquidación debe concluir en:
1. Máximo 2 años
2. Ampliación por 1 año adicional
3. Informes periódicos

6. IMPUGNACIÓN

Contra el proceso de liquidación:
1. Recurso dentro de 30 días
2. Ante autoridades competentes
3. Por vicios del procedimiento`,
    Resumen: 'Guía de reestructuración y disolución de cooperativas',
    Categoria: 'Fusiones y reestructuración',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Guía práctica',
    Etiquetas: 'reestructuración,disolución,liquidación,quiebra',
    Estado: 'active'
  },

  // ==========================================================
  // 7. NORMATIVA LABORAL
  // ==========================================================
  {
    Titulo: 'Normativa Laboral en Cooperativas de Trabajo',
    Contenido: `NORMATIVA LABORAL EN COOPERATIVAS DE TRABAJO

1. NATURALEZA DE LA RELACIÓN

Los asociados trabajadores NO son empleados de la cooperativa, sino trabajadores asociados.

DIFERENCIAS CON TRABAJO DEPENDIENTE:
1. No hay subordinación
2. Participan en decisiones
3. Distribuyen excedentes
4. No hay patrón

2. DERECHOS LABORALES APLICABLES

DERECHOS QUE APLICAN:
1. Seguridad social (obligatoria)
2. Descansos y vacaciones
3. Condiciones de trabajo dignas
4. Protección en accidentes

DERECHOS QUE NO APLICAN:
1. Indemnización por despido
2. Remuneración fija
3. Horario rígido

3. OBLIGACIONES DE LA COOPERATIVA

OBLIGACIONES LABORALES:
1. Afiliar a la seguridad social
2. Proporcionar equipo de trabajo
3. Capacitar
4. Garantizar condiciones seguras
5. Pagar aportes al sistema

4. SEGURIDAD SOCIAL

AFILIACIONES OBLIGATORIAS:
1. Salud (seguro de salud)
2. Pensiones (jubilación)
3. Riesgos laborales
4. Cese de actividad

APORTES:
1. La cooperativa aporta como empleador
2. El asociado aporta como trabajador
3. Obligación legal

5. RELACIONES LABORALES

CON TRABAJADORES NO ASOCIADOS:
1. Se rigen por el código de trabajo
2. Existe relación de dependencia
3. Todas las prestaciones laborales
4. Sindicatos aplicables

6. SOLUCIÓN DE CONFLICTOS

MECANISMOS INTERNOS:
1. Comité de conflictos
2. Conciliación interna
3. Arbitraje

MECANISMOS EXTERNOS:
1. Autoridad laboral
2. Tribunales de trabajo
3. Superintendencia

7. PRESTACIONES SOCIALES

LOS ASOCIADOS TIENEN DERECHO A:
1. Vacaciones
2. Licencias
3. Subsidios
4. Protección ante riesgos

8. DOCUMENTACIÓN REQUERIDA

La cooperativa debe tener:
1. Reglamento interno
2. Políticas de personal
3. Registro de asociados
4. Informes de seguridad`,
    Resumen: 'Normativa laboral aplicable a cooperativas de trabajo',
    Categoria: 'Normativa laboral',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Guía práctica',
    Etiquetas: 'laboral,trabajo,asociados,seguridad,social',
    Estado: 'active'
  },
  {
    Titulo: 'Contratación y Gestión de Personal en Cooperativas',
    Contenido: `GUÍA DE CONTRATACIÓN Y GESTIÓN DE PERSONAL

1. TRABAJADORES EN COOPERATIVAS

TIPOS DE TRABAJADORES:
1. Asociados trabajadores
2. Trabajadores contratados
3. Personal administrativo
4. Personal técnico

2. PROCESO DE CONTRATACIÓN

PASOS:
1. Necesidad de personal
2. Reclutamiento
3. Selección
4. Inducción
5. Evaluación

DOCUMENTACIÓN REQUERIDA:
1. Hoja de vida
2. Certificados
3. Documentos de identidad
4. Exámenes médicos
5. Contrato

3. CONTRATOS DE TRABAJO

TIPOS DE CONTRATO:
1. Indefinido
2. Plazo fijo
3. Obra determinada
4. A tiempo parcial

CLÁUSULAS ESENCIALES:
1. Identificación
2. Objeto del contrato
3. Remuneración
4. Jornada
5. Duración
6. Terminación

4. REMUNERACIÓN

FORMAS DE PAGO:
1. Salario base
2. Comisiones
3. Horas extras
4. Bonificaciones

PAGOS OBLIGATORIOS:
1. Aguinaldo
2. Vacaciones
3. Utilidades (si aplica)

5. CAPACITACIÓN

La cooperativa debe:
1. Capacitar al personal
2. Actualizar habilidades
3. Formar en valores cooperativos
4. Evaluar resultados

6. EVALUACIÓN DE DESEMPEÑO

MECANISMOS:
1. Evaluación anual
2. Metas y objetivos
3. Retroalimentación
4. Plan de mejora

7. TERMINACIÓN DE RELACIÓN

CAUSAS DE TERMINACIÓN:
1. Renuncia voluntaria
2. Despido justificado
3. Jubilación
4. Muerte

PROCEDIMIENTO:
1. Notificación por escrito
2. Liquidación de prestaciones
3. Certificados
4. Finiquito`,
    Resumen: 'Guía de contratación y gestión de personal en cooperativas',
    Categoria: 'Normativa laboral',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Guía práctica',
    Etiquetas: 'contratación,personal,remuneración,contrato,despido',
    Estado: 'active'
  },

  // ==========================================================
  // 8. RESPONSABILIDAD Y RIESGOS
  // ==========================================================
  {
    Titulo: 'Responsabilidad Legal en Cooperativas',
    Contenido: `GUÍA DE RESPONSABILIDAD LEGAL EN COOPERATIVAS

1. TIPOS DE RESPONSABILIDAD

RESPONSABILIDAD CIVIL:
- Por daños a asociados
- Por daños a terceros
- Por daños a la cooperativa

RESPONSABILIDAD PENAL:
- Delitos económicos
- Fraude
- Administración desleal

RESPONSABILIDAD ADMINISTRATIVA:
- Incumplimiento de normativas
- Sanciones de supervisión
- Multas

2. RESPONSABILIDAD DE DIRECTIVOS

LOS DIRECTIVOS RESPONDEN POR:
1. Gestión negligente
2. Incumplimiento de deberes
3. Actos dolosos
4. Conflictos de interés
5. Pérdidas por mala gestión

EXIMENTES DE RESPONSABILIDAD:
1. Actuar conforme a la ley
2. Cumplir con los estatutos
3. Documentar decisiones
4. Buscar asesoría legal

3. RESPONSABILIDAD DE ASOCIADOS

LOS ASOCIADOS RESPONDEN:
1. Hasta el valor de sus aportes
2. Por obligaciones contraídas
3. Por daños causados

LIMITACIONES:
1. No responden por deudas de la cooperativa
2. No responden con bienes personales
3. Excepción de fraude

4. RIESGOS LEGALES

RIESGOS COMUNES:
1. Incumplimiento de normas
2. Conflictos de interés
3. Discriminación
4. Acoso laboral
5. Fraude interno

5. SEGUROS

SEGUROS RECOMENDADOS:
1. Responsabilidad civil
2. Directivos
3. Patrimonial
4. Laboral
5. Cumplimiento

6. PREVENCIÓN DE RIESGOS

MEDIDAS:
1. Políticas claras
2. Código de ética
3. Capacitación
4. Controles internos
5. Auditoría

7. PROCEDIMIENTO ANTE RIESGOS

PASOS:
1. Detección
2. Evaluación
3. Mitigación
4. Reporte
5. Seguimiento`,
    Resumen: 'Guía de responsabilidad legal y riesgos en cooperativas',
    Categoria: 'Responsabilidad legal',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Guía práctica',
    Etiquetas: 'responsabilidad,riesgos,directivos,seguros,prevención',
    Estado: 'active'
  },
  {
    Titulo: 'Gestión de Riesgos en Cooperativas',
    Contenido: `GUÍA DE GESTIÓN DE RIESGOS EN COOPERATIVAS

1. IDENTIFICACIÓN DE RIESGOS

RIESGOS ESTRATÉGICOS:
1. Cambios en el mercado
2. Competencia
3. Regulación
4. Reputación

RIESGOS OPERATIVOS:
1. Procesos internos
2. Personal
3. Tecnología
4. Proveedores

RIESGOS FINANCIEROS:
1. Liquidez
2. Crédito
3. Mercado
4. Tipo de cambio

RIESGOS LEGALES:
1. Incumplimiento normativo
2. Conflictos laborales
3. Contratos
4. Propiedad intelectual

2. EVALUACIÓN DE RIESGOS

PROBABILIDAD:
1. Muy probable
2. Probable
3. Improbable
4. Muy improbable

IMPACTO:
1. Catastrófico
2. Alto
3. Medio
4. Bajo

MATRIZ DE RIESGO:
1. Calcular nivel de riesgo
2. Priorizar
3. Asignar responsable

3. MITIGACIÓN DE RIESGOS

ESTRATEGIAS:
1. Evitar el riesgo
2. Reducir el riesgo
3. Transferir el riesgo
4. Aceptar el riesgo

CONTROLES:
1. Preventivos
2. Detectivos
3. Correctivos

4. PLAN DE CONTINUIDAD

OBJETIVOS:
1. Mantener operaciones
2. Proteger datos
3. Responder a crisis

COMPONENTES:
1. Análisis de impacto
2. Estrategias de recuperación
3. Plan de comunicación

5. MONITOREO

ACTIVIDADES:
1. Seguimiento de riesgos
2. Actualización de evaluaciones
3. Reportes periódicos
4. Auditoría interna

6. CULTURA DE RIESGO

LA COOPERATIVA DEBE:
1. Fomentar conciencia
2. Capacitar al personal
3. Incentivar reporte
4. Aprender de incidentes

7. ROLES Y RESPONSABILIDADES

RESPONSABLES:
1. Consejo de Administración
2. Gerencia
3. Comité de Vigilancia
4. Unidad de riesgos

FUNCIONES:
1. Identificar riesgos
2. Implementar controles
3. Monitorear
4. Reportar`,
    Resumen: 'Guía de gestión de riesgos en cooperativas',
    Categoria: 'Responsabilidad legal',
    Pais: 'Latinoamérica',
    Tipo_documento: 'Guía práctica',
    Etiquetas: 'riesgos,evaluación,mitigación,control,continuidad',
    Estado: 'active'
  }
];

// ============================================================
// FUNCIÓN PRINCIPAL - CON NOMBRE CORRECTO
// ============================================================

async function seedKnowledge() {
  console.log('📚 Cargando base de conocimiento completa...\n');
  console.log(`📋 Total documentos a cargar: ${knowledgeData.length}`);

  let successCount = 0;
  let errorCount = 0;

  for (const doc of knowledgeData) {
    try {
      // ✅ Crear documento con el nombre CORRECTO: Creado_por
      console.log(`📄 Creando: ${doc.Titulo}`);
      await databases.createDocument(
        DATABASE_ID,
        COLLECTION_ID,
        'unique()',
        {
          ...doc,
          Creado_por: 'system',           // ← NOMBRE CORRECTO
          Actualizado_en: new Date().toISOString()  // ← NOMBRE CORRECTO
        }
      );
      successCount++;
      console.log(`✅ Creado: ${doc.Titulo}`);
    } catch (error) {
      console.error(`❌ Error con "${doc.Titulo}":`, error.message);
      
      // Mostrar ayuda para depurar
      if (error.message.includes('Missing required attribute')) {
        const attr = error.message.match(/"([^"]+)"/);
        if (attr) {
          console.log(`   ⚠️ El atributo "${attr[1]}" es requerido.`);
          console.log(`   📝 Verifica que existe en tu colección.`);
        }
      }
      errorCount++;
    }
  }

  console.log('\n📊 RESULTADOS:');
  console.log(`✅ Exitosos: ${successCount}`);
  console.log(`❌ Fallidos: ${errorCount}`);
  console.log(`📚 Total: ${knowledgeData.length}`);
  
  if (successCount > 0) {
    console.log('\n✅ ¡Base de conocimiento cargada exitosamente!');
  } else {
    console.log('\n❌ No se pudo cargar ningún documento.');
    console.log('\n📝 VERIFICA LOS NOMBRES DE ATRIBUTOS:');
    console.log('   Ve a Appwrite > conocimiento_base > Columns');
    console.log('   Los nombres deben ser:');
    console.log('   - Titulo');
    console.log('   - Contenido');
    console.log('   - Categoria');
    console.log('   - Pais');
    console.log('   - Tipo_documento');
    console.log('   - Etiquetas');
    console.log('   - Estado');
    console.log('   - Creado_por  ← Este debe existir');
    console.log('   - Actualizado_en  ← Este debe existir');
  }
}

seedKnowledge().catch(console.error);