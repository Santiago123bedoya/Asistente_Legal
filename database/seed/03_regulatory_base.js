// database/seed/03_regulatory_base.js
// ⚖️ Base regulatoria

const regulatoryBase = [
  {
    title: 'Marco Legal Cooperativo - Resumen Regional',
    content: `
      MARCO LEGAL COOPERATIVO EN LATINOAMÉRICA

      NORMAS INTERNACIONALES:
      - Principios Cooperativos de la ACI
      - Recomendación 193 de la OIT
      - Pacto Internacional de Derechos Económicos

      LEGISLACIÓN POR PAÍS:

      ARGENTINA:
      - Ley 20.337 de Cooperativas
      - Ley 26.175 de Reforma

      CHILE:
      - Ley General de Cooperativas N° 20.494

      COLOMBIA:
      - Ley 79 de 1988
      - Decreto 458 de 2021

      MÉXICO:
      - Ley General de Sociedades Cooperativas
      - Reformas 2015

      PERÚ:
      - Ley General de Cooperativas N° 30061

      URUGUAY:
      - Ley de Sociedades Cooperativas N° 18.407

      PRINCIPIOS RECTORES COMUNES:
      1. Libre adhesión y retiro
      2. Gestión democrática
      3. Distribución equitativa de excedentes
      4. Fomento de la educación cooperativa
      5. Integración cooperativa
    `,
    category: 'Legislación cooperativa',
    country: 'Latinoamérica',
    document_type: 'Ley',
    tags: ['marco legal', 'regional', 'legislación', 'normas']
  }
];

module.exports = { regulatoryBase };