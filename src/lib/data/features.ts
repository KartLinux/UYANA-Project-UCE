import type { Feature } from "$lib/utils/types";

export default [ 
  {
    name: 'Monitoreo Hidrometeorológico',
    description:
      'El INAMHI realiza un monitoreo constante de lluvias y condiciones climáticas para anticipar posibles aluviones en las regiones vulnerables de Ecuador.',
    image: 'images/features/monitoreo.jpg',
    tags: [{ label: 'Prevención' }, { label: 'Monitoreo' }]
  }, 
  {
    name: 'Sistemas de Alerta Temprana',
    description:
      'En comunidades de alto riesgo se implementan sirenas y sistemas de alerta que avisan ante lluvias extremas y posibles aluviones.',
    image: 'images/features/alerta-temprana.jpg',
    tags: [{ label: 'Alerta' }, { label: 'Seguridad' }]
  }, 
  {
    name: 'Planes de Contingencia',
    description:
      'Gobiernos locales y comunitarios desarrollan planes de contingencia que incluyen simulacros, rutas de evacuación y centros de acopio.',
    image: 'images/features/plan-contingencia.jpg',
    tags: [{ label: 'Preparación' }, { label: 'Resiliencia' }]
  }, 
  {
    name: 'Reforestación y Control de Erosión',
    description:
      'Programas de reforestación en cuencas hidrográficas reducen la erosión y mejoran la capacidad de absorción de agua, ayudando a prevenir aluviones.',
    image: 'images/features/reforestacion.jpg',
    tags: [{ label: 'Medio Ambiente' }, { label: 'Mitigación' }]
  }, 
  {
    name: 'Coordinación Interinstitucional',
    description:
      'El COE Nacional, Provincial y Cantonal trabaja de forma coordinada para gestionar emergencias por aluviones y coordinar la respuesta rápida.',
    image: 'images/features/coe-coordinacion.jpg',
    tags: [{ label: 'COE' }, { label: 'Coordinación' }]
  },
  {
    name: 'Capacitación Comunitaria',
    description:
      'Las comunidades reciben capacitaciones constantes sobre cómo actuar ante aluviones, identificando zonas seguras y aprendiendo a evacuar correctamente.',
    image: 'images/features/capacitacion.jpg',
    tags: [{ label: 'Educación' }, { label: 'Resiliencia' }]
  },
] as Feature[];