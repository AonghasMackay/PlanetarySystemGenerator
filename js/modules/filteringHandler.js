/**
 * @module filteringHandler
 * 
 * Allows creation of handler objects for controlling disabled HTML elements
 */
export class filteringHandler {

  /**
   * @param {spaceSector} currentSector
   */
  constructor(currentSector) {
      this.currentSector = currentSector;
  }

  /**
   * Gets the value of the order select 
   * @param {HTMLSelectElement} systemsOrderSelect 
   */
  orderSelectHandler(systemsOrderSelect) {
    switch(systemsOrderSelect.value) {
      case 'population':
        this.orderByPopulation(this.currentSector);
        break;
  
      case 'planets':
        this.orderByPlanets(this.currentSector);
        break;
  
      case 'alphabetical':
        this.orderByName(this.currentSector);
        break;
  
      case 'moons':
        this.orderByMoons(this.currentSector);
        break;
  
      case 'government':
        this.orderByGovernment(this.currentSector);
        break;

      case 'system-wealth':
        this.orderByWealth(this.currentSector);
        break;

      case 'military':
        this.orderByMilitary(this.currentSector);
        break;
  
      default:
        this.orderByPopulation(this.currentSector);
    }
  }
  
  /**
   * @param {spaceSector} currentSector 
   */
  orderByPopulation(currentSector) {
    currentSector.systems.sort(function compareByPopulation(a, b) {
      if(a.totalPopulation >= b.totalPopulation) {
        return -1;
      }
      return 0;
    });
  }
  
  /**
   * @param {spaceSector} currentSector 
   */
  orderByPlanets(currentSector) {
    currentSector.systems.sort(function compareByPlanets(a, b) {
      if(a.planets.length >= b.planets.length) {
        return -1;
      }
      return 0;
    });
  }
  
  /**
   * @param {spaceSector} currentSector 
   */
  orderByName(currentSector) {
    currentSector.systems.sort((a, b) => a.systemName.localeCompare(b.systemName));
  }
  
  /**
   * @param {spaceSector} currentSector 
   */
  orderByMoons(currentSector) {
    currentSector.systems.sort(function compareByMoons(a, b) {
          if(a.totalNumOfMoons >= b.totalNumOfMoons) {
        return -1;
      }
      return 0;
    });
  }
  
  /**
   * @param {spaceSector} currentSector 
   */
  orderByGovernment(currentSector) {
    currentSector.systems.sort((a, b) => a.government.name.localeCompare(b.government.name));
  }

  /**
   * @param {spaceSector} currentSector 
   */
  orderByWealth(currentSector) {
    currentSector.systems.sort(function compareByWealth(a, b) {
      if(a.systemWealth >= b.systemWealth) {
        return -1;
      }
      return 0;
    });
  }

  /**
   * @param {spaceSector} currentSector 
   */
  orderByMilitary(currentSector) {
    currentSector.systems.sort(function compareByMilitary(a, b) {
      if(a.systemImportanceScore >= b.systemImportanceScore) {
        return -1;
      }
      return 0;
    });
  }
}