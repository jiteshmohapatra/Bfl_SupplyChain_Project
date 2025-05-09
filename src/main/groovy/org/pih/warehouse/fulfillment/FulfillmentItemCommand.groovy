/**
 * Copyright (c) 2012 Partners In Health.  All rights reserved.
 * The use and distribution terms for this software are covered by the
 * Eclipse Public License 1.0 (http://opensource.org/licenses/eclipse-1.0.php)
 * which can be found in the file epl-v10.html at the root of this distribution.
 * By using this software in any fashion, you are agreeing to be bound by
 * the terms of this license.
 * You must not remove this notice, or any other, from this software.
 **/
package org.pih.warehouse.fulfillment

import grails.validation.Validateable
import org.pih.warehouse.inventory.InventoryItem
import org.pih.warehouse.requisition.RequisitionItem
import org.pih.warehouse.shipping.Shipment
import org.pih.warehouse.shipping.ShipmentItem

class FulfillmentItemCommand implements Serializable, Validateable {

    Shipment shipment
    RequisitionItem requestItem
    ShipmentItem shipmentItem
    InventoryItem inventoryItem
    Integer quantity

}

