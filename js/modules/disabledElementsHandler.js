/**
 * @module disabledElementsHandler
 * 
 * Allows creation of handler objects for controlling disabled HTML elements
 */
export class disabledElementsHandler {

    /**
     * @param {HTMLSelectElement} systemsOrderSelect 
     * @param {HTMLElement} expandSectorBtn 
     * @param {HTMLElement} exportSectorBtn
     */
    constructor(systemsOrderSelect, expandSectorBtn, exportSectorBtn) {
        this.systemsOrderSelect = systemsOrderSelect;
        this.expandSectorBtn = expandSectorBtn;
        this.exportSectorBtn = exportSectorBtn;
    }

    /**
     * Removes/ disables the disabled attribute from controls that depend on a sector having been generated
     */
    enableSectorDependentControls() {
        this.systemsOrderSelect.disabled = false;
        this.expandSectorBtn.disabled = false;
        this.exportSectorBtn.disabled = false;
    }
}