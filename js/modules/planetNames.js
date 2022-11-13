/**
 * @module planetNames
 * 
 * In its own module just because its quite a long messy function.
 * Easier to read this way
 */

export function getPossiblePlanetNames(population, industries, resources, numOfMoons, habitability) {

  let possibleNames = [];

  if(population > 1000000) {
    possibleNames.push({
      name: 'Prime',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Central',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Master',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Axial',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Capital',
      location: 'either',
      hyphenate: true
    },
    {
      name: 'Essential',
      location: 'either',
      hyphenate: true
    },
    {
      name: 'Focal',
      location: 'either',
      hyphenate: true
    },
    {
      name: 'Paramount',
      location: 'prefix',
      hyphenate: true
    },
    {
      name: 'High',
      location: 'prefix',
      hyphenate: true
    }
    )
  }

  industries.forEach(function (industry) {
    if(industry.key === 1) { //mining
      possibleNames.push({
        name: 'Exca',
        location: 'prefix',
        hyphenate: true
      },
      {
        name: 'Fodere',
        location: 'either',
        hyphenate: true
      },
      {
        name: 'Cavo',
        location: 'either',
        hyphenate: true
      },
      {
        name: 'Excavo',
        location: 'either',
        hyphenate: true
      },
      {
        name: 'Quarry',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Root',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Origin',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Heart',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Marrow',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Soul',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Pith',
        location: 'suffix',
        hyphenate: true
      }
      );
    } else if(industry.key === 2) { //shipbuilding
      possibleNames.push({
        name: 'Docks',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Berth',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Wharf',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Lock',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Quay',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Anchor',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Hold',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'castra',
        location: 'either',
        hyphenate: true
      });
    } else if(industry.key === 3) { //computing
      possibleNames.push({
        name: 'Cognition',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Cerebration',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Reason',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Ideation',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Elucidation',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Calculo',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Kernel',
        location: 'either',
        hyphenate: true
      },
      {
        name: 'Abaci',
        location: 'either',
        hyphenate: true
      });
    } else if(industry.key === 4) { //foodstuffs
      possibleNames.push({
        name: 'Seed',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Ear',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Spore',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Rudiment',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Hortus',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Garden',
        location: 'either',
        hyphenate: true
      },
      {
        name: 'Sylva',
        location: 'either',
        hyphenate: true
      },
      {
        name: 'Ager',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Cell',
        location: 'either',
        hyphenate: true
      }
      );
    } else if(industry.key === 5) { //common goods
      possibleNames.push({
        name: 'Cast',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Erect',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Hand',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Forge',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Opificium',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Fabricare',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Malleator',
        location: 'prefix',
        hyphenate: true
      }
      );
    } else if(industry.key === 6) { //luxury goods
      possibleNames.push({
        name: 'Solatium',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Erect',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Faber',
        location: 'either',
        hyphenate: true
      },
      {
        name: 'Artifex',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Luxus',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Luxuria',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Deliciae',
        location: 'either',
        hyphenate: true
      }
      );
    } else if(industry.key === 7) { //Nuclear Processing
      possibleNames.push({
        name: 'Emission',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Atomus',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Potentia',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Vis',
        location: 'either',
        hyphenate: true
      },
      {
        name: 'Aura',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Lux',
        location: 'either',
        hyphenate: true
      },
      {
        name: 'Ignis',
        location: 'suffix',
        hyphenate: true
      }
      );
    } else if(industry.key === 8) { //R&D
      possibleNames.push({
        name: 'Disciplina',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Doctrina',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Scola',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'ars',
        location: 'either',
        hyphenate: true
      },
      {
        name: 'Ludus',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'School',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Erudio',
        location: 'suffix',
        hyphenate: true
      }
      );
    } else if(industry.key === 9) { //Medical
      possibleNames.push({
        name: 'Medicus',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Sano',
        location: 'either',
        hyphenate: true
      },
      {
        name: 'Cure',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Remedy',
        location: 'either',
        hyphenate: true
      },
      {
        name: 'Medeor',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Requiem',
        location: 'suffix',
        hyphenate: true
      }
      );
    } else if(industry.key === 10) { //Antimatter
      possibleNames.push({
        name: 'Ascendant',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Manus',
        location: 'either',
        hyphenate: true
      },
      {
        name: 'Divus',
        location: 'either',
        hyphenate: true
      },
      {
        name: 'Numen',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Celestial',
        location: 'suffix',
        hyphenate: true
      },
      {
        name: 'Lar',
        location: 'either',
        hyphenate: true
      }
      );
    }
  });

  if(resources.length > 5) {
    possibleNames.push({
      name: 'Cornucopia',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Amalthea',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Cache',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Hoard',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Repo',
      location: 'suffix',
      hyphenate: true
    }
  )}

  if(numOfMoons > 6) {
    possibleNames.push({
      name: 'Parent',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Father',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Mother',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Begetter',
      location: 'either',
      hyphenate: true
    },
    {
      name: 'Source',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Wellspring',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Cherised',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Darling',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Esteemed',
      location: 'suffix',
      hyphenate: true
    })
  }

  if(habitability > 75) {
    possibleNames.push({
      name: 'Eden',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Arcadia',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Palace',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Palatium',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Obsitus',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Perfectus',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Viridis',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Florens',
      location: 'suffix',
      hyphenate: true
    });
  }

  if(habitability > 75) {
    possibleNames.push({
      name: 'Eden',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Arcadia',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Palace',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Palatium',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Obsitus',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Perfectus',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Viridis',
      location: 'suffix',
      hyphenate: true
    },
    {
      name: 'Florens',
      location: 'suffix',
      hyphenate: true
    });
  }

  return possibleNames;
}
