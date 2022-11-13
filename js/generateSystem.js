/**
 * Space System Generator 
 * @version 2.0
 * @author Aonghas MacKay
 */


/**
 * Config imports
 *********************************************
 */
import systemPrefixsImport from "./config/systemPrefixs.json" assert { type: "json" };
import systemSuffixesImport from "./config/systemSuffixes.json" assert { type: "json" };
import planetSizesImport from "./config/planetSizes.json" assert { type: "json"};
import planetClimatesImport from "./config/planetClimates.json" assert { type: "json"};
import planetResourcesImport from "./config/planetResources.json" assert { type: "json"};
import starsImport from "./config/stars.json" assert { type: "json"};
import governmentTypesImport from "./config/governmentTypes.json" assert { type: "json"};
import planetIndustriesImport from "./config/planetIndustries.json" assert { type: "json"};



/**
 * Module Imports
 *********************************************
 */
//import { getDataType } from "./modules/debugFunctions.js"
import { getRandomNum, getRandomArrayItem, getWeightedRandomObjItem, capitalise, hasDuplicates } from "./modules/globalFunctions.js"
import { getPossiblePlanetNames } from "./modules/planetNames.js"
import { disabledElementsHandler } from "./modules/disabledElementsHandler.js"
import { filteringHandler } from "./modules/filteringHandler.js"



/**
 * Base variables
 *********************************************
 */
let maxNumOfPlanets 	        = 12;                                                                                             //Max number of planets to generate
let minNumOfPlanets 	        = 1;                                                                                              //Minimum number of planets to generate
let basePlanetPopulation      = 100000;                                                                                         //Base population of planet
let currentSector             = null;                                                                                           //Current generated sector
let currentSectorGovernments  = [];                                                                                             //List of government objects in current sector
const SYSTEM_TEMPLATE         = document.querySelector("#system-template");                                                     //HTML template for a planetary system in the UI
const PLANET_TEMPLATE         = document.querySelector("#planet-template");                                                     //HTML template for a planet in the UI
const ICON_BOX_TEMPLATE       = document.querySelector("#icon-box-template");                                                   //HTML template for a UI icon box
const SYSTEMS_LIST            = document.querySelector("#systems-list");                                                        //HTML element to fill with systems
const NUMBER_OF_SYSTEMS_INPUT = document.querySelector("#input-num-of-systems")                                                 //HTML element to draw the number of systems to generate from
const SYSTEMS_ORDER_SELECT    = document.querySelector("#order-systems");                                                       //HTML element for ordering systems
const GENERATE_SECTOR_BUTTON  = document.getElementById("generate-sector-btn");                                                 //HTML element for generating a new sector
const EXPAND_SECTOR_BUTTON    = document.getElementById("expand-sector-btn");                                                   //HTML element for expanding the current sector
const EXPORT_SECTOR_BUTTON    = document.getElementById("export-sector-btn");                                                   //HTML element for exporting the current sector
let disabledElementHandler    = new disabledElementsHandler(SYSTEMS_ORDER_SELECT, EXPAND_SECTOR_BUTTON, EXPORT_SECTOR_BUTTON);  //instance of the disabledElementsHandler imported class used to control disabled HTML elements
const JSON_WHITELIST          = [                                                                                               //list of properties allowed to be exported to JSON
  'systems',
  'systemName',
  'systemWealth', 
  'planets', 
  'planet', 
  'name', 
  'size', 
  'type', 
  'population', 
  'moons', 
  'desc', 
  'label', 
  'resources', 
  'systemFlavourText', 
  'habitable', 
  'wealth', 
  'orbits',
  'militaryPresence',
  'quantity'];


/**
 * Json Imports reassignment
 *********************************************
 *
 * Names are a bit of a misnomer as they aren't all arrays. Some are technically objects
 */
let systemNamesPrefixArray = systemPrefixsImport;
let systemNamesSuffixArray = systemSuffixesImport;
let starTypesArray         = starsImport;
let governmentTypesArray   = governmentTypesImport;
let planetIndustriesArray  = planetIndustriesImport;



/**
 * Classes
 *********************************************
 */

/**
 * Represents a sector of space containing planetary systems and governments
 * @see systemGovernment
 * @see planetarySystem
 */
class spaceSector {

  /**
   * Constructs a spaceSector object
   * 
   * @param {String} name - sector name
   * @param {Array} governments - array of systemGovernment objects
   * @param {Array} systems - array of planetarySystem objects
   */
  constructor() {
    let numberOfSystems = NUMBER_OF_SYSTEMS_INPUT.value;

    if(!numberOfSystems || numberOfSystems < 1) {
      numberOfSystems = 100;
    }

    this.name = this.generateSectorName();
    this.governments = this.generateGovernments(10);
    this.systems = this.generateSystems(numberOfSystems);
  }

  /**
   * Generates a random sector name
   * @returns {String} - sector name
   */
  generateSectorName() {
    let hexidecimal = getRandomNum(10000, 10000000).toString(16);                                               //generate a random hexidecimal
    let name        = getRandomArrayItem(systemNamesPrefixArray) + getRandomArrayItem(systemNamesSuffixArray);  //Generate a random name
    name += '-' + hexidecimal;                                                                                  //Append hexidecimal to name

    return name;
  }

  /**
   * Generates an array of planetary systems
   * @param {Number} numOfSystems - number of planetary systems to generate
   * @returns {Array} - planetarySystem objects
   * @see planetarySystem
   */
  generateSystems(numOfSystems = 50) {
    let systems = [];

    for(let i = 0; i < numOfSystems; i++) {                       //loops until the numOfSystems has been reached
      let system = new planetarySystem();                         //create a new planetary system object
      system.government = getRandomArrayItem(this.governments);   //assign a random system government from the governments array
      system.government.systems.push(system);                     //add the system to the governments systems array
      systems.push(system);                                       //push the system to the return array
    }                                                             //end loop

    return systems;                                               //return array of generated systems
  }

  /**
   * Generates an array of system governments for the system object to be randomly assigned
   * @param {Number} numOfGovernments - number of system governments to generate
   * @returns {Array} - array of systemGovernment objects
   * @see systemGovernment
   * @see generateSystems
   */
  generateGovernments(numOfGovernments = 7) {
    let governments = [];

    for(let i = 0; i < numOfGovernments; i++) {         //loops until numOfGovernments has been reached
      let newGovernment = new systemGovernment;         //create a new system government object
      let pushGovernment = true;

      governments.forEach(government => {               //forEach existing government...
        if (government.name == newGovernment.name) {    //if the new government name is a duplicate then...
          i--;                                          //discount this iteration
          pushGovernment = false;
        }
      });

      if(pushGovernment) {                              //if government name is not a duplicate then
        governments.push(newGovernment);                //push the government to the return array
        currentSectorGovernments.push(newGovernment);   //push the government to the global currentSectorGovernments array
      }
    }                                               

    return governments;                                 ///return array of generated governments
  }
}

/**
 * Represents a government that controls a series of planetary systems
 * @see spaceSector
 */
class systemGovernment {

  /**
   * Constructs a systemGovernment object
   * 
   * @param {Object} type - government form
   * @param {String} name - name of the government
   * @param {Array} systems - array of planetarySystem objects controlled by this government
   */
  constructor() {
    this.type     = getRandomArrayItem(governmentTypesArray);
    this.name     = this.generateGovernmentName();
    this.systems  = [];
  }

  /**
   * Calculates the total military score and strength for an entire government and returns it in an object
   * @return {Object}
   */
  get governmentMilitaryPresence() {
    let corvetteCount = 0;
    let destroyerCount = 0;
    let cruiserCount = 0;
    let carrierCount = 0;
    let titanCount = 0;
    let governmentMilitaryScore = 0;

    this.systems.forEach(system => {
      governmentMilitaryScore += system.systemImportanceScore;

      corvetteCount   += system.militaryPresence[0].quantity;
      destroyerCount  += system.militaryPresence[1].quantity;
      cruiserCount    += system.militaryPresence[2].quantity;
      carrierCount    += system.militaryPresence[3].quantity;
      titanCount      += system.militaryPresence[4].quantity;
    });

    return {
      governmentMilitaryScore : governmentMilitaryScore,
      corvetteCount           : corvetteCount,
      destroyerCount          : destroyerCount,
      cruiserCount            : cruiserCount,
      carrierCount            : carrierCount,
      titanCount              : titanCount
    }
  }

  /**
   * Returns a formatted string of the governments total population
   * @returns {String}
   */
  get governmentPopulationFormatted() {
    return this.governmentPopulation.toLocaleString();
  }

  /**
   * Calculates the total population of the government
   * @returns {Number} - total population
   */
  get governmentPopulation() {
    let population = 0;

    this.systems.forEach(system => {
      population += system.population;
    });

    return population;
  }

  /**
   * Returns a formatted string of the governments wealth
   * @returns {String}
   */
  get governmentWealthFormatted() {
    return this.governmentWealth.toLocaleString();
  }

  /**
   * Calculates the governments wealth based on the wealth of its systems
   * @returns {Number} - government wealth
   */
  get governmentWealth() {
    let wealth = 0;

    this.systems.forEach(system => {
      wealth += system.systemWealth;
    });

    return wealth;
  }

  /**
   * Generates a government name
   * @returns {String} - government name
   */
  generateGovernmentName() {
    let prefix          = getRandomArrayItem(systemNamesPrefixArray);
    let suffix          = getRandomArrayItem(systemNamesSuffixArray);
    let typeSuffix      = capitalise(getRandomArrayItem(this.type.suffixes));       //Get random suffix based on the government type
    let qualifier       = '';
    
    let qualifiersArray = [
      'Grand',
      'Great',
      'Holy',
      'Imperial',
      'Peoples',
      'Free',
      'United',
      'Paramount',
      'Key',
      'Dominant',
      'Sovereign',
      'Autonomous',
      'Majestic',
      'High'
    ]

    if(getRandomNum(100, 0) > 70) {                            //30% chance of adding a qualifier to the name
      qualifier = getRandomArrayItem(qualifiersArray) + ' ';
    }
    

    let name = prefix + suffix;
    name = capitalise(name);
    name = name + ' ' + qualifier + typeSuffix;

    return name;
  }
}

/**
 * Represents a planetary system
 * @see spaceSector
 * @see systemGovernment
 */
class planetarySystem {

  /**
   * Constructs a planetary system object
   * @param {String} systemName
   * @param {Number} numOfPlanets - number of planets within the system
   * @param {Object} stars - systems star/ stars or object it orbits
   * @param {Array} planets - array of planets within the system
   * @param {systemGovernment} government - a object containing the systems government and the form it takes
   * @param {Number} systemWealth
   * @param {Number} systemImportanceScore - a score based on the systems population, resources and industries
   * @param {Array|Null} militaryPresence - an array of military ship objects or null if no military presence
   * @param {String} systemFlavourText - a string of flavour text for the system
   */
	constructor() {
  	this.systemName 	          = this.generateSystemName();
  	this.numOfPlanets           = getRandomNum(maxNumOfPlanets, minNumOfPlanets);
    this.stars 	                = this.generateStar();
    this.government             = {};
    this.planets 			          = this.generatePlanets(this.stars);

    this.overwriteDuplicateNames(this.planets);

    this.systemWealth           = this.calcSystemWealth();
    this.systemImportanceScore  = this.calcSystemImportanceScore();
    this.militaryPresence       = this.calcMilitaryPresence();
    this.systemFlavourText      = this.generateSystemFlavourText();
  }

  /**
   * Returns a systems total population
   * @returns {Number}
   */
  get totalPopulation() {
    let totalPopulation = 0;

    this.planets.forEach(planet => {            //for each planet in the system...
      totalPopulation += planet.population;     //add the planets population to the total
      if(planet.moons) {                        //if the planet has moons...
        planet.moons.forEach(moon => {          
          totalPopulation += moon.population;   //add their population to the total
        });
      }
    }); 

    return totalPopulation;
  }

  /**
   * Returns a systems total wealth formatted with commas
   * @returns {String} - total system wealth
   */
  get systemWealthFormatted() {
    return this.systemWealth.toLocaleString()         //return the systems wealth as a string with commas for thousands
  }

  /**
   * Returns a systems total population formatted with commas
   * @returns {String} - total system population
   */
  get totalPopulationFormatted() {
    return this.totalPopulation.toLocaleString();    //return the systems total population as a string with commas for thousands
  }

  /**
   * Returns a systems total number of moons
   * @returns {Number} - total number of moons
   */
  get totalNumOfMoons() {
    let totalNumOfMoons = 0;

    this.planets.forEach(planet => {
      totalNumOfMoons += parseInt(planet.numOfMoons);
    });
    
    return totalNumOfMoons;
  }

  /**
   * Returns a systems total number of resources
   * @returns {Number}
   */
  get totalIndustries() {
    let totalIndustries = 0;

    this.planets.forEach(planet => {
      totalIndustries += planet.industries.length;
    });

    return totalIndustries;
  }

  /**
   * Returns a systems total number of resources
   * @returns {Number}
   */
  get totalResources() {
    let totalResources = 0;

    this.planets.forEach(planet => {
      totalResources += planet.resources.length;
    });

    return totalResources;
  }

  /**
   * Generates a very rudimentary flavour text for the system. More proof of concept than anything
   * Ideally we would generate a series of system flags and then use OpenAI or a similar service to generate the flavour text
   * @returns {String}
   */
  generateSystemFlavourText() {
    let populationText = '';
    let populationTextLock = false;
    let flavourTextString = `The ${this.systemName} system orbits ${this.stars.desc}. `;

    if(this.totalPopulation > 5000000 && this.totalPopulation < 10000000 && this.numOfPlanets >= 4) {
      populationText = 'thriving';
      populationTextLock = true;
    }
    if(this.totalPopulation > 5000000 && this.totalPopulation < 10000000 && this.numOfPlanets <= 3 && populationTextLock == false) {
      populationText = 'densely packed';
      populationTextLock = true;
    }
    if(this.totalPopulation > 10000000 && this.numOfPlanets >= 4 && populationTextLock == false) {
      populationText = 'bustling';
      populationTextLock = true;
    }
    if(this.totalPopulation > 10000000 && this.numOfPlanets <= 3 && populationTextLock == false) {
      populationText = 'overcrowded';
      populationTextLock = true;
    }
    if(this.totalPopulation > 70000000 && populationTextLock == false) {
      populationText = 'populous';
      populationTextLock = true;
    }
    if(this.totalPopulation < 500000 && this.totalPopulation > 100000 && populationTextLock == false) {
      populationText = 'sparse';
      populationTextLock = true;
    }
    if(this.totalPopulation < 100000) {
      populationText = 'barren';
      populationTextLock = true;
    }

    flavourTextString += `Its ${this.numOfPlanets} planets are home to a ${populationText} population of ${this.totalPopulationFormatted} people. `;

    let wealthText = 'healthy';
    let resourceText = 'small scale industries and taxation';
    if(this.systemWealth < 10000000) {
      wealthText = 'impoverished';
    }
    if(this.systemWealth >= 10000000000 && this.systemWealth <= 100000000000) {
      wealthText = 'prosperous';
      resourceText = 'trade tarrifs and minor industries';
    }
    if(this.systemWealth > 100000000000 && this.systemWealth <= 1000000000000) {
      wealthText = 'wealthy';
      resourceText = 'key position as a trading hub';
    }
    if(this.systemWealth > 1000000000000 && this.systemWealth <= 100000000000000) {
      wealthText = 'extremly wealthy';
    }
    if(this.systemWealth > 100000000000000) {
      wealthText = 'opulent';
    }

    flavourTextString += `Its economy is ${wealthText} and `;

    if(this.totalResources > 15) {
      resourceText = 'abundant natural resources';
    }
    if(this.totalIndustries > 5) {
      resourceText = 'large scale industries';
    }
    if(this.totalIndustries > 10) {
      resourceText = 'vast industrial complexes';
    }

    flavourTextString += `is based on its ${resourceText}. It `;

    let militaryText = 'has no military presence.';
    if(this.systemImportanceScore > 1) {
      militaryText = 'Is home to a nominal military presence who spend their days busting small time smugglers and enforcing visas.';
    }
    if(this.systemImportanceScore > 100) {
      militaryText = 'is home to a small patrol force which keeps the peace and watches for enemy ships.';
    }
    if(this.systemImportanceScore > 200) {
      militaryText = 'is home to a battlegroup who maintain order and protect the local region from pirates.';
    }
    if(this.systemImportanceScore > 250) {
      militaryText = 'is home to a minor fleet base to protect against enemy incursions.';
    }
    if(this.systemImportanceScore > 350) {
      militaryText = 'is home to a large fleet base. Their ships are ready to deploy at any moment';
    }
    if(this.systemImportanceScore > 400) {
      militaryText = 'is a veritable fortress, with a large fleet base and a large number of military installations';
    }

    return flavourTextString + militaryText;
  }

  /**
   * Calculates a score based on the systems population, resources and industries
   * @returns {Number}
   */
  calcSystemImportanceScore() {
    let systemImportanceScore = 0;

    this.planets.forEach(planet => {                                              //for each planet in the system...
      let planetPopModifier = Math.ceil((planet.population / 10000000) / 1) * 1;  //calculate the planets population modifier

      if(planetPopModifier > 0) {                                                 //if the planets population modifier is greater than 0...
        systemImportanceScore += planetPopModifier;                               //add the planets population modifier to the systems importance score
      }

      if(planet.resources.length > 0) { 
        systemImportanceScore += (planet.resources.length * 5)
      }

      if(planet.industries.length > 0) {
        systemImportanceScore += (planet.industries.length * 20)
      }
    });

    return systemImportanceScore;
  }

  /**
   * Calculates a systems military presence based on its system importance score
   * @returns {Array|Null} - an array containing the ships present in system or null if the system has no military presence
   */
  calcMilitaryPresence() {
    let corvette = {
      name                : 'Corvette',
      cost                : 1,
      quantity            : 0,
      prerequisitePoints  : 0
    }

    let destroyer = {
      name                : 'Destroyer',
      cost                : 6,
      quantity            : 0,
      prerequisitePoints  : 4
    }

    let cruiser = {
      name                : 'Cruiser',
      cost                : 20,
      quantity            : 0,
      prerequisitePoints  : 16
    }

    let carrier = {
      name                : 'Carrier',
      cost                : 70,
      quantity            : 0,
      prerequisitePoints  : 35
    }

    let titan = {
      name                : 'Titan',
      cost                : 160,
      quantity            : 0,
      prerequisitePoints  : 85
    }

    let militaryPresence = [corvette, destroyer, cruiser, carrier, titan];  //array of military ship objects
    let systemImportanceScore = this.systemImportanceScore;
    let spentScore = 0;                                                     //the amount of points spent on ships. Used as a check against prerequisitePoints

    if(systemImportanceScore == 0) {                                        //if the system has no importance score...
      return null;                                                          
    }

    while(systemImportanceScore > 0) {
      let viableShips = [];                                                //initialise array for ships that can be purchased with the remaining system importance score
      militaryPresence.forEach(shipType => {
        if(shipType.cost <= systemImportanceScore && shipType.prerequisitePoints <= spentScore) { //if the ship can be purchased with the remaining system importance score and the prerequisite points have been spent...
          viableShips.push(shipType);
        }
      });

      if(viableShips.length !== 0) {                            //if there are ships that can be assigned...
        let chosenShipType = getRandomArrayItem(viableShips);   //choose a random ship type from the viable ships
        systemImportanceScore -= chosenShipType.cost;           //subtract the ships cost from the systems importance score
        spentScore += chosenShipType.cost;                      //add the ships cost to the spent score
        chosenShipType.quantity++;                              //increment the chosen ship types quantity
      } else {
        break;                                                  //should never hit this break because there should always be viable ships at this point but just in case
      }
    }

    return militaryPresence;
  }

  /**
   * Returns an number representative of systemWealth as GDP
   * @returns {Number}
   */
  calcSystemWealth() {
    let systemWealth = 0;
    let uninhabitedResourcesModifer = 1;

    this.planets.forEach(planet => {
      if(planet.wealth == 0) {                                    //for planets with no wealth (because they have no population)...
        uninhabitedResourcesModifer += planet.resources.length;   //increment the resource modifier based on the number of the planets resources
      }

      systemWealth += planet.wealth;
    });

    return systemWealth * uninhabitedResourcesModifer;            //return the system wealth taking into account uninhabited planets resources
  }

  /**
   * If any duplicate planet names are found regenerate all the systems planet names and then loop to check the issue is solved
   * Probably not an ideal solution as its not very elegant relooping all that code but it serves its purpose
   * @param {Array} planets - array of planet objects within the system
   */
  overwriteDuplicateNames(planets) {
    let localSystemName = this.systemName; //set system name in function so that I can use it inside the forEach
    let systemHasDuplicates = false;

    do {  //run the duplicate names check once regardless of system has duplicates
      let planetNames = [];

      planets.forEach(function(planet) {
        planetNames.push(planet.name);    //get an array of the systems planet names
      });
  
      if(hasDuplicates(planetNames)) {    //if duplicate planet names exist within the same system:
        systemHasDuplicates = true;

        console.log('Regenerating ' + localSystemName + ' planet names due to duplicate values');
        planets.forEach(function(planet, index) {   //regenerate each planet name
          planet.name = localSystemName + '-' + (index + 1); //increment index as planet iterations start with the suffix 1
          planet.overwriteName();
        });
      } else {
        systemHasDuplicates = false;
      }
    }
    while(systemHasDuplicates === true); //if system had duplicate names rerun the loop to check the issue is solved
  }

  /**
   * Generates a systems star
   * @returns {Object} - star type
   */
  generateStar() {
    let star = getWeightedRandomObjItem({'1':0.9, '2':0.025, '3':0.025, 'Black Hole':0.025, 'Neutron Star':0.025});
    let starObj = {}

    starTypesArray.forEach(starType => {
      if(star == starType.label) {
        starObj = starType;
      }
    });

    return starObj;
  }

  /**
   * Randomly generates a systems name from a list of prefixs and suffixes
   * @returns {String} - system name
   */
  generateSystemName() {
    let prefix = getRandomArrayItem(systemNamesPrefixArray);    //get random prefix from prefix list
    let suffix = getRandomArrayItem(systemNamesSuffixArray);    //get random suffix from suffix list
    
    let name = prefix + suffix;                                 //append the suffix to the prefix and assign the result as the name
    name = capitalise(name);                                    //capitalise the name

    return name;                                                //return the name
  }

  /**
   * Generates the a series of planets
   * @returns {Array} - array of generated planets
   * @see generatePlanet
   */
  generatePlanets(stars) {
    let iteration = 0;
    let planets = [];

    while(iteration < this.numOfPlanets) {                      //loop until there are as many planets in the return array as numOfPlanets
      planets.push(this.generatePlanet(iteration + 1, stars));  //add to array a new planet with a unique number appended to its name
      iteration++;                                              //increment iteration variable
    }

    return planets;                                             //returns array of planets
  }

  /**
   * Generates a singular planet
   * @param {Number} iteration - the number to append to the planet name
   * @returns {planet} - planet object with the provided name
   * @see generatePlanets
   * @see planet
   */
  generatePlanet(iteration, stars) {
    return new planet(this.systemName + '-' + iteration, stars, this);       //generate a planet with name of the system-[x]
  }
}

/**
 * Represents a planet
 */
class planet {
  /**
   * Constructs a planet object
   * 
   * @param {String} name - planet name
   * @param {Object} orbits - The bodies that the planet orbits. Used in habitability calculations
   * @param {planetarySystem} parentSystem - The system that the planet object belongs to
   * @param {Object} size - planet size relative to earth
   * @param {Object} type - approximation of planet climate and makeup
   * @param {Array} resources - planet resources
   * @param {Number} habitability - percentage value that approximates planets suitability for human life
   * @param {Array} industries - array of the major planetary industries
   * @param {Number} population - planets population
   * @param {String} numOfMoons - number of planetary moons
   * @param {Array | Null} moons - array of moons or null if the planet has no moons
   * @param {Number} wealth - number representing planet GDP
   */
  constructor(name, orbits, parentSystem) {
    this.name           = name;
    this.orbits         = orbits;
    this.parentSystem   = parentSystem;
    this.size           = this.generatePlanetSize();
    this.type           = this.generatePlanetClimate();
    this.resources      = this.generatePlanetResources();
    this.habitability   = this.calcPlanetHabitability();
    this.industries     = this.calcPlanetIndustries();
    this.population     = this.calcPlanetPopulation();
    this.numOfMoons 	  = getWeightedRandomObjItem({0:0.4, 1:0.25, 2:0.1, 3:0.05, 4:0.05, 5:0.05, 6:0.05, 7:0.05});
    this.moons          = this.generateMoons();
    this.spaceStations  = this.generateSpaceStations();
    this.wealth         = this.calcPlanetWealth();

    this.overwriteName();
  }

  /**
   * Returns a formatted version of planets population
   * @returns {String} - planets population formatted with commas
   */
  get formattedPopulation() {
    return this.population.toLocaleString();
  }

  /**
   * Returns a formatted version of planets wealth
   * @returns {String} - planets wealth formatted with commas
   */
  get formattedWealth() {
    return this.wealth.toLocaleString();
  }

  /**
   * Overwrites planets base name based on planet characteristics
   * @returns {String} - new planet name
   */
  overwriteName() {
    let possibleNames = getPossiblePlanetNames(this.population, this.industries, this.resources, this.numOfMoons, this.habitability);   //get an array of possible planet names based on the planets properties

    if(possibleNames.length < 1) { //if there are no new possible planet names then return
      return;
    }

    let randomNameObject = getRandomArrayItem(possibleNames);     //get a random planet name object from the possibleNames array
    let randomNameObjectName = capitalise(randomNameObject.name); //pre capitalise name for ease of reading and to prevent repeated code
    let randomName = this.name;
    let trimmedName = this.name.split('-'); //split string by hyphen to remove the number
    trimmedName = trimmedName[0]; //get first part of string

    if(randomNameObject.location == 'prefix') {

      if(randomNameObject.hyphenate) {
        randomName = randomNameObjectName + '-' + trimmedName;
      } else {
        randomName = randomNameObjectName + trimmedName.toLowerCase();
      }

    } else if(randomNameObject.location == 'suffix') {

      if(randomNameObject.hyphenate) {
        randomName = trimmedName + '-' + randomNameObjectName;
      } else {
        randomName = trimmedName + randomNameObjectName.toLowerCase();
      }

    } else {
      if(getRandomNum(100, 0) >= 50) {
        if(randomNameObject.hyphenate) {
          randomName = randomNameObjectName + '-' + trimmedName;
        } else {
          randomName = randomNameObjectName + trimmedName.toLowerCase();
        }
        
      } else {

        if(randomNameObject.hyphenate) {
          randomName = trimmedName + '-' + randomNameObjectName;
        } else {
          randomName = trimmedName + randomNameObjectName.toLowerCase();
        }
      }

    }

    this.name = randomName;
  }

  /**
   * Returns a number representing planet wealth
   * @returns {Number}   
   */
  calcPlanetWealth() {
    if(this.population < 1) { //if planet has no population then immediately return 0;
      return 0;
    }

    let popBase = (this.population / 10); //set a base value for population, resources and industries so that we are never multiplying by 0
    let resourceBase = 1;
    let industriesBase = 1;

    if(popBase < 1000) {
      popBase = 1000;
    }

    if(this.resources.length > 0) { 
      resourceBase = this.resources.length;
    }

    if(this.industries.length > 0) {
      industriesBase = this.industries.length;
    }

    return popBase * (resourceBase * 10) ** industriesBase; //arbitary formula to determine planet wealth
  }

  /**
   * Placeholder function
   * @returns {Number}
   */
  generateSpaceStations() {
    let numOfSpaceStations = 0;
    return numOfSpaceStations;
  }

  /**
   * Returns a random planet size
   * @returns {Object} - planet size
   */
  generatePlanetSize() {
    let sizes = planetSizesImport;
    return getRandomArrayItem(sizes);
  }

  /**
   * Returns a random planet climate/type
   * @returns {Object} - planet type
   */
  generatePlanetClimate() {
    let climates = planetClimatesImport;
    return getRandomArrayItem(climates);
  }

  /**
   * Returns a random planet resource
   * @returns {Object} - planet resource
   */
  generatePlanetResources() {
    let resources       = Array.from(planetResourcesImport);
    let planetResources = [];
    let minResources    = 1;
    let maxResources    = 5;

    switch(this.size.key) {
      case 1:
        minResources = 1;
        maxResources = 2;
        break;
      case 2:
        minResources = 1;
        maxResources = 3;
        break;
      case 3:
        minResources = 2;
        maxResources = 4;
        break;
      case 4:
        minResources = 3;
        maxResources = 5;
        break;
      case 5:
        minResources = 4;
        maxResources = 6;
        break;
      default:
        minResources = 2;
        maxResources = 4;
    }

    let guaranteedTypeResource  = this.type.resources.always[0];              //get the guaranteed resource for the planet type
    let possibleTypeResources   = Array.from(this.type.resources.possible);   //assign array containing possible resources for the planet type
    let numOfResources          = getRandomNum(maxResources, minResources);   //assign number of resources to generate

    for(let i = 0; i < numOfResources; i++) {
      let randomResource = null;

      if(i == 0) {                                                            //if first iteration then...
        randomResource = resources.find(function(resource) {                  //search resource array for the guaranteed resource and assign this as the iterations resource
          return resource.key === guaranteedTypeResource;
        });
      } else {                                                                //otherwise...
        let randomResourceKey = getRandomArrayItem(possibleTypeResources);    //get a random resource key
        randomResource = resources.find(function(resource) {                  //search resource array for the random resource
          return resource.key === randomResourceKey;
        });
      }                         
      planetResources.push(randomResource);                                   //add random resource to the planet resources array

      if(i != 0) {                                                                                            //if not first iteration then...
        possibleTypeResources.splice(possibleTypeResources.findIndex(el => el == randomResource.key ), 1);    //remove the chosen resource from the possibleTypeResources array
      }
    }

    return planetResources;
  }

  /**
   * Calculates the planet habitability using the planet size and type habitability modifiers
   * @returns {Number} - planet habitability out of 100
   * @see generatePlanetClimate
   * @see generatePlanetSize
   */
  calcPlanetHabitability() {
    let baseHabitability = 100;                                                                                         //start with a base habitability of 100
    let calculatedHabitability = (baseHabitability * this.type.habitabilityModifier) * this.size.habitabilityModifier;  //times base habitability by type and climate modifiers (modifiers are a max of 1 and thus can never raise the value above 100)
    calculatedHabitability -= getRandomNum(10, 0);                                                                      //introduce some randomness by taking away a random number between 10 and 0

    if(this.orbits.key == 4 || this.orbits.key == 5) {                                                                  //if planet orbits a black hole or neutron star
      calculatedHabitability/= 10;                                                                                      //divide by 10
    }
    
    if(calculatedHabitability < 0) {                                                                                    //if habitability is less than 0 then...
      calculatedHabitability = 0;                                                                                       //set habitability to 0
    }

    return calculatedHabitability;
  }

  /**
   * Calculates the planet population
   * @returns {Number} planet population
   */
  calcPlanetPopulation() {
    let population = 0;   
    let habitabilityModifier  = 1;                                  //base habitability modifier
    let industriesModifier    = (1 + this.industries.length) * 10;  //population boost from industries
    let industriesBasePop     = 25000 * this.industries.length;     //base population required to host industry
    
    if(this.habitability == 0) {
      return 0 + industriesBasePop;
    } else if(this.habitability < 25) { 
      habitabilityModifier = 10;
    } else if(this.habitability < 50) {
      habitabilityModifier = 100;
    }
    
    let sizeModifier;
    switch(this.size.key) {
      case 2 :
        sizeModifier = 10;
        break;
      case 1 :
        sizeModifier = 1;
        break;
      default :
        sizeModifier = 100;
    }

    population = (((basePlanetPopulation * this.habitability) / sizeModifier) / habitabilityModifier);  //population calculation for habitability and planet size
    population = (population * industriesModifier) + industriesBasePop;   //population calculation accounting for industries

    return population;
  }

  /**
   * Generates the planets moons
   * @returns {Array | Null} - array of moons or null if the planet has no moons
   * @see moon
   */
  generateMoons() {
    if(this.numOfMoons == 0) {      //if no moons are present then return null
      return null;
    }

    let iteration = 0;
    let moons = [];

    while(iteration < this.numOfMoons) {                      
      moons.push(this.generateMoon(iteration + 1));        
      iteration++;                                              
    }
    return moons;                                             
  }

  /**
   * Generates a singular moon
   * @param {Number} iteration - the number to append to the moon name
   * @returns {moon}
   * @see moon
   */
  generateMoon(iteration) {
    return new moon(this.name + '-' + iteration, this.habitability, this.population, this.resources.length); //generate a moon and feed in the planets habitability, population and number of resources      
  }

  /**
   * Calculates the planets industries from the planet resources
   * @returns {Array} - array of planet industries
   * @see generatePlanetResources
   */
  calcPlanetIndustries() {
    let planetIndustries = [];
    let planet = this;  //assign planet for use inside loop

    planetIndustriesArray.forEach(function(industry) {    //for each industry...
      let requiredNumOfResources = industry.numRequired;  //reassign for readability
      let requirementsMet = 0;  

      planet.resources.forEach(function(resource) {               //for each planet resource...
        if(industry.requiredResources.includes(resource.key)) {   //if planet resource is in the list of requiredResources...
          requirementsMet++;                                      //increase requirements met count
        }
      });

      if(requirementsMet >= requiredNumOfResources) {   //if the requirements met meets or exceeds the required number of resources then add the industry to the array
        planetIndustries.push(industry)
      }
    });

    return planetIndustries;
  }
}

/**
 * Represents a moon that orbits a planet
 * @see planet
 */
class moon {
  /**
   * Constructs a moon object
   * @param {String} name - name of the moon
   * @param {Boolean} habitable - is planet habitable
   * @param {Number} population - population of the moon
   */
  constructor(name, habitable, population) {
    this.name       = name;
    this.habitable  = this.isMoonHabitable(habitable);          //decide if planet is habitable based on planets habitability
    this.population = this.generateMoonPopulation(population);
  }

  /**
   * Returns a formatted version of moons population
   * @returns {String} - moons population formatted with commas
   */
  get formattedPopulation() {
    return this.population.toLocaleString();
  }

  /**
   * @returns {String} - yes or no
   */
  get formattedIsHabitable() {
    if(this.habitable == true) {
      return 'Yes';
    }
    return 'No';
  }

  /**
   * Determines if a moon is habitable
   * @param {Number} planetHabitability - habitability number from planet
   * @returns {Boolean}
   */
  isMoonHabitable(planetHabitability) {
    let moonHabitability = planetHabitability - getRandomNum(15, 5);  //generate moons habitability from planet habitability with some randomness

    if(moonHabitability <= 0) {                                       //if moon habitability is equal to or less than 0 then...
      return false;
    }
    return true;
  }

  /**
   * Generates the moons population
   * @param {Number} planetPopulation - parent planets population
   * @returns {Number} - moons population
   */
  generateMoonPopulation(planetPopulation) {
    if(this.habitable == true) {
      let moonPopulation = Math.round((planetPopulation / getRandomNum(10, 5)));

      if(moonPopulation < 1) {  //if habitable moon is going to have no population...
        moonPopulation = getRandomNum(15, 1) * 1000;  //give it some
      }

      moonPopulation = Math.ceil(moonPopulation / 100) * 100 //round to the nearest hundred

      return moonPopulation;
    }
    return 0;
  }
}


/**
 * UI Functions
 *********************************************
 */

/**
 * Reveals planet frame in UI
 * @param {HTMLSelectElement} planetSelect - select element that triggered change event
 */
function revealPlanet(planetSelect) {
  let selectedPlanet = planetSelect.parentElement.querySelector(`[data-reveal="${planetSelect.value}"]`); //get selected planet by select value
  let revealedPlanets = planetSelect.parentElement.querySelectorAll(".reveal");                           //get already recealed planets by class 'reveal'

  [...revealedPlanets].forEach(element => {                                                               //for each revealed planet...
    console.log(`hiding revealed elements`);
    element.setAttribute('data-revealed', 'false');
    element.classList.remove('reveal');                                                                   //hide revealed planet
  });

  console.log(`revealing ${planetSelect.value}`);

  selectedPlanet.setAttribute('data-revealed', 'true');
  selectedPlanet.classList.add('reveal');                                                                 //reveal selected planet
}

/**
 * Toggles planet reveal when system is opened or closed. Always opens system on first planet
 */
function togglePlanets() {
  if(!this.open) {                                            //if details element is closed then...
    let revealedPlanets = this.querySelectorAll(".reveal");

    [...revealedPlanets].forEach(element => {                 //for each revealed planet...
      element.setAttribute('data-revealed', 'false');
      element.classList.remove('reveal');                     //hide each revealed planet
    });                                                       //end loop
  } else {                                                    //if details element is open
    revealPlanet(this.querySelector(".planets-fill"));        //reveal planet window
  }
}

/**
 * Inserts system planets into the HTML document
 * 
 * @param {planetarySystem} system - planetary system to fill
 * @param {HTMLSelectElement} planetsSelect - select element for planets within the system element
 * @param {HTMLElement} planetsList - html element to insert planet elements into
 * @see outputSystems()
 */
function outputPlanets(system, planetsSelect, planetsList) {
  system.planets.forEach(currentPlanet => {                     //foreach planet within the system...
    let planetClone = PLANET_TEMPLATE.content.cloneNode(true);  //clone planet template

    fillPlanetSelect(currentPlanet, planetsSelect);             //fill select element with planet names as values
    fillPlanetInfo(currentPlanet, planetClone);                 //fill cloned planet template with planet info

    planetsList.appendChild(planetClone);                       //insert cloned element into system element
  });
}

/**
 * Fills the planet select element
 * 
 * @param {planet} currentPlanet - current planet in the iteration
 * @param {HTMLSelectElement} planetsSelect - select element to fill
 * @see outputPlanets()
 */
function fillPlanetSelect(currentPlanet, planetsSelect) {
  let planetOption = `<option value="${currentPlanet.name}">${currentPlanet.name}</option>`;  //create planet option
  planetsSelect.insertAdjacentHTML('beforeend', planetOption);                                //insert planet option into select
}

/**
 * Fills planet element with moons list
 * 
 * @param {DocumentFragment} planetClone - document fragment to fill
 * @param {Array} moons - list of current planets moons
 */
function fillPlanetMoons(planetClone, moons) {
  moons.forEach((moon) => {
    
    let boxClone = ICON_BOX_TEMPLATE.content.cloneNode(true);

    boxClone.querySelector(".icon-box-fill").textContent          = moon.name;
    boxClone.querySelector(".icon-box-tooltip-fill").innerHTML    = `
      <p><strong>Habitable:</strong> ${moon.formattedIsHabitable}</p>
      <p><strong>Population:</strong> ${moon.formattedPopulation}</p>
    `;

    planetClone.querySelector(".moon-details-fill").appendChild(boxClone);
  });
}

/**
 * Fills planet element with resources list
 * 
 * @param {DocumentFragment} planetClone - document fragment to fill
 * @param {Array} resources - list of current planets resources
 */
function fillPlanetResources(planetClone, resources) {
  resources.forEach((resource) => {
    let boxClone = ICON_BOX_TEMPLATE.content.cloneNode(true);

    boxClone.querySelector(".icon-box-fill").textContent          = resource.label;
    boxClone.querySelector(".icon-box-tooltip-fill").textContent  = resource.desc;

    planetClone.querySelector(".resources-fill").appendChild(boxClone);
  });
}

/**
 * Fills planet element with industries list
 * 
 * @param {DocumentFragment} planetClone - document fragment to fill
 * @param {Array} industries - list of current planets industries
 */
 function fillPlanetIndustries(planetClone, industries) {
  if(industries.length != 0) {
    planetClone.querySelector(".industries-fill").innerHTML = '<p><strong>Major Industries: </strong></p>'
  }

  industries.forEach((industry) => {
    let boxClone = ICON_BOX_TEMPLATE.content.cloneNode(true);

    boxClone.querySelector(".icon-box-fill").textContent          = industry.label;
    boxClone.querySelector(".icon-box-tooltip-fill").textContent  = industry.desc;

    planetClone.querySelector(".industries-fill").appendChild(boxClone);
  });
}

/**
 * Fills planet element with information
 * 
 * @param {planet} currentPlanet - current planet in the iteration
 * @param {DocumentFragment} planetClone - document fragment to fill
 * @see outputPlanets()
 */
function fillPlanetInfo(currentPlanet, planetClone) {
  planetClone.querySelector(".planet-fill").setAttribute('data-reveal', currentPlanet.name);  //set data attribute for revealPlanet functionality

  planetClone.querySelector(".name-fill").textContent             = currentPlanet.name;
  planetClone.querySelector(".type-fill").textContent             = capitalise(currentPlanet.size.label) + ' ' + capitalise(currentPlanet.type.label) + ' planet';
  planetClone.querySelector(".type-tooltip-fill").innerHTML       = '<strong>' + capitalise(currentPlanet.size.label) + ':</strong> ' + currentPlanet.size.desc + '<br /><strong>' + capitalise(currentPlanet.type.label) +  ':</strong> ' + currentPlanet.type.desc;
  planetClone.querySelector(".population-fill").textContent       = 'Population: ' + currentPlanet.formattedPopulation;
  planetClone.querySelector(".population-tooltip-fill").innerHTML = '<p>This planet contains ' + currentPlanet.formattedPopulation + ' permenant residents</p>';
  planetClone.querySelector(".moons-fill").textContent            = currentPlanet.numOfMoons;
  planetClone.querySelector(".moons-tooltip-fill").innerHTML      = '<p>'+ currentPlanet.numOfMoons + ' moons orbit this planet</p>';

  if(currentPlanet.wealth > 0) {
    planetClone.querySelector(".wealth-fill").textContent            = currentPlanet.formattedWealth;
    planetClone.querySelector(".wealth-tooltip-fill").innerHTML      = '<p>'+ currentPlanet.formattedWealth + ' GDP (Galactic Credits)</p><br /><p>Galactic Credits represent an interplanetary currency used for galactic trade. Individual planets will still use local currencies.</p>';
  } else {
    planetClone.querySelector(".wealth-fill").parentElement.remove();
  }

  planetClone.querySelector(".resources-fill").innerHTML          = '<p><strong>Resources: </strong></p>';

  if(currentPlanet.moons != null) {
    planetClone.querySelector(".moon-details-fill").innerHTML     = '<p><strong>Moons: </strong></p>';
    fillPlanetMoons(planetClone, currentPlanet.moons);
  }
  fillPlanetResources(planetClone, currentPlanet.resources);
  fillPlanetIndustries(planetClone, currentPlanet.industries);
}

/**
 * Creates the HTML string for the military presence tooltip
 * @param {planetarySystem} system - system whose military presence we are using to generate the string
 * @returns {String}
 */
function generateMilitaryPresenceString(system) {
  let militaryString = '';
  system.militaryPresence.forEach(shipType => {
    militaryString += '<strong>' + shipType.name + ':</strong> ' + shipType.quantity + '<br />';
  });

  return militaryString;
}

/**
 * Fills system element with information
 * 
 * @param {planetarySystem} system - current system in the iteration
 * @param {DocumentFragment} systemClone - document fragment to fill
 * @see outputSystems()
 */
function fillSystemInfo(system, systemClone) {
  systemClone.querySelector(".system-fill").textContent                 = system.systemName;
  systemClone.querySelector(".planets-num-fill").textContent            = system.numOfPlanets;
  systemClone.querySelector(".planets-tooltip-fill").textContent        = 'This system contains ' + system.numOfPlanets + ' planets';
  systemClone.querySelector(".moons-total-fill").textContent            = system.totalNumOfMoons;
  systemClone.querySelector(".moons-total-tooltip-fill").textContent    = 'This system contains ' + system.totalNumOfMoons + ' moons';
  systemClone.querySelector(".stars-fill").textContent                  = system.stars.label;
  systemClone.querySelector(".stars-tooltip-fill").textContent          = 'This system orbits ' + system.stars.desc;
  systemClone.querySelector(".government-fill").textContent             = system.government.name;
  systemClone.querySelector(".government-tooltip-fill").innerHTML       = '<strong>' + system.government.type.label + ': </strong>' + system.government.type.desc;
  systemClone.querySelector(".total-population-fill").textContent       = system.totalPopulationFormatted;
  systemClone.querySelector(".total-pop-tooltip-fill").textContent      = 'This system contains ' + system.totalPopulationFormatted + ' permenant residents';
  systemClone.querySelector(".total-population-fill").textContent       = system.totalPopulationFormatted;
  systemClone.querySelector(".total-pop-tooltip-fill").textContent      = 'This system contains ' + system.totalPopulationFormatted + ' permenant residents';

  if(system.systemWealth > 0) {
    systemClone.querySelector(".system-wealth-fill").textContent        = system.systemWealthFormatted;
    systemClone.querySelector(".system-wealth-tooltip-fill").innerHTML  = '<p>'+ system.systemWealthFormatted + ' GDP (Galactic Credits)</p><br /><p>Galactic Credits represent an interplanetary currency used for galactic trade. Takes into account uninhabited planets resources.</p>';
  } else {
    systemClone.querySelector(".system-wealth-fill").parentElement.remove();
  }

  if(system.militaryPresence != null) {
    systemClone.querySelector(".military-fill").textContent       = system.systemImportanceScore;
    systemClone.querySelector(".military-tooltip-fill").innerHTML = '<p>' + generateMilitaryPresenceString(system) + '</p>'
  } else {
    systemClone.querySelector(".military-fill").parentElement.remove();
  }

  systemClone.querySelector(".bio-fill").textContent = system.systemFlavourText;
}

/**
 * Adds event listeners to elements within a system document fragment
 * 
 * @param {HTMLDetailsElement} detailsElement 
 * @param {HTMLSelectElement} planetsSelect 
 * @see outputSystems()
 */
function addSystemListeners(detailsElement, planetsSelect) {
  detailsElement.addEventListener('toggle', togglePlanets);

  planetsSelect.addEventListener('change', function() {
    revealPlanet(planetsSelect);
  });
}

/**
 * Fills systems list element with systems
 * 
 * @param {Array} sectorSystems - Array of system objects
 */
function outputSystems(sectorSystems) {
  sectorSystems.forEach((system) => {
    let systemClone     = SYSTEM_TEMPLATE.content.cloneNode(true);    //clone system template
    let planetsList     = systemClone.querySelector(".planets-list"); //element to fill with planets
    let detailsElement  = systemClone.querySelector('details');       //head of system element
    let planetsSelect   = systemClone.querySelector(".planets-fill"); //planet select element

    fillSystemInfo(system, systemClone);                              //fill system clone with system info
    outputPlanets(system, planetsSelect, planetsList);                //insert planet elements into system clone
    addSystemListeners(detailsElement, planetsSelect);                //add event listeners to parts of the system element

    SYSTEMS_LIST.appendChild(systemClone);                            //insert system into the HTML document
  }); 
}

/**
 * Outputs a confirm alert regarding the number of systems being generated
 * 
 * @returns {Boolean} - true if user selected to continue or confirm isnt displayed
 */
function generateSystemsNumberWarning() {
  if(NUMBER_OF_SYSTEMS_INPUT.value > 3000) {
    if(!confirm('Generating this number of systems could cause some browsers to slow down or crash. Do you wish to continue?')) {
      return false;
    }
  }
  
  return true;
}

/**
 * Generates a new sector, wipes the previous sector and then outputs it to the HTML document
 */
function generateNewSector() {
  if(!generateSystemsNumberWarning()) {
    return;
  }

  SYSTEMS_LIST.innerHTML = '';                                                              //wipe existing sector HTML
  currentSector = new spaceSector();                                                        //create new space sector
  document.querySelector("#sector-name-fill").textContent = 'Sector ' + currentSector.name; //overwrite page title with sector name
  outputSystems(currentSector.systems);                                                     //output generated space sector
  
  disabledElementHandler.enableSectorDependentControls();
}

/**
 * Expands the current sector and then outputs it to the HTML document
 */
function expandSector() {
  if(!generateSystemsNumberWarning()) {
    return;
  }

  let newSystems = currentSector.generateSystems(NUMBER_OF_SYSTEMS_INPUT.value);  //generate new systems
  currentSector.systems.push(...newSystems);                                      //and push them into the currentSectors systems array

  outputSystems(newSystems);
}

/**
 * Handles the order change event
 */
function handleorderChange() {
  let orderHandler = new filteringHandler(currentSector);   //create new filteringHandler object with the currentSector
  orderHandler.orderSelectHandler(SYSTEMS_ORDER_SELECT);    //order the currentSector using the orderHandler

  SYSTEMS_LIST.innerHTML = '';                              //wipe the existing systems html
  outputSystems(currentSector.systems);                     //reouput the systems
}

/**
 * Exports the current sector to a JSON file
 * Does not include the government objects as this would cause a circular reference
 */
function exportSectorAsJson() {
  let sectorJson = JSON.stringify(currentSector, JSON_WHITELIST, 4);
  let blob = new Blob([sectorJson], {type: "application/json"});
  let url  = URL.createObjectURL(blob);

  let link = document.createElement('a');
  link.download = currentSector.name + '.json';
  link.href = url;
  link.click();
}

/**
 * Post page load
 *********************************************
 */

document.addEventListener("DOMContentLoaded", function(event) {         //when dom has loaded...
	GENERATE_SECTOR_BUTTON.addEventListener("click", function(event) {    //if generate sector button is clicked...
    generateNewSector();                                                //generate and output a new sector of space
  });

  EXPAND_SECTOR_BUTTON.addEventListener("click", function(event) {      //if expand sector button is clicked...
    expandSector();                                                     //generate and expand the current sector of space
  });

  SYSTEMS_ORDER_SELECT.addEventListener('change', function(event) {     //if the page order is clicked then...
    handleorderChange();
  });

  EXPORT_SECTOR_BUTTON.addEventListener('click', function(event) {      //if export sector button is clicked then...
    exportSectorAsJson();
  });
});